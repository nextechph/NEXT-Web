'use client';
import { useState } from 'react';
import { getBrowserClient } from '../lib/supabase-browser';
export default function Newsletter(){
    const [busy,setBusy]=useState(false),[status,setStatus]=useState('');
    async function submit(event){event.preventDefault();setBusy(true);setStatus('');const form=event.currentTarget;const email=new FormData(form).get('email').trim().toLowerCase();try{const {error}=await getBrowserClient().from('subscribers').insert({email});if(error&&error.code!=='23505')throw error;setStatus('You’re subscribed. Thank you!');form.reset();}catch{setStatus('Subscription failed. Please try again.');}finally{setBusy(false);}}
    return <div className="blog-newsletter"><div className="newsletter-card"><div className="newsletter-text"><h3>Stay in the Loop</h3><p>New articles on web dev, design, and digital strategy—delivered to your inbox.</p></div><div><form className="newsletter-form" onSubmit={submit}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" className="newsletter-input" type="email" name="email" required placeholder="your@email.com" disabled={busy}/><button className="newsletter-btn" disabled={busy}>{busy?'Subscribing…':'Subscribe'}</button></form><p role="status">{status}</p></div></div></div>;
}
