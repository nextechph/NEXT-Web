'use client';
import { useRef } from 'react';
import { safeURL } from '../lib/urls';
export function DesignPreview({item}) {
    const image=safeURL(item.image);
    if(image)return <img className="template-image" src={image} alt={`${item.title} design preview`} loading="lazy"/>;
    const style=['studio','business','shop'].includes(item.style)?item.style:'studio';
    const words={studio:['Independent by design.','Selected work','A space for your next big idea.'],business:['Good business starts here.','Our expertise','Thoughtful solutions. Real results.'],shop:['Everyday, considered.','The collection','Objects made to be part of your story.']}[style];
    return <div className={`design-mockup design-${style}`} aria-label={`${item.title} concept`}><div className="mock-nav"><b>YOUR BRAND</b><span>About &nbsp; Explore &nbsp; Contact</span></div><div className="mock-hero"><span>{item.category}</span><strong>{words[0]}</strong><p>{words[2]}</p><span className="mock-pill">Discover more ↗</span></div><div className="mock-bottom"><span>{words[1]}</span><div className="mock-tiles"><div/><div/><div/></div></div></div>;
}
function TemplateCard({item}) {
    const dialog=useRef(null);
    const href=`/contact?template=${encodeURIComponent(item.title)}`;
    return <article className="catalog-card"><DesignPreview item={item}/><div className="catalog-card-body"><span className="catalog-label">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><div className="catalog-actions"><button className="btn-secondary" type="button" onClick={()=>dialog.current.showModal()}>Preview design</button><a className="btn-primary" href={href}>Customize this ↗</a></div></div><dialog className="template-dialog" ref={dialog} aria-label={`${item.title} design preview`} onClick={event=>{if(event.target===dialog.current)dialog.current.close();}}><div className="preview-toolbar"><h2>{item.title}</h2><button className="btn-secondary" type="button" onClick={()=>dialog.current.close()}>Close preview ×</button></div><DesignPreview item={item}/><p className="preview-note">Concept preview. Your final site will be customized to your brand, content, and requirements.</p><a className="btn-primary" href={href}>Customize this design ↗</a></dialog></article>;
}
export default function TemplateCatalog({items}) {return <div className="catalog-grid" id="template-grid">{items.filter(item=>item.featured!==false).map((item,i)=><TemplateCard item={item} key={i}/>)}</div>;}
