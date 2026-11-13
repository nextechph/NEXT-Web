export function safeURL(value, fallback = '') {
    if (!value || typeof value !== 'string') return fallback;
    try {
        const input = value.trim();
        if (input.startsWith('/') && !input.startsWith('//')) return input;
        const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(input) ? input : `https://${input}`);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : fallback;
    } catch { return fallback; }
}
export const articleURL = id => `/blog/${encodeURIComponent(id)}`;
