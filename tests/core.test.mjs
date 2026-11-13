import test from 'node:test';
import assert from 'node:assert/strict';
import { safeURL,articleURL } from '../lib/urls.js';
import { inquiryPrompt,buildInquiry } from '../lib/inquiry.js';
import { formatArticle } from '../lib/article-content.js';
import config from '../next.config.mjs';

test('old public URLs redirect permanently and keep the article query for its compatibility route',async()=>{
    const redirects=await config.redirects();
    assert.equal(redirects.find(r=>r.source==='/index.html').destination,'/');
    for(const route of ['templates','second-boot','portfolio','planner','contact','blog','team','admin','admin-auth','article'])assert.deepEqual(redirects.find(r=>r.source===`/${route}.html`),{source:`/${route}.html`,destination:`/${route}`,permanent:true});
});
test('database URLs accept web links and reject active content',()=>{
    assert.equal(safeURL('javascript:alert(1)'), '');assert.equal(safeURL('data:text/html,foo'),'');assert.equal(safeURL('https://example.com/x'),'https://example.com/x');assert.equal(safeURL('example.com'),'https://example.com/');assert.equal(safeURL('/assets/logo.png'),'/assets/logo.png');assert.equal(articleURL('a/b'),'/blog/a%2Fb');
});
test('template and hardware inquiries keep their source even with a stale planner blueprint',()=>{
    const base={name:'Client',email:'client@example.com',phone:'123',method:'Email',description:'Test inquiry',raw:{type:'student',budget:'₱5,000'}};
    assert.equal(buildInquiry({...base,template:'Studio / Portfolio'}).inquiry_type,'Website Template');
    assert.equal(buildInquiry({...base,hardware:true}).subject,'Second Boot Inquiry');
    assert.equal(buildInquiry(base).inquiry_type,'Student Package');
    assert.match(inquiryPrompt('Studio',false),/Studio/);assert.match(inquiryPrompt('',true,'SSD upgrade'),/SSD upgrade/);
});
test('article rendering preserves headings and emphasis while removing unsafe HTML',()=>{
    assert.match(formatArticle('# Heading\n\n**Important** text'),/<h2>Heading<\/h2>/);
    assert.match(formatArticle('## Detail'),/<h3>Detail<\/h3>/);
    const html=formatArticle('<p>Hello<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">click</a></p>');
    assert.doesNotMatch(html,/<script|onerror|javascript:/i);assert.match(html,/<p>Hello/);
});
