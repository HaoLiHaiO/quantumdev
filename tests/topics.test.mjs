import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyArticle,scopeArticles,TOPICS} from '../lib/topics.mjs';
const software={id:'github-blog',enabled:true,topics:['software-engineering']};
const agents={id:'hugging-face',enabled:true,topics:['agentic-engineering']};
const article=(title,source_id)=>({original_title:title,excerpt:'',original_url:'https://example.com/article',source_id});
test('Only the three editorial categories are available',()=>assert.deepEqual(TOPICS.map(t=>t.id),['quantum-programming','software-engineering','agentic-engineering']));
test('General ML is not relabeled as agentic engineering',()=>{
 assert.deepEqual(classifyArticle(article('Fine tuning a speech model','hugging-face'),agents),[]);
 assert.deepEqual(classifyArticle(article('Give your coding agents a memory','hugging-face'),agents),['agentic-engineering']);
 assert.deepEqual(classifyArticle(article('Code review agents','github-blog'),software),['agentic-engineering']);
 assert.deepEqual(classifyArticle(article('Improving code quality','github-blog'),software),['software-engineering']);
});
test('Migration removes disabled infrastructure and irrelevant ML, retaining relevant records',()=>{
 const records=[article('DNS update','cloudflare'),article('Speech model','hugging-face'),article('Agent memory','hugging-face'),article('2.3 release','qiskit')];
 const scoped=scopeArticles(records,[software,agents,{id:'qiskit',enabled:true,topics:['quantum-programming']}]);
 assert.equal(scoped.length,2); assert.deepEqual(scoped.map(a=>a.topics[0]),['agentic-engineering','quantum-programming']);
 assert.deepEqual(scopeArticles(scoped,[software,agents,{id:'qiskit',enabled:true,topics:['quantum-programming']}]),scoped);
});

test('Quantum classification follows registry topics for any source ID',()=>{
 const source={id:'another-quantum-publisher',enabled:true,topics:['quantum-programming']};
 const record=article('New SDK release',source.id);
 assert.deepEqual(classifyArticle(record,source),['quantum-programming']);
 assert.deepEqual(scopeArticles([record],[source])[0].topics,['quantum-programming']);
});

test('Focused agent project releases retain generic version titles, broad feeds stay filtered',()=>{
  const article={original_title:'v1.2.3',excerpt:'Bug fixes',original_url:'https://example.com/releases/v1'};
  const source={id:'agent-tool',topics:['agentic-engineering'],relevance:'focused'};
  assert.deepEqual(classifyArticle(article,source),['agentic-engineering']);
  assert.deepEqual(classifyArticle(article,{...source,relevance:'filtered'}),[]);
});
