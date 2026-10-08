import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {registry,collectSource,mergeArticles} from '../lib/feeds.mjs';

const sources=registry(await readFile(new URL('../config/sources.yaml',import.meta.url),'utf8')).filter(source=>source.enabled);
const directory=new URL('../data/',import.meta.url); await mkdir(directory,{recursive:true});
const target=new URL('articles.json',directory);
let previous={articles:[],sources:[]};
try {previous=JSON.parse(await readFile(target,'utf8'));} catch(error) {if(error.code!=='ENOENT') throw error;}
const incoming=[]; const health=[]; let successes=0;
for(const source of sources) {
  const last=previous.sources?.find(item=>item.id===source.id);
  try {const articles=await collectSource(source); incoming.push(...articles); successes++; health.push({id:source.id,name:source.name,status:'ok',count:articles.length,last_success_at:new Date().toISOString()});}
  catch(error){health.push({id:source.id,name:source.name,status:'error',error:error.message,last_success_at:last?.last_success_at || null});}
}
const now=new Date().toISOString();
const dataset={updated_at:successes?now:previous.updated_at || null, attempted_at:now, articles:mergeArticles(previous.articles,incoming).slice(0,500),sources:health};
const temp=new URL('articles.json.tmp',directory); await writeFile(temp,JSON.stringify(dataset,null,2)+'\n'); await rename(temp,target);
console.log(JSON.stringify({articles:dataset.articles.length,sources:health},null,2));
if(!successes) process.exitCode=1;
