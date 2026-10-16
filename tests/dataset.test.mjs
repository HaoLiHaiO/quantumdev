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

test('Successful refresh keeps the newest 100 regardless of incoming order and puts undated items last',()=>{
 const articles=Array.from({length:125},(_,i)=>({...cached,id:String(i),source_id:source.id,original_url:`https://example.com/${i}`,published_at:new Date(Date.UTC(2026,0,1+i)).toISOString()}));
 const undated={...articles[0],id:'undated',original_url:'https://example.com/undated',published_at:null};
 const result=refreshDataset({articles:[]},[undated,...articles.reverse()],[source],[],1,now);
 assert.equal(result.articles.length,100);
 assert.equal(result.articles[0].id,'124');
 assert.equal(result.articles[99].id,'25');
 assert.ok(!result.articles.some(a=>a.id==='undated'));
});

test('Future feed dates from cached and incoming items cannot displace published articles',()=>{
 const item=(id,date)=>({...cached,id,source_id:source.id,original_url:`https://example.com/${id}`,published_at:date});
 const future=item('future','2026-10-21T17:00:00.000Z');
 const past=item('past','2026-10-13T00:00:00.000Z');
 const exact=item('exact',now);
 const result=refreshDataset({articles:[future]},[past,exact,item('future-incoming','2026-10-22T00:00:00.000Z')],[source],[],1,now);
 assert.deepEqual(result.articles.map(a=>a.id),['exact','past']);
 const later=refreshDataset({articles:[]},[future],[source],[],1,'2026-10-22T00:00:00.000Z');
 assert.equal(later.articles[0].id,'future');
});
