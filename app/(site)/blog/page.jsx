import PageSEO from '../../../components/PageSEO';
import PageStyles from '../../../components/PageStyles';
import PageIntro from '../../../components/PageIntro';
import BlogGrid from '../../../components/BlogGrid';
import Newsletter from '../../../components/Newsletter';
import { getPosts } from '../../../lib/content';
import { pageMetadata } from '../../../lib/metadata';
export const metadata=pageMetadata('Blog','Insights on web development, design, and digital strategy from NEXT Technology.','/blog');
export default async function BlogPage(){const posts=await getPosts();return <><PageStyles name="blog"/><main><PageSEO title="Blog" description={metadata.description} path="/blog" type="CollectionPage"/><PageIntro page="blog" stats={[[posts.length,'Articles'],[new Set(posts.map(p=>p.category)).size,'Categories'],['2026','Est.']]}/><BlogGrid posts={posts}/><Newsletter/></main></>;}
