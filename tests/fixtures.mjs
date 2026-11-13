import fs from 'node:fs';
import { createServer } from 'node:http';
const sections=JSON.parse(fs.readFileSync(new URL('../lib/section-defaults.json',import.meta.url)));
const defaults=JSON.parse(fs.readFileSync(new URL('../lib/content-defaults.json',import.meta.url)));
export const postID='11111111-1111-4111-8111-111111111111';
export const fixtures={
    site_settings:[{id:1,badge:'Fixture availability',subtitle:'Modern Websites. Digital Solutions.',footer_desc:'NEXT Technology builds websites and computers.',email:'hello@nexttechnologyph.com',location:'Metro Manila, Philippines'}],
    homepage_sections:Object.entries(sections).map(([id,content])=>({id,content})),
    services:defaults.SERVICES_DEFAULTS.map(s=>({...s,desc_text:s.desc})),
    faqs:defaults.FAQ_DEFAULTS,
    team_members:[{id:postID,name:'Test Founder',role:'Founder & CEO',badge:'Founder',bio:'Building what is next.',skills:['Web Development']}],
    portfolio_projects:[{id:postID,name:'Fixture Website',tag:'business',desc_text:'A custom business website.',status:'live',url:'https://example.com'}],
    blog_posts:[{id:postID,title:'Server-rendered fixture article',excerpt:'This article is available before JavaScript.',content:'# A visible heading\n\n**Important** article content.',category:'Development',author:'NEXT Technology Team',post_date:'November 13, 2026',read_time:'3 min read',status:'published',created_at:'2026-11-13T00:00:00Z'}],
    planner_config:[{id:1,student:{title:'Student Starter Package',base:5000,desc:'1-page website'},addons:[{label:'Contact Form',price:1000,note:''}],tiers:[{name:'Starter',range:'₱10k – ₱25k',ideal:'Small sites',mult:1}],timeline:[{label:'Standard',note:'1–2 months'}],contact_methods:['Email','WhatsApp']}],
    contact_submissions:[],subscribers:[]
};
export function responseFor(url,method='GET',body=null){
    const parsed=new URL(url,'http://localhost');const table=parsed.pathname.split('/').at(-1);let rows=fixtures[table]||[];
    if(method==='POST'||method==='PATCH')return {status:201,body:'',headers:{}};
    if(method==='DELETE')return {status:204,body:'',headers:{}};
    for(const [key,value] of parsed.searchParams){if(value.startsWith('eq.'))rows=rows.filter(row=>String(row[key])===value.slice(3));}
    const single=body?.accept?.includes('vnd.pgrst.object');
    return {status:200,body:JSON.stringify(single?(rows[0]||null):rows),headers:{'content-type':'application/json','content-range':`0-${Math.max(0,rows.length-1)}/${rows.length}`}};
}
export function startFixtureServer(port=45451){
    const server=createServer((request,response)=>{
        const result=responseFor(request.url,request.method,{accept:request.headers.accept||''});
        response.writeHead(result.status,{...result.headers,'access-control-allow-origin':'*','access-control-allow-headers':'*'});response.end(request.method==='HEAD'?'':result.body);
    });
    return new Promise(resolve=>server.listen(port,'127.0.0.1',()=>resolve(server)));
}
