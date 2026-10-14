import {classifyArticle} from './topics.mjs';
import Parser from 'rss-parser';
import { parse } from 'yaml';
import { createHash } from 'node:crypto';

export function httpUrl(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url : null; } catch { return null; }
}
export function registry(text) {
  const value = parse(text);
  if (value?.schema_version !== 1 || !Array.isArray(value.sources)) throw new Error('Unsupported source registry');
  const ids = new Set();
  for (const source of value.sources) {
    if (!/^[a-z0-9-]+$/.test(source.id ?? '') || ids.has(source.id)) throw new Error('Invalid or duplicate source id');
    ids.add(source.id);
    if (!source.name?.trim() || !httpUrl(source.website) || !httpUrl(source.feed_url) ||
        !source.source_language || !Array.isArray(source.topics) || !source.topics.length ||
        source.topics.some(topic => typeof topic !== 'string' || !topic.trim()) ||
        !['news', 'research'].includes(source.kind) || typeof source.enabled !== 'boolean') throw new Error(`Invalid source ${source.id}`);
  }
  return value.sources;
}
export function canonical(value) {
  const url = httpUrl(value);
  if (!url) return null;
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) if (/^utm_/i.test(key) || ['fbclid', 'gclid'].includes(key)) url.searchParams.delete(key);
  url.searchParams.sort();
  return url.toString();
}
export function mergeArticles(previous, incoming) {
  const items = new Map(); const aliases = new Map();
  for (const article of [...previous, ...incoming]) {
    const url = canonical(article.original_url); if (!url) continue;
    const feedKey = article.feed_id ? `${article.source_id}:${article.feed_id}` : null;
    const id = aliases.get(url) || (feedKey && aliases.get(feedKey)) || article.id;
    const old = items.get(id);
    items.set(id, {...old, ...article, id, original_url:url, collected_at:old?.collected_at || article.collected_at});
    aliases.set(url,id); if(feedKey) aliases.set(feedKey,id);
  }
  return [...items.values()].sort((a,b) => (Date.parse(b.published_at || '') || 0) - (Date.parse(a.published_at || '') || 0) || a.id.localeCompare(b.id));
}
export async function readBounded(response, maxBytes = 2_000_000) {
  const reader = response.body.getReader(); let size = 0; const chunks = [];
  try {
    while (true) { const {done,value} = await reader.read(); if(done) break; size += value.length; if(size > maxBytes) throw new Error('Feed exceeds size limit'); chunks.push(value); }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks).toString('utf8');
}
export async function collectSource(source, fetcher = fetch) {
  const response = await fetcher(source.feed_url, {signal:AbortSignal.timeout(15000), headers:{'User-Agent':'QuantumDev/0.1 RSS reader'}});
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const feed = await new Parser().parseString(await readBounded(response));
  const now = new Date().toISOString();
  return (feed.items || []).slice(0,40).flatMap(item => {
    const url = canonical(item.link); if(!url || !item.title?.trim()) return [];
    const parsed = Date.parse(item.isoDate || item.pubDate || '');
    const article = {id:createHash('sha256').update(url).digest('hex').slice(0,24), feed_id:item.guid || item.id || null,
      source_id:source.id, source_name:source.name, original_title:item.title.trim(), original_url:url,
      source_language:source.source_language, topics:source.topics, kind:source.kind,
      published_at:Number.isFinite(parsed)?new Date(parsed).toISOString():null, collected_at:now,
      excerpt:String(item.contentSnippet || item.summary || '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,360)};
    if (source.topics.some(t=>['quantum-programming','software-engineering','agentic-engineering'].includes(t))) {
      article.topics=classifyArticle(article,source);
      if (!article.topics.length) return [];
    }
    return [article];
  });
}
