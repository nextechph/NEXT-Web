import {test,expect} from '@playwright/test';
import {postID} from './fixtures.mjs';
const graphs=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match=>{const data=JSON.parse(match[1]);return data['@graph']||[data];});
test('custom missing routes return 404, noindex, and useful branded recovery links',async({request,page})=>{
    for(const path of ['/this-page-does-not-exist',`/blog/22222222-2222-4222-8222-222222222222`]){
        const response=await request.get(path);expect(response.status()).toBe(404);const html=await response.text();expect(html).toContain('This page took a wrong turn.');expect(html).toMatch(/name="robots" content="[^"]*noindex/);expect(html).not.toContain('http-equiv="refresh"');
    }
    await page.route('**/fonts.googleapis.com/**',route=>route.abort());await page.route('**/googletagmanager.com/**',route=>route.abort());
    await page.goto('/this-page-does-not-exist');await expect(page.getByRole('heading',{name:'This page took a wrong turn.'})).toBeVisible();await expect(page.getByRole('link',{name:'Back to home'})).toHaveAttribute('href','/');
    await page.screenshot({path:'/tmp/next-web-custom-404.png',fullPage:true,animations:'disabled'});
    await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('metadata, matching service facts, and article schema are rendered in server HTML',async({request})=>{
    for(const [path,type] of [['/templates','CollectionPage'],['/second-boot','WebPage'],['/team','AboutPage'],['/contact','ContactPage']]){
        const response=await request.get(path);const html=await response.text();expect(response.status()).toBe(200);
        expect(html).toContain(`rel="canonical" href="https://nexttechnologyph.com${path}"`);expect(html).toContain('name="twitter:card" content="summary_large_image"');
        const data=graphs(html);expect(data.some(item=>item['@type']==='Organization')).toBe(true);expect(data.some(item=>item['@type']===type)).toBe(true);expect(data.some(item=>item['@type']==='BreadcrumbList')).toBe(true);
        if(path==='/templates'||path==='/second-boot'){expect(data.some(item=>item['@type']==='Service')).toBe(true);expect(data.some(item=>item['@type']==='FAQPage')).toBe(true);}
    }
    const html=await (await request.get(`/blog/${postID}`)).text();const article=graphs(html).find(item=>item['@type']==='BlogPosting');expect(article.publisher['@id']).toContain('#organization');expect(article.datePublished).toContain('2026-11-13');expect(article.headline).toBe('Server-rendered fixture article');
});
test('sitemap, crawler controls, and generated social image are available',async({request})=>{
    const sitemap=await (await request.get('/sitemap.xml')).text();expect(sitemap).toContain(`/blog/${postID}`);expect(sitemap).not.toMatch(/\/admin|\/this-page-does-not-exist/);
    const robots=await (await request.get('/robots.txt')).text();expect(robots).toContain('Allow: /');expect(robots).toContain('Disallow: /admin');expect(robots).toContain('https://nexttechnologyph.com/sitemap.xml');
    const image=await request.get('/opengraph-image');expect(image.status()).toBe(200);expect(image.headers()['content-type']).toContain('image/png');expect((await image.body()).length).toBeGreaterThan(5000);
});
