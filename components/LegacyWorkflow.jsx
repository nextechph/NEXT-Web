'use client';
import { useEffect, useRef, useState } from 'react';
import { getBrowserClient } from '../lib/supabase-browser';
import { normalizeSectionCopy } from '../lib/section-copy';

// Preserve the existing admin editors and pricing wizard while the public site
// uses server components. These routes use full document navigation on purpose:
// their existing global handlers have a document-scoped lifecycle.
export default function LegacyWorkflow({html,scripts}) {
    const started = useRef(false);
    const [error,setError] = useState('');
    useEffect(() => {
        if (started.current) return;
        started.current = true;
        (async () => {
            try {
                const [supabase, lucide] = await Promise.all([import('@supabase/supabase-js'),import('lucide')]);
                window.supabase = supabase;
                window.supabaseClient = getBrowserClient();
                window.getSupabaseClient = getBrowserClient;
                window.normalizeSectionCopy = normalizeSectionCopy;
                window.lucide = { ...lucide, createIcons: options => lucide.createIcons({ icons: lucide.icons, ...options }) };
                const ready = [];
                window.__nextReady = callback => ready.push(callback);
                for (const source of scripts) {
                    const script = document.createElement('script');
                    script.textContent = source;
                    document.body.appendChild(script);
                }
                window.lucide.createIcons();
                for (const callback of ready) Promise.resolve(callback()).catch(error => {console.error(error);setError('This tool could not finish loading. Please reload and try again.');});
            } catch (error) { console.error(error);setError('This tool could not load. Please reload and try again.'); }
        })();
    },[scripts]);
    return <>{error && <p role="alert" className="workflow-error">{error}</p>}<div dangerouslySetInnerHTML={{__html:html}}/></>;
}
