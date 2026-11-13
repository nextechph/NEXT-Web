import { siteUrl } from '../lib/supabase-config';
export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/admin-auth']},sitemap:`${siteUrl}/sitemap.xml`};}
