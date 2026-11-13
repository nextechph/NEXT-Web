import { cache } from 'react';
import { supabaseUrl, supabaseAnonKey } from './supabase-config';
import defaults from './section-defaults.json';
import { normalizeSectionCopy } from './section-copy';

// Fresh server reads make admin saves visible on the next public page request.
// Only the public anon key is used, so existing Supabase RLS still applies.
export const readRows = cache(async (table, query = '') => {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&${query}`, {
            headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
            cache: 'no-store', signal: AbortSignal.timeout(6000)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rows = await response.json();
        if (!Array.isArray(rows)) throw new Error('Invalid content response');
        return rows;
    } catch (error) {
        console.warn(`Could not read ${table}: ${error.message}`);
        return null;
    }
});
export const getSettings = cache(async () => (await readRows('site_settings', 'id=eq.1'))?.[0] || {});
export const getSection = cache(async key => {
    const row = (await readRows('homepage_sections', `id=eq.${encodeURIComponent(key)}`))?.[0];
    return normalizeSectionCopy(key, row?.content && Array.isArray(row.content.items) ? { ...defaults[key], ...row.content } : defaults[key]);
});
export const getPosts = cache(async () => await readRows('blog_posts', 'status=eq.published&order=created_at.desc') || []);
export const getPost = cache(async id => {
    if (!/^[0-9a-f-]{36}$/i.test(id || '')) return null;
    return (await readRows('blog_posts', `id=eq.${encodeURIComponent(id)}&status=eq.published&limit=1`))?.[0] || null;
});
export const getProjects = cache(async () => await readRows('portfolio_projects', 'order=sort_order.asc,created_at.desc') || []);
export const getTeam = cache(async () => await readRows('team_members', 'order=sort_order.asc') || []);
