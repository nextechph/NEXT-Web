import { siteUrl } from './supabase-config';
export function pageMetadata(title, description, path = '') {
    const url=new URL(path||'/',`${siteUrl}/`).href;
    const image={url:'/opengraph-image',width:1200,height:630,alt:'NEXT Technology — Websites, digital solutions, and Second Boot PC services'};
    return {
        title, description,
        alternates: { canonical:url },
        robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
        openGraph: { title: `${title} | NEXT Technology`, description, url, siteName: 'NEXT Technology', type: 'website',locale:'en_PH', images:[image] },
        twitter: { card: 'summary_large_image', title:`${title} | NEXT Technology`, description, images:['/opengraph-image'] }
    };
}
