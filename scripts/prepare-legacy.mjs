// Extract only the complex, existing workflows. Public content uses React components.
import fs from 'node:fs';
const cleanURLs = source => source.replace(/\bindex\.html\b/g, '/').replace(/(?<![\w-])(portfolio|planner|contact|blog|team|templates|second-boot|admin-auth|admin|article)\.html\b/g, '/$1').replace(/(?<![\w/])assets\//g, '/assets/');
fs.mkdirSync('legacy/generated', { recursive: true });
for (const name of ['planner', 'admin']) {
    const source = fs.readFileSync(`legacy/pages/${name}.html`, 'utf8');
    fs.writeFileSync(`legacy/${name}.css`, [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match=>match[1]).join('\n'));
    const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];
    let html = name === 'planner' ? body.match(/<main[\s\S]*?<\/main>/i)[0] : body;
    html = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
    const scripts = [...body.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
        .filter(match => !/\bsrc=/.test(match[1]))
        .map(match => cleanURLs(match[2]).replace(/(?:window|document)\.addEventListener\(\s*['"]DOMContentLoaded['"]\s*,/g, 'window.__nextReady('));
    if (name === 'admin') {
        scripts.push(fs.readFileSync('legacy/scripts/sections.js', 'utf8'));
        scripts.push(fs.readFileSync('legacy/scripts/sections-admin.js', 'utf8'));
    }
    fs.writeFileSync(`legacy/generated/${name}.json`, JSON.stringify({html:cleanURLs(html), scripts}, null, 2));
}
