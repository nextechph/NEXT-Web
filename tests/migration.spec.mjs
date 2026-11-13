import { test,expect } from '@playwright/test';
import { responseFor,postID } from './fixtures.mjs';

test.beforeEach(async({page})=>{
    await page.route('**/rest/v1/**',async route=>{const result=responseFor(route.request().url(),route.request().method(),{accept:route.request().headers().accept||''});await route.fulfill(result);});
    await page.route('**/googletagmanager.com/**',route=>route.abort());
    await page.route('**/fonts.googleapis.com/**',route=>route.abort());
    await page.route('**/fonts.gstatic.com/**',route=>route.abort());
});
test('server HTML contains database content, metadata, and no homepage catalogs',async({request})=>{
    const home=await request.get('/');expect(home.status()).toBe(200);const html=await home.text();expect(html).toContain('Fixture availability');expect(html).not.toContain('id="template-grid"');expect(html).not.toContain('id="boot-grid"');
    for(const [path,text] of [['/templates','Studio / Portfolio'],['/second-boot','Legacy, with a new lease on life.'],['/portfolio','Fixture Website'],['/team','Test Founder'],['/blog','Server-rendered fixture article'],[`/blog/${postID}`,'A visible heading']]){const response=await request.get(path);expect(response.status(),path).toBe(200);expect(await response.text(),path).toContain(text);}
    const missing=await request.get('/blog/22222222-2222-4222-8222-222222222222');expect(missing.status()).toBe(404);
    const old=await request.get(`/article.html?id=${postID}`,{maxRedirects:0});expect(old.status()).toBe(308);expect(old.headers().location).toContain(`/article?id=${postID}`);
    const article=await request.get(`/article?id=${postID}`,{maxRedirects:0});expect(article.status()).toBe(308);expect(article.headers().location).toContain(`/blog/${postID}`);
});
test('templates have uniform frames, functional previews, centered desktop navigation, and mobile navigation',async({page})=>{
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.setViewportSize({width:1440,height:1000});await page.goto('/templates');
    await expect(page.locator('#template-grid .catalog-card')).toHaveCount(3);
    const dimensions=await page.locator('#template-grid .catalog-card > .design-mockup').evaluateAll(nodes=>nodes.map(n=>Math.round(n.getBoundingClientRect().height)));expect(new Set(dimensions).size).toBe(1);
    const center=await page.locator('.nav-links').evaluate(node=>{const r=node.getBoundingClientRect();return r.left+r.width/2;});expect(Math.abs(center-720)).toBeLessThan(2);
    await page.screenshot({path:'/tmp/next-web-templates-desktop.png',fullPage:true});
    await page.getByRole('button',{name:'Preview design'}).first().click();await expect(page.locator('dialog[open]')).toHaveCount(1);await page.keyboard.press('Escape');await expect(page.locator('dialog[open]')).toHaveCount(0);
    await page.getByRole('button',{name:/Switch to light theme/}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
    await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open menu'}).click();await expect(page.locator('#mobileNav')).toHaveClass(/open/);await expect(page.getByRole('button',{name:'Close menu'})).toHaveAttribute('aria-expanded','true');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.evaluate(()=>window.scrollTo(0,0));await expect(page.locator('#mobileNav')).toHaveCSS('opacity','1');await page.screenshot({path:'/tmp/next-web-templates-mobile.png',fullPage:true,animations:'disabled'});expect(errors).toEqual([]);
});
test('customization and hardware inquiries preserve context and wait for database success',async({page})=>{
    await page.goto('/contact?template=Studio%20%2F%20Portfolio');await expect(page.locator('#projectDesc')).toHaveValue(/Studio \/ Portfolio/);
    await page.getByLabel('Your Name').fill('Test Client');await page.getByLabel('Email Address').fill('client@example.com');await page.getByLabel('Phone / WhatsApp').fill('09123456789');await page.getByLabel('Preferred Contact Method').selectOption('Email');
    const pending=page.waitForRequest(request=>request.url().includes('/contact_submissions')&&request.method()==='POST');await page.getByRole('button',{name:'Submit Inquiry'}).click();const request=await pending;expect(request.postDataJSON()[0].inquiry_type).toBe('Website Template');await expect(page.getByRole('status')).toContainText('Inquiry received successfully');
    await page.goto('/contact?division=second-boot&service=SSD%20upgrade');await expect(page.locator('#projectDesc')).toHaveValue(/SSD upgrade/);
});
test('planner boots once and admin session guard redirects signed-out users',async({page})=>{
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto('/planner');await expect(page.locator('#tabStudent')).toBeVisible();await page.locator('#tabStudent').click();await expect(page.locator('#studentPlanner')).toBeVisible();await expect(page.locator('#billTotal')).toContainText('5,000');
    await page.goto('/admin');await expect(page).toHaveURL(/\/admin-auth$/);await expect(page.getByRole('heading',{name:'Admin Access'})).toBeVisible();expect(errors).toEqual([]);
});
test('authenticated admin can edit and save catalog content through preserved editors',async({page})=>{
    const now=Math.floor(Date.now()/1000);const token=`eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({exp:now+3600,sub:postID,role:'authenticated'})).toString('base64url')}.signature`;
    await page.addInitScript(({token,id,now})=>{localStorage.setItem('sb-ixelabdnxkizgkgzdhnb-auth-token',JSON.stringify({access_token:token,refresh_token:'fixture-refresh',token_type:'bearer',expires_at:now+3600,expires_in:3600,user:{id,email:'admin@example.com',aud:'authenticated',role:'authenticated'}}));},{token,id:postID,now});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto('/admin');await expect(page.locator('#appShell')).toBeVisible();await page.locator('.nav-item').filter({hasText:'Website Templates'}).click();await expect(page.locator('#templates-content-form')).toBeVisible();
    await page.locator('[data-meta="title"]').first().fill('Custom Website Templates');const pending=page.waitForRequest(request=>request.url().includes('/homepage_sections')&&request.method()==='POST');await page.getByRole('button',{name:'Save Website Templates'}).click();const request=await pending;expect(request.postDataJSON().content.title).toBe('Custom Website Templates');await expect(page.locator('#templates-editor-status')).toContainText('Saved.');expect(errors).toEqual([]);
});

test('public pages hydrate cleanly, FAQ expands, and failed inquiries keep their text',async({page})=>{
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    for(const path of ['/','/second-boot','/portfolio','/team','/blog',`/blog/${postID}`]){
        await page.goto(path);await expect(page.locator('h1')).toBeVisible();
        if(path==='/'){await page.locator('.faq-question').first().click();await expect(page.locator('.faq-question').first()).toHaveAttribute('aria-expanded','true');await page.screenshot({path:'/tmp/next-web-home.png',fullPage:true});}
    }
    await page.goto('/contact?division=second-boot');await page.getByLabel('Your Name').fill('Client');await page.getByLabel('Email Address').fill('client@example.com');await page.getByLabel('Phone / WhatsApp').fill('12345');await page.getByLabel('Preferred Contact Method').selectOption('Email');
    await page.route(url=>url.pathname.endsWith('/contact_submissions'),route=>route.fulfill({status:500,contentType:'application/json',body:JSON.stringify({message:'Fixture failure'})}));
    await page.getByRole('button',{name:'Submit Inquiry'}).click();await expect(page.getByRole('status')).toContainText('Submission failed');await expect(page.locator('#projectDesc')).toHaveValue(/Second Boot/);await expect(page.getByLabel('Your Name')).toHaveValue('Client');
    expect(errors).toEqual([]);
});
