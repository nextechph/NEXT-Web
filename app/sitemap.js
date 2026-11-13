import { getPosts } from '../lib/content';
import { siteUrl } from '../lib/supabase-config';
import { validDate } from '../lib/seo';
export const dynamic='force-dynamic';
export default async function sitemap(){
    const pages=['','/templates','/second-boot','/portfolio','/planner','/contact','/blog','/team'];
    const posts=await getPosts();
    return [...pages.map(path=>({url:`${siteUrl}${path||'/'}`,changeFrequency:path==='/blog'?'weekly':'monthly',priority:path?0.8:1})),...posts.map(post=>({url:`${siteUrl}/blog/${post.id}`,lastModified:validDate(post.updated_at)||validDate(post.created_at),changeFrequency:'monthly',priority:0.7}))];
}
