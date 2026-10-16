'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import ThemeToggle from './theme-toggle';

export function SiteHeader(){
 const pathname=usePathname();
 return <header id="top" className="top" tabIndex={-1}>
  <Link className="brand" href="/" aria-label="QuantumDev home"><svg className="brand-mark" width="40" height="40" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="30" cy="30" r="16" fill="none" stroke="currentColor" strokeWidth="8"/><path d="m38 38 12 12" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/></svg><span>QuantumDev</span><i> / DIGEST</i></Link>
  <div className="header-actions"><nav className="main-nav" aria-label="Main navigation"><Link href="/" aria-current={pathname==='/'?'page':undefined}>Digest</Link><Link href="/about" aria-current={pathname==='/about'?'page':undefined}>About</Link></nav><span className="edition">ENGLISH EDITION <b>●</b></span><ThemeToggle/></div>
 </header>;
}

export function SiteFooter(){
 return <footer className="site-footer"><div className="footer-brand"><span>© {new Date().getFullYear()} Quantum Dev</span><p>Original sources. Clear attribution. Built for curious minds.</p></div><section className="footer-partners" aria-labelledby="partners-heading"><h2 id="partners-heading">Partners</h2><a href="https://alexandrepinel.com" target="_blank" rel="noopener noreferrer">Alexandre Pinel ↗</a></section><div className="footer-bottom"><Link href="/about">About QuantumDev</Link><a className="back-to-top" href="#top">Back to top <span aria-hidden="true">↑</span></a></div></footer>;
}
