import { Fragment } from 'react';
const content={
    portfolio:{tag:'PORTFOLIO',title:'Our',accent:'Work.',subtitle:'Real projects. Live websites. Every build engineered for performance, crafted for impact.'},
    blog:{tag:'BLOG',title:'Ideas &',accent:'Insights.',subtitle:'Web development deep-dives, design thinking, and digital strategy—straight from the NEXT Technology team.'},
    team:{tag:'Leadership & Architects',title:'The Minds Behind',accent:"What’s Next.",subtitle:'Meet the founders, executive leaders, and system architects guiding NEXT Technology. Driven by innovation, precision engineering, and an uncompromising commitment to minimalist digital excellence.'}
};
export default function PageIntro({page,stats=[]}){
    const data=content[page];
    return <section className={`${page}-page-hero`}><span className="section-tag fade-in">{data.tag}</span><h1 className={`${page}-page-title fade-in`}>{data.title}<br/><span>{data.accent}</span></h1><p className={`${page}-page-subtitle fade-in`}>{data.subtitle}</p><div className={`${page}-page-meta fade-in`}>{stats.map(([value,label],i)=><Fragment key={label}>{i>0&&<div className="meta-divider"/>}<div className="meta-stat"><span className="meta-stat-num">{value}</span><span className="meta-stat-label">{label}</span></div></Fragment>)}</div></section>;
}
