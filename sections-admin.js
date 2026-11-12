(() => {
    const { defaults, escape, imageURL, read } = HomeSections;
    const drafts = {};
    const status = (key, message) => { document.getElementById(`${key}-editor-status`).textContent = message; };
    function field(label, name, value, type = 'text', required = false) {
        const id = `section-${name}`;
        return `<div class="form-group"><label for="${id}">${label}</label>${type === 'textarea' ? `<textarea id="${id}" data-field="${name}" ${required ? 'required' : ''}>${escape(value)}</textarea>` : `<input id="${id}" data-field="${name}" type="${type}" value="${escape(value)}" ${required ? 'required' : ''}>`}</div>`;
    }
    function collect(key) {
        const root = document.getElementById(`${key}-editor-fields`);
        const result = { ...drafts[key], items: [] };
        root.querySelectorAll(':scope > .form-section [data-meta]').forEach(el => { result[el.dataset.meta] = el.value.trim(); });
        root.querySelectorAll('[id]').forEach(el => { el.id = `${key}-${el.id}`; });
        root.querySelectorAll('label[for]').forEach(el => { el.htmlFor = `${key}-${el.htmlFor}`; });
        root.querySelectorAll('[data-item]').forEach(card => {
            const item = {};
            card.querySelectorAll('[data-field]').forEach(el => { item[el.dataset.field.replace(/^item-\d+-/, '')] = el.type === 'checkbox' ? el.checked : el.value.trim(); });
            result.items.push(item);
        });
        return result;
    }
    function render(key) {
        const data = drafts[key];
        const root = document.getElementById(`${key}-editor-fields`);
        const meta = ['title','description', ...(key === 'second-boot' ? ['note'] : [])].map(name => field(name[0].toUpperCase()+name.slice(1), `${key}-${name}`, data[name], name === 'title' ? 'text' : 'textarea', true).replace(`data-field="${key}-${name}"`, `data-meta="${name}"`)).join('');
        root.innerHTML = `<div class="form-section">${meta}</div>` + data.items.map((item, i) => `<div class="form-section" data-item="${i}"><div class="form-section-title">${key === 'templates' ? 'Template' : 'Service'} ${i+1}</div>${field('Title',`item-${i}-title`,item.title,'text',true)}${field('Category / label',`item-${i}-category`,item.category)}${field('Description',`item-${i}-description`,item.description,'textarea',true)}${key === 'templates' ? `${field('Preview image URL (optional)',`item-${i}-image`,item.image,'url')}<div class="form-group"><label for="section-style-${i}">Concept layout (used without an image)</label><select id="section-style-${i}" data-field="item-${i}-style">${['studio','business','shop'].map(style => `<option ${item.style === style ? 'selected' : ''}>${style}</option>`).join('')}</select></div>` : ''}<div class="form-group"><label><input type="checkbox" data-field="item-${i}-featured" ${item.featured !== false ? 'checked' : ''}> Show on website</label></div><div class="btn-row"><button type="button" class="btn-secondary" data-move="-1" ${i===0?'disabled':''}>Move up</button><button type="button" class="btn-secondary" data-move="1" ${i===data.items.length-1?'disabled':''}>Move down</button><button type="button" class="btn-danger" data-remove>Remove</button></div></div>`).join('');
        root.querySelectorAll('[id]').forEach(el => { el.id = `${key}-${el.id}`; });
        root.querySelectorAll('label[for]').forEach(el => { el.htmlFor = `${key}-${el.htmlFor}`; });
        root.querySelectorAll('[data-item]').forEach(card => {
            const index = Number(card.dataset.item);
            card.querySelector('[data-remove]').addEventListener('click', () => { drafts[key] = collect(key); drafts[key].items.splice(index,1); render(key); });
            card.querySelectorAll('[data-move]').forEach(button => button.addEventListener('click', () => {
                drafts[key] = collect(key);
                const next = index + Number(button.dataset.move);
                [drafts[key].items[index], drafts[key].items[next]] = [drafts[key].items[next], drafts[key].items[index]];
                render(key);
            }));
        });
    }
    async function load(key) {
        if (drafts[key]) return; // Keep unsaved edits when switching views.
        const form = document.getElementById(`${key}-content-form`);
        form.hidden = true;
        status(key, 'Loading content…');
        try { drafts[key] = await read(key); status(key, ''); }
        catch (error) {
            drafts[key] = structuredClone(defaults[key]);
            status(key, 'Could not load saved content. Defaults are shown. If the table is missing, run supabase_sections.sql in Supabase first. ' + error.message);
        }
        render(key);
        form.hidden = false;
    }
    Object.keys(defaults).forEach(key => {
        document.getElementById(`${key}-content-form`).addEventListener('submit', async event => {
            event.preventDefault();
            const data = collect(key);
            if (data.items.some(item => item.image && !imageURL(item.image))) { status(key, 'Preview images must use an HTTP or HTTPS URL.'); return; }
            const button = event.target.querySelector('[type="submit"]');
            button.disabled = true;
            status(key, 'Saving…');
            try {
                const client = getSupabaseClient();
                if (!client) throw new Error('Database unavailable.');
                const { error } = await client.from('homepage_sections').upsert({id:key, content:data, updated_at:new Date().toISOString()});
                if (error) throw error;
                drafts[key] = data;
                status(key, 'Saved. Changes are available on the dedicated page.');
            } catch (error) { status(key, 'Save failed. Your edits are still here. ' + error.message); }
            finally { button.disabled = false; }
        });
    });
    window.SectionEditor = { load, add(key) { if (!drafts[key]) return; drafts[key] = collect(key); drafts[key].items.push({title:'',category:'',description:'',style:'studio',image:'',featured:true}); render(key); } };
})();
