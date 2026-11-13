import sanitize from 'sanitize-html';
export function formatArticle(raw = '') {
    const options={allowedTags:[...sanitize.defaults.allowedTags,'img'],allowedAttributes:{a:['href','title','target','rel'],img:['src','alt','title','width','height','loading'],code:['class']},allowedSchemes:['http','https','mailto'],transformTags:{a:sanitize.simpleTransform('a',{rel:'noopener noreferrer'})}};
    if (/<\/?(?:p|h[1-6]|ul|ol|div|blockquote|img|pre)\b/i.test(raw)) return sanitize(raw,options);
    const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    const inline=text=>escape(text).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>');
    const html=raw.split(/\n\s*\n/).map(block=>{
        const text=block.trim();if(!text)return '';
        const heading=text.match(/^(#{1,3})\s+([\s\S]*)$/);
        if(heading){const level=heading[1].length+1;return `<h${level}>${inline(heading[2])}</h${level}>`;}
        if(/^[-*]\s/.test(text))return '<ul>'+text.split(/\n/).map(line=>`<li>${inline(line.replace(/^[-*]\s+/,''))}</li>`).join('')+'</ul>';
        if(text.startsWith('> '))return `<blockquote>${inline(text.slice(2)).replaceAll('\n','<br>')}</blockquote>`;
        return `<p>${inline(text).replaceAll('\n','<br>')}</p>`;
    }).join('');
    return sanitize(html,options);
}
