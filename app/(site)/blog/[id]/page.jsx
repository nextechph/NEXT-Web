import PageSEO from '../../../../components/PageSEO';
import { articleSchema } from '../../../../lib/seo';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { getPost,getPosts } from '../../../../lib/content';
import { safeURL,articleURL } from '../../../../lib/urls';
import { pageMetadata } from '../../../../lib/metadata';
import { formatArticle } from '../../../../lib/article-content';
import PageStyles from '../../../../components/PageStyles';
import ShareArticle from '../../../../components/ShareArticle';
import Newsletter from '../../../../components/Newsletter';
import JsonLD from '../../../../components/JsonLD';
export async function generateMetadata({params}){
    const {id}=await params;const post=await getPost(id);
    if(!post)return {title:'Article Not Found',robots:{index:false,follow:true}};
    const description=post.excerpt||`Read ${post.title} from NEXT Technology.`;
    const metadata=pageMetadata(post.title,description,articleURL(id));
    const schema=articleSchema(post);
    return {...metadata,openGraph:{...metadata.openGraph,type:'article',publishedTime:schema.datePublished,modifiedTime:schema.dateModified,authors:[post.author||'NEXT Technology'],images:safeURL(post.image_url)?[{url:safeURL(post.image_url),alt:post.title}]:metadata.openGraph.images},twitter:{...metadata.twitter,images:safeURL(post.image_url)?[safeURL(post.image_url)]:metadata.twitter.images}};
}
export default async function ArticlePage({params}){
    const {id}=await params;const post=await getPost(id);if(!post)notFound();const related=(await getPosts()).filter(p=>p.id!==id).slice(0,2);
    return <><PageStyles name="article"/><main><PageSEO title={post.title} description={post.excerpt} path={articleURL(id)} parents={[{name:'Blog',path:'/blog'}]}/><div className="article-container"><a href="/blog" className="back-link"><ArrowLeft/>Back to Blog</a><article><header className="article-header"><span className="post-category">{post.category}</span><h1 className="article-title">{post.title}</h1><div className="article-meta-info"><div className="post-meta"><div className="post-author"><div className="author-avatar">{safeURL(post.author_image_url)?<img src={safeURL(post.author_image_url)} alt={post.author||'NEXT Technology Team'}/>:<span>NT</span>}</div><div className="author-info"><span className="author-name">{post.author||'NEXT Technology Team'}</span><span className="post-date">{post.post_date}</span></div></div><span className="post-read-time"><Clock/>{post.read_time||'5 min read'}</span></div></div></header><div className="article-cover">{safeURL(post.image_url)?<img src={safeURL(post.image_url)} alt={post.title}/>:<span className="article-cover-placeholder">01</span>}</div><div className="article-body" dangerouslySetInnerHTML={{__html:formatArticle(post.content||'')}}/></article><ShareArticle/></div>{related.length>0&&<section className="related-articles"><h2 className="related-title">More Articles</h2><div className="related-grid">{related.map(p=><a className="related-card" href={articleURL(p.id)} key={p.id}><span className="post-category">{p.category}</span><h3>{p.title}</h3><p>{p.excerpt}</p></a>)}</div></section>}<Newsletter/></main><JsonLD data={articleSchema(post)}/></>;
}
