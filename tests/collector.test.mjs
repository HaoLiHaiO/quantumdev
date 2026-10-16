import test from 'node:test';
import assert from 'node:assert/strict';
import {collectSources} from '../lib/collector.mjs';
import {readBounded} from '../lib/feeds.mjs';

test('Collection bounds concurrency, isolates failures and preserves registry order',async()=>{
  let active=0,maximum=0;
  const sources=Array.from({length:9},(_,i)=>({id:String(i),name:String(i)}));
  const result=await collectSources(sources,[{id:'2',last_success_at:'2026-10-01'}],async source=>{
    active++;maximum=Math.max(maximum,active);
    await new Promise(resolve=>setTimeout(resolve,(9-Number(source.id))*2));active--;
    if(source.id==='2')throw new Error('Unavailable');
    return [{source_id:source.id}];
  },3);
  assert.equal(maximum,3);assert.equal(active,0);assert.equal(result.successes,8);
  assert.deepEqual(result.health.map(x=>x.id),sources.map(x=>x.id));
  assert.deepEqual(result.incoming.map(x=>x.source_id),['0','1','3','4','5','6','7','8']);
  assert.equal(result.health[2].last_success_at,'2026-10-01');assert.equal(result.health[2].error,'Unavailable');
});
test('Collection handles empty registries and rejects unbounded concurrency',async()=>{
  assert.deepEqual(await collectSources([]),{incoming:[],health:[],successes:0});
  await assert.rejects(collectSources([],[],undefined,0),/concurrency/);
});
test('Feed reads retain a hard byte ceiling',async()=>{
  assert.equal((await readBounded(new Response('x'.repeat(2_000_001)))).length,2_000_001);
  await assert.rejects(readBounded(new Response('x'.repeat(8_000_001))),/size limit/);
});
