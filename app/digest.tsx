'use client';
import {useState} from 'react';
import {TOPICS} from '../lib/topics.mjs';
import Link from 'next/link';
import {SiteHeader,SiteFooter} from './site-chrome';
type Article={id:string;original_title:string;original_url:string;source_name:string;topics:string[];excerpt:string;published_at:string|null};
type Dataset={updated_at:string|null;articles:Article[];sources:{id:string;name:string;status:string}[]};
export default function Digest({dataset}:{dataset:Dataset}){
 const [topic,setTopic]=useState('all'); const [query,setQuery]=useState(''); const [visibleCount,setVisibleCount]=useState(20);
 const topics=TOPICS.map(t=>t.id);
 const label=(id:string)=>TOPICS.find(t=>t.id===id)?.label || id;
 const articles=dataset.articles.filter(a=>(topic==='all'||a.topics.includes(topic))&&`${a.original_title} ${a.excerpt} ${a.source_name}`.toLowerCase().includes(query.toLowerCase()));
 return <><SiteHeader/>
 <main><section className="hero"><div className="eyebrow">YOUR DAILY EDGE</div><h1>Less noise.<br/><span>More signal.</span></h1><p>What's moving in quantum programming, software engineering and agentic engineering.<br/>Straight from the people building it.</p><div className="stats"><span>{dataset.articles.length} articles</span><span>{dataset.sources.filter(s=>s.status==='ok').length} active sources</span><span>{dataset.updated_at?`Collected ${new Date(dataset.updated_at).toISOString().slice(0,10)}`:'No updates yet'}</span></div></section>
 <section className="feed"><div className="feed-top"><h2>The latest <span>↘</span></h2><label className="search"><span className="sr-only">Search articles</span><input placeholder="Search the digest…" value={query} onChange={e=>{setQuery(e.target.value);setVisibleCount(20);}}/></label></div>
 <nav aria-label="Topics" className="filters">{['all',...topics].map(t=><button key={t} aria-pressed={topic===t} onClick={()=>{setTopic(t);setVisibleCount(20);}} className={topic===t?'active':''}>{t==='all'?'All signals':label(t)}</button>)}</nav>
 <div id="digest-results" className="grid">{articles.slice(0,visibleCount).map((a,index)=><article key={a.id} className={index===0?'card featured':'card'}><div className="meta"><span>{label(a.topics[0])}</span><time>{a.published_at?new Date(a.published_at).toISOString().slice(0,10):'Date unavailable'}</time></div><h3><a href={a.original_url} target="_blank" rel="noopener noreferrer">{a.original_title}</a></h3>{a.excerpt&&<p>{a.excerpt}</p>}<div className="card-bottom"><div><strong>{a.source_name}</strong></div><a aria-label={`Read ${a.original_title}`} href={a.original_url} target="_blank" rel="noopener noreferrer">↗</a></div></article>)}</div>
 {articles.length>0&&<div className="load-more"><p role="status">Showing {Math.min(visibleCount,articles.length)} of {articles.length} articles</p>{visibleCount<articles.length&&<button type="button" aria-controls="digest-results" onClick={()=>setVisibleCount(count=>count+20)}>Load more</button>}</div>}
 {articles.length===0&&<div className="empty"><h3>{dataset.articles.length?'No matching signals.':'No articles available.'}</h3><p>{dataset.articles.length?'Try a different topic or search.':'New articles will appear here.'}</p></div>}
 </section><section className="about-preview" aria-labelledby="about-preview-title"><div><div className="eyebrow">THE STORY BEHIND THE SIGNAL</div><h2 id="about-preview-title">Curiosity is better shared.</h2><p>QuantumDev started with my morning reading: dozens of publications, then Google Scholar. I built this free digest to help more people discover what is being built, and spend more time learning.</p><span className="preview-signature">Alexandre Pinel · Creator of QuantumDev</span></div><Link className="editorial-return" href="/about">Read the story behind QuantumDev <span aria-hidden="true">↗</span></Link></section><SiteFooter/></main></>
}
