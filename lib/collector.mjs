import {collectSource} from './feeds.mjs';

// Keep request/memory pressure bounded as the registry grows. Store results in
// registry order so completion timing cannot change duplicate resolution.
export async function collectSources(sources, previousHealth = [], collect = collectSource, concurrency = 6) {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) throw new Error('Invalid collection concurrency');
  const results = new Array(sources.length);
  let cursor = 0;
  await Promise.all(Array.from({length:Math.min(concurrency,sources.length)},async()=>{
    while (cursor < sources.length) {
      const index = cursor++;
      const source = sources[index];
      const last = previousHealth.find(item=>item.id===source.id);
      try {
        const articles = await collect(source);
        results[index] = {articles, health:{id:source.id,name:source.name,status:'ok',count:articles.length,last_success_at:new Date().toISOString()}};
      } catch (error) {
        results[index] = {articles:[],health:{id:source.id,name:source.name,status:'error',error:error.message,last_success_at:last?.last_success_at || null}};
      }
    }
  }));
  return {incoming:results.flatMap(result=>result.articles),health:results.map(result=>result.health),successes:results.filter(result=>result.health.status==='ok').length};
}
