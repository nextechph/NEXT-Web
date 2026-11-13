import './globals.css';
import Script from 'next/script';
import { siteUrl } from '../lib/supabase-config';
export const metadata = {
    metadataBase: new URL(siteUrl),
    title: { default: "NEXT Technology | Building What's Next.", template: '%s | NEXT Technology' },
    description: 'Modern websites, digital solutions, and custom PCs by NEXT Technology.',
    applicationName: 'NEXT Technology',
    category: 'technology',
    referrer: 'strict-origin-when-cross-origin',
    verification: {google:process.env.GOOGLE_SITE_VERIFICATION,other:process.env.BING_SITE_VERIFICATION?{'msvalidate.01':process.env.BING_SITE_VERIFICATION}:undefined},
    icons: { icon: '/assets/favicon.png', apple: '/assets/favicon.png' }
};
const themeScript = "try{document.documentElement.dataset.theme=localStorage.getItem('theme')||'dark'}catch{document.documentElement.dataset.theme='dark'}";
export default function RootLayout({children}) {
    return <html lang="en" data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;600;800&family=Barlow+Condensed:wght@300;700;800&display=swap" rel="stylesheet"/></head><body>{children}<Script src="https://www.googletagmanager.com/gtag/js?id=G-0PCYQ5038T" strategy="afterInteractive"/><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-0PCYQ5038T');`}</Script></body></html>;
}
