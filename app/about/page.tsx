import Link from 'next/link';
import {SiteHeader,SiteFooter} from '../site-chrome';
import AuthorSignature from '../author-signature';

export const metadata={title:'Why I built QuantumDev | Alexandre Pinel',description:'A personal note from Alexandre Pinel on daily learning, building for the future, and making technical knowledge easier to discover. Free to read, built to share.'};

export default function About(){
 return <><SiteHeader/><main className="about-main"><article className="editorial" aria-labelledby="editorial-title"><header className="editorial-heading"><div className="eyebrow">A NOTE FROM THE CREATOR</div><h1 id="editorial-title">Why I built<br/><span>QuantumDev.</span></h1><p className="editorial-deck">The future moves fast. Understanding it shouldn't take your entire morning.</p><AuthorSignature/></header>
 <div className="editorial-body">
 <p>My mornings used to begin with a small expedition across the internet. Several technology sites, engineering blogs, release notes, research announcements. Then Google Scholar, because an interesting idea usually raises more questions than it answers. One article would lead to a paper, the paper to a project, and the project to something I wanted to try myself. Before the day had properly started, I already had another collection of tabs open.</p>
 <p>I was reading dozens of publications. I never counted them precisely. The point was the curiosity: there was always something worth understanding, and I wanted to get closer to the people actually building it. I enjoyed the reading. Finding my way through all those sources, every morning, was another matter.</p>
 <h2>Always learning. Already looking ahead.</h2>
 <p>I'm Alexandre Pinel, a Senior Software Engineer and Software Architect. I build software, experiment with agents, and spend a considerable amount of time thinking about what humans and machines will be able to do together. The practical engineering and the bigger questions belong in the same conversation for me.</p>
 <p>Agentic engineering, quantum programming, the evolution of software: these are things I want to understand by reading, testing and building. When something sounds like science fiction, my instinct is to look for the research behind it and see what already works. Sometimes the answer is surprisingly far along. Sometimes it is a reminder that there is still a lot of engineering to do.</p>
 <p>That is why I keep learning every day. A new tool can change how I work. A paper can change how I think. A conversation can expose a blind spot I didn't know I had. I want to stay open to all three, and turn what I learn into things people can use.</p>
 <h2>A personal habit, turned into a shared resource.</h2>
 <p>QuantumDev grew out of a simple question: if I'm already spending this much time following these fields, could I make that knowledge easier for other people to find?</p>
 <p>A developer fitting some reading between projects. A student discovering a field they might spend their life working in. A researcher looking beyond their own speciality. Someone learning after work, from a place where the nearest technology conference is very far away. I wanted to build something that could be useful to all of them.</p>
 <p>The digest brings technical publications together, with clear sources and direct links to the originals. You can scan what is happening, follow a topic, and choose where to go deeper. The publishers, engineers and researchers deserve the credit for their work. My contribution is to help more people discover it, with less time spent searching.</p>
 <blockquote>If this saves someone part of their morning, or helps them discover an idea they can build on, it has already done something useful.</blockquote>
 <h2>Free to explore. Built with respect for your time.</h2>
 <p>I'm building QuantumDev and making it available for free. There is no account to create, no paywall around the digest, and no intrusive advertising between you and the articles. I want opening this site to feel easy. Come in, find something useful, and get back to whatever you are learning or building.</p>
 <p>That choice matters to me. Curiosity is everywhere; time and resources are distributed much less evenly. A useful starting point should be available to someone simply because they want to learn. I hope this small project can give a little more of that opportunity to people I will probably never meet.</p>
 <h2>One more contribution to something bigger.</h2>
 <p>QuantumDev is one of the many things I'm trying to build, share and improve. I see each of them as another small contribution to a future where more people can understand technology and help shape it. The ambition is broad. The work happens one useful thing at a time.</p>
 <p>I'll keep reading, experimenting and learning. This site will evolve with that work. If it helps you ask a better question, discover a new field, or start a project of your own, then I'm glad I put it into the world.</p>
 <p>Thanks for being curious. There is a lot ahead of us.</p>
 </div><div className="editorial-signoff"><AuthorSignature/><Link className="editorial-return" href="/">Explore the digest <span aria-hidden="true">↗</span></Link></div></article><SiteFooter/></main></>;
}
