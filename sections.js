/* Shared defaults and rendering for the homepage and admin editors. */
(() => {
    const defaults = {
        templates: {
            title: 'Website Templates',
            description: 'Choose a direction. We’ll make it yours with your brand, content, and the features you need.',
            items: [
                { title: 'Studio / Portfolio', category: 'Creative', description: 'A bold introduction, selected work, and space for your story. For creatives and independent professionals.', style: 'studio', image: '', featured: true },
                { title: 'Business / Services', category: 'Business', description: 'A clear, confident home for your services, testimonials, and customer inquiries.', style: 'business', image: '', featured: true },
                { title: 'Shop / Collection', category: 'Commerce', description: 'An editorial storefront concept for showcasing products. Catalog and checkout features are scoped with your project.', style: 'shop', image: '', featured: true }
            ]
        },
        'second-boot': {
            title: 'Second Boot by NEXT',
            description: 'A second life for your PC. A fresh start for your next build. Our hardware division revives legacy Intel 1st–6th gen systems and builds custom computers with the latest technology.',
            note: 'Tell us your current specs, what you use your PC for, and your budget. We’ll help you find the right path.',
            items: [
                { title: 'Legacy, with a new lease on life.', category: '01 / REVIVE', description: 'Bring Intel 1st–6th gen systems back into everyday use. We assess your hardware and recommend practical upgrades, from SSDs and RAM to cooling and a fresh setup.', featured: true },
                { title: 'Your next custom build.', category: '02 / BUILD', description: 'Modern custom computers built around your workload, style, and budget. From everyday productivity to gaming and creative work, we help select compatible parts and assemble your system.', featured: true },
                { title: 'Keep your machine moving.', category: '03 / SERVICE', description: 'Troubleshooting, hardware diagnostics, cleaning, thermal care, and component upgrades. Start with an assessment so we can recommend the right service for your PC.', featured: true }
            ]
        }
    };
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const imageURL = value => {
        if (!value) return '';
        try { const u = new URL(value, location.href); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; }
    };
    async function read(key) {
        const client = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
        if (!client) throw new Error('Database is unavailable.');
        const { data, error } = await client.from('homepage_sections').select('content').eq('id', key).maybeSingle();
        if (error) throw error;
        if (!data) return structuredClone(defaults[key]);
        if (!data.content || !Array.isArray(data.content.items)) throw new Error('Section content is invalid.');
        return { ...structuredClone(defaults[key]), ...data.content };
    }
    function mockup(item) {
        const image = imageURL(item.image);
        if (image) return `<img class="template-image" src="${escape(image)}" alt="${escape(item.title)} design preview" loading="lazy">`;
        const style = ['studio','business','shop'].includes(item.style) ? item.style : 'studio';
        const words = {studio:['Independent by design.','Selected work','A space for your next big idea.'], business:['Good business starts here.','Our expertise','Thoughtful solutions. Real results.'], shop:['Everyday, considered.','The collection','Objects made to be part of your story.']}[style];
        return `<div class="design-mockup design-${style}" aria-label="${escape(item.title)} concept"><div class="mock-nav"><b>YOUR BRAND</b><span>About &nbsp; Explore &nbsp; Contact</span></div><div class="mock-hero"><span>${escape(item.category)}</span><strong>${words[0]}</strong><p>${words[2]}</p><span class="mock-pill">Discover more ↗</span></div><div class="mock-bottom"><span>${words[1]}</span><div class="mock-tiles"><div></div><div></div><div></div></div></div></div>`;
    }
    function render(key, content) {
        const templates = key === 'templates';
        const grid = document.getElementById(templates ? 'template-grid' : 'boot-grid');
        if (!grid) return;
        document.getElementById(templates ? 'templates-title' : 'second-boot-title').textContent = content.title;
        document.getElementById(templates ? 'templates-description' : 'second-boot-description').textContent = content.description;
        if (!templates) document.getElementById('boot-note').textContent = content.note;
        const items = content.items.filter(item => item.featured !== false);
        grid.replaceChildren();
        items.forEach(item => {
            const article = document.createElement('article');
            article.className = 'catalog-card';
            const href = templates ? `contact.html?template=${encodeURIComponent(item.title)}` : `contact.html?division=second-boot&service=${encodeURIComponent(item.title)}`;
            article.innerHTML = `${templates ? mockup(item) : ''}<div class="catalog-card-body"><span class="catalog-label">${escape(item.category)}</span><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p><div class="catalog-actions">${templates ? '<button class="btn-secondary" type="button">Preview design</button>' : ''}<a class="${templates ? 'btn-primary' : 'boot-link'}" href="${escape(href)}">${templates ? 'Customize this' : 'Ask about this service'} ↗</a></div></div>`;
            if (templates) article.querySelector('button').addEventListener('click', () => {
                const dialog = document.getElementById('template-preview');
                document.getElementById('template-preview-title').textContent = item.title;
                document.getElementById('template-preview-content').innerHTML = mockup(item);
                document.getElementById('preview-choose').href = href;
                dialog.showModal();
            });
            grid.append(article);
        });
    }
    window.HomeSections = { defaults, escape, imageURL, read };
    if (document.getElementById('template-grid')) {
        Object.keys(defaults).forEach(async key => {
            render(key, defaults[key]);
            try { render(key, await read(key)); } catch (error) { console.warn('Using default section content:', error.message); }
        });
        const dialog = document.getElementById('template-preview');
        document.getElementById('close-template-preview').addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    }
})();
