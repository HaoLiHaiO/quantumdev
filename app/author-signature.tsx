import Image from 'next/image';

export default function AuthorSignature(){
 return <div className="author-signature"><Image src="/images/alexandre-pinel.jpg" alt="Alexandre Pinel" width={128} height={128} className="author-portrait"/><div><a href="https://alexandrepinel.com" target="_blank" rel="noopener noreferrer" className="author-name">Alexandre Pinel ↗</a><p>Creator of QuantumDev</p><span>Senior Software Engineer &amp; Software Architect</span></div></div>;
}
