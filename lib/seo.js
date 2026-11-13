import { siteUrl } from './supabase-config.js';
import { safeURL } from './urls.js';
export const organizationID=`${siteUrl}/#organization`;
export const websiteID=`${siteUrl}/#website`;
export const absoluteURL=path=>new URL(path||'/',`${siteUrl}/`).href;
export function organizationGraph(settings={}){
    const sameAs=['facebook','twitter','instagram','tiktok'].map(key=>safeURL(settings[key])).filter(Boolean);
    return {'@context':'https://schema.org','@graph':[
        {'@type':'Organization','@id':organizationID,name:'NEXT Technology',url:absoluteURL('/'),logo:{'@type':'ImageObject',url:absoluteURL('/assets/logo.png')},description:'NEXT Technology designs and develops websites and digital solutions. Second Boot by NEXT provides PC building, upgrades, and hardware services.',email:settings.email||'hello@nexttechnologyph.com',...(sameAs.length?{sameAs}:{}),contactPoint:{'@type':'ContactPoint',contactType:'customer inquiries',url:absoluteURL('/contact'),email:settings.email||'hello@nexttechnologyph.com'}},
        {'@type':'WebSite','@id':websiteID,name:'NEXT Technology',url:absoluteURL('/'),publisher:{'@id':organizationID},inLanguage:'en'}
    ]};
}
export function pageGraph({title,description,path,type='WebPage',parents=[],extra=[]}){
    const url=absoluteURL(path);
    const crumbs=[{name:'Home',path:'/'},...parents,{name:title,path}];
    return {'@context':'https://schema.org','@graph':[
        {'@type':type,'@id':`${url}#webpage`,url,name:title,description,isPartOf:{'@id':websiteID},about:{'@id':organizationID},inLanguage:'en',breadcrumb:{'@id':`${url}#breadcrumbs`}},
        {'@type':'BreadcrumbList','@id':`${url}#breadcrumbs`,itemListElement:crumbs.map((crumb,i)=>({'@type':'ListItem',position:i+1,name:crumb.name,item:absoluteURL(crumb.path)}))},
        ...extra
    ]};
}
export function serviceCatalog(content,path){
    return {'@type':'Service','@id':`${absoluteURL(path)}#service`,name:content.title,description:content.description,url:absoluteURL(path),provider:{'@id':organizationID},hasOfferCatalog:{'@type':'OfferCatalog',name:content.title,itemListElement:content.items.filter(item=>item.featured!==false).map(item=>({'@type':'Offer',itemOffered:{'@type':'Service',name:item.title,description:item.description,provider:{'@id':organizationID}}}))}};
}
export function validDate(value){
    if(!value)return undefined;
    let input=value;
    // Editorial date labels have no timezone; keep their calendar day consistent
    // between local development (Manila) and UTC production servers.
    if(typeof value==='string'){
        if(/^\d{4}-\d{2}-\d{2}$/.test(value))input=`${value}T00:00:00Z`;
        else if(/^[A-Za-z]+ \d{1,2}, \d{4}$/.test(value))input=`${value} 00:00:00 GMT`;
    }
    const date=new Date(input);
    return Number.isNaN(date.getTime())?undefined:date.toISOString();
}
export function articleSchema(post){
    const url=absoluteURL(`/blog/${encodeURIComponent(post.id)}`);
    return {'@context':'https://schema.org','@type':'BlogPosting','@id':`${url}#article`,headline:post.title,description:post.excerpt||undefined,url,mainEntityOfPage:{'@id':`${url}#webpage`},isPartOf:{'@id':websiteID},publisher:{'@id':organizationID},author:post.author?{'@type':'Person',name:post.author}:{'@id':organizationID},datePublished:validDate(post.post_date)||validDate(post.created_at),dateModified:validDate(post.updated_at),image:safeURL(post.image_url)||absoluteURL('/opengraph-image'),inLanguage:'en'};
}
