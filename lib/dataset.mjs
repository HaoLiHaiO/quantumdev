import {mergeArticles} from './feeds.mjs';
import {scopeArticles} from './topics.mjs';

export function refreshDataset(previous, incoming, sources, health, successes, now) {
  return {
    updated_at: successes ? now : previous.updated_at || null,
    attempted_at: now,
    articles: successes
      ? scopeArticles(mergeArticles(previous.articles, incoming), sources).filter(article => !article.published_at || Date.parse(article.published_at) <= Date.parse(now)).slice(0,100)
      : previous.articles,
    sources: health,
  };
}
