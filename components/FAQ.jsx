'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
export default function FAQ({items}){
    const [category,setCategory]=useState('all');const [open,setOpen]=useState(null);
    return <section className="faq-section" id="faq"><div className="section-container"><div className="section-header"><span className="section-tag">FAQ</span><h2 className="section-title">Frequently Asked Questions</h2><p className="section-subtitle">Everything you need to know before starting your project with NEXT Technology.</p></div><div className="faq-tabs" aria-label="Filter questions">{['all','Pricing','Process','Services','General'].map(cat=><button key={cat} className={`faq-tab${category===cat?' active':''}`} aria-pressed={category===cat} onClick={()=>{setCategory(cat);setOpen(null);}}>{cat==='all'?'All':cat}</button>)}</div><div className="faq-list">{items.map((item,i)=><div key={i} className={`faq-item${open===i?' open':''}`} hidden={category!=='all'&&item.category!==category}><button type="button" className="faq-question" aria-expanded={open===i} aria-controls={`faq-answer-${i}`} onClick={()=>setOpen(open===i?null:i)}><span>{item.question}</span><ChevronDown className="faq-chevron"/></button><div id={`faq-answer-${i}`} className="faq-answer" style={{maxHeight:open===i?'none':0}}><p>{item.answer}</p></div></div>)}</div></div></section>;
}
