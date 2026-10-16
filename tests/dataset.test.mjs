import test from 'node:test';
import assert from 'node:assert/strict';
import {refreshDataset} from '../lib/dataset.mjs';
const cached={id:'cached',source_id:'removed-source',original_url:'https://example.com/cached',original_title:'Cached article',topics:['infrastructure']};
const previous={updated_at:'2026-10-09T00:00:00.000Z',articles:[cached]};
const now='2026-10-14T00:00:00.000Z';
const source={id:'quantum-feed',enabled:true,topics:['quantum-programming']};
test('Total failure retains every cached article and successful timestamp while recording errors',()=>{
 const health=[{id:source.id,status:'error',error:'offline'}];
 const result=refreshDataset(previous,[],[source],health,0,now);
 assert.deepEqual(result.articles,previous.articles);
 assert.equal(result.updated_at,previous.updated_at);
 assert.equal(result.attempted_at,now);
 assert.deepEqual(result.sources,health);
});
test('Partial success updates, deduplicates and applies current registry scope',()=>{
 const incoming={...cached,id:'new',source_id:source.id,original_url:'https://example.com/new'};
 const health=[{id:source.id,status:'ok'},{id:'failed',status:'error'}];
 const result=refreshDataset(previous,[incoming,incoming],[source],health,1,now);
 assert.equal(result.updated_at,now);
 assert.equal(result.articles.length,1);
 assert.deepEqual(result.articles[0].topics,['quantum-programming']);
 assert.deepEqual(result.sources,health);
});
