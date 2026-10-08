'use client';
import {useMemo,useState} from 'react';
type Article={id:string;original_title:string;original_url:string;source_name:string;topics:string[];excerpt:string;published_at:string|null};
type Dataset={updated_at:string|null;articles:Article[];sources:{id:string;name:string;status:string}[]};
export default function Digest({dataset}:{dataset:Dataset}){
 const [topic,setTopic]=useState('all'); const [query,setQuery]=useState('');
 const topics=useMemo(()=>[...new Set(dataset.articles.flatMap(a=>a.topics))].sort(),[dataset]);
 const articles=dataset.articles.filter(a=>(topic==='all'||a.topics.includes(topic))&&`${a.original_title} ${a.excerpt} ${a.source_name}`.toLowerCase().includes(query.toLowerCase()));
 const failed=dataset.sources.filter(s=>s.status==='error');
 return <><header className="top"><a className="brand" href="/">Q<span>QuantumDev</span><i> / DIGEST</i></a><span className="edition">ENGLISH EDITION <b>●</b></span></header>
 <main><section className="hero"><div className="eyebrow">YOUR DAILY EDGE</div><h1>Less noise.<br/><span>More signal.</span></h1><p>What's moving in AI, engineering and infrastructure.<br/>Straight from the people building it.</p><div className="stats"><span>{dataset.articles.length} articles</span><span>{dataset.sources.filter(s=>s.status==='ok').length} active sources</span><span>{dataset.updated_at?`Collected ${new Date(dataset.updated_at).toISOString().slice(0,10)}`:'Awaiting first collection'}</span></div></section>
 <section className="feed"><div className="feed-top"><h2>The latest <span>↘</span></h2><label className="search"><span className="sr-only">Search articles</span><input placeholder="Search the digest…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
 <nav aria-label="Topics" className="filters">{['all',...topics].map(t=><button key={t} aria-pressed={topic===t} onClick={()=>setTopic(t)} className={topic===t?'active':''}>{t==='all'?'All signals':t}</button>)}</nav>
 {failed.length>0&&<p className="notice">Some sources could not refresh: {failed.map(s=>s.name).join(', ')}. Previously collected articles remain available.</p>}
 <div className="grid">{articles.map((a,index)=><article key={a.id} className={index===0?'card featured':'card'}><div className="meta"><span>{a.topics[0]}</span><time>{a.published_at?new Date(a.published_at).toISOString().slice(0,10):'Date unavailable'}</time></div><h3><a href={a.original_url} target="_blank" rel="noopener noreferrer">{a.original_title}</a></h3>{a.excerpt&&<p>{a.excerpt}</p>}<div className="card-bottom"><div><strong>{a.source_name}</strong><small>Source excerpt</small></div><a aria-label={`Read ${a.original_title}`} href={a.original_url} target="_blank" rel="noopener noreferrer">↗</a></div></article>)}</div>
 {articles.length===0&&<div className="empty"><h3>{dataset.articles.length?'No matching signals.':'The digest is warming up.'}</h3><p>{dataset.articles.length?'Try a different topic or search.':'New articles will appear after the first source collection.'}</p></div>}
 </section><footer><span>QuantumDev</span><p>Original sources. Clear attribution. Built for curious minds.</p><span>Prototype · English</span></footer></main></>
}
