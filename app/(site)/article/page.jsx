import { permanentRedirect } from 'next/navigation';
export default async function LegacyArticle({searchParams}){const {id}=await searchParams;permanentRedirect(typeof id==='string'?`/blog/${encodeURIComponent(id)}`:'/blog');}
