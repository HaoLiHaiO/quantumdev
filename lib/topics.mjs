export const TOPICS = [
  {id:'quantum-programming', label:'Quantum Programming'},
  {id:'software-engineering', label:'Software Engineering'},
  {id:'agentic-engineering', label:'Agentic Engineering'},
];

// Conservative editorial rules; general ML articles are outside this digest.
export function classifyArticle(article, source) {
  if (source.id === 'qiskit') return ['quantum-programming'];
  const text = `${article.original_title} ${article.excerpt} ${article.original_url}`;
  if (/\b(agent(?:s|ic)?|multi[- ]agent|copilot|tool[- ](?:use|calling)|mcp)\b/i.test(text)) return ['agentic-engineering'];
  if (source.topics.includes('software-engineering')) return ['software-engineering'];
  return [];
}

export function scopeArticles(articles, sources) {
  const enabled = new Map(sources.filter(s=>s.enabled).map(s=>[s.id,s]));
  return articles.flatMap(article=>{
    const source=enabled.get(article.source_id);
    if (!source) return [];
    const topics=classifyArticle(article,source);
    return topics.length ? [{...article,topics}] : [];
  });
}
