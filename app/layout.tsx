import './globals.css';
export const metadata={title:'QuantumDev | Signal for builders',description:'Technology news from original sources. One place to stay ahead.'};
// A static, parser-blocking head script selects the theme before content paints.
const themeScript = `(()=>{let saved;try{saved=localStorage.getItem('quantumdev-theme')}catch{}document.documentElement.dataset.theme=saved==='light'||saved==='dark'?saved:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})()`;
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}} /></head><body>{children}</body></html>}
