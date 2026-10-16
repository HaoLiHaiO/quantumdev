import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {registry} from '../lib/feeds.mjs';

import {collectSources} from '../lib/collector.mjs';
import {refreshDataset} from '../lib/dataset.mjs';

const sources=registry(await readFile(new URL('../config/sources.yaml',import.meta.url),'utf8')).filter(source=>source.enabled);
const directory=new URL('../data/',import.meta.url); await mkdir(directory,{recursive:true});
const target=new URL('articles.json',directory);
let previous={articles:[],sources:[]};
try {previous=JSON.parse(await readFile(target,'utf8'));} catch(error) {if(error.code!=='ENOENT') throw error;}
const {incoming,health,successes}=await collectSources(sources,previous.sources);
const now=new Date().toISOString();
const dataset=refreshDataset(previous,incoming,sources,health,successes,now);
const temp=new URL('articles.json.tmp',directory); await writeFile(temp,JSON.stringify(dataset,null,2)+'\n'); await rename(temp,target);
console.log(JSON.stringify({articles:dataset.articles.length,sources:health},null,2));
if(!successes) process.exitCode=1;
