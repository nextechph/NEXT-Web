'use client';
import { useEffect,useState } from 'react';
import { getBrowserClient } from '../lib/supabase-browser';
export default function Login() {
    const [busy,setBusy]=useState(false), [error,setError]=useState('');
    useEffect(() => {getBrowserClient().auth.getSession().then(({data})=>{if(data.session)window.location.replace('/admin');});},[]);
    async function submit(event) {
        event.preventDefault();setBusy(true);setError('');
        const data=new FormData(event.currentTarget);
        try {const {error}=await getBrowserClient().auth.signInWithPassword({email:data.get('email'),password:data.get('password')});if(error)throw error;window.location.assign('/admin');}
        catch(error){setError(error.message || 'Unable to sign in.');setBusy(false);}
    }
    return <div className="login-box"><div className="login-progress" style={{width:busy?'100%':'0%'}}/><div className="login-logo">NEXT <span>Technology</span></div><h1 className="login-title">Admin Access</h1><p className="login-sub">Sign in to manage your website.</p><form onSubmit={submit}><div className="login-field"><label htmlFor="loginEmail">Email address</label><input id="loginEmail" name="email" type="email" required autoComplete="email" disabled={busy}/></div><div className="login-field"><label htmlFor="loginPass">Password</label><input id="loginPass" name="password" type="password" required autoComplete="current-password" disabled={busy}/></div><button className="login-btn" disabled={busy}>{busy?'Authenticating…':'Access Admin Panel'}</button>{error && <p role="alert" className="login-error" style={{display:'block'}}>{error}</p>}</form><a href="/" style={{display:'block',marginTop:24,color:'var(--text2)'}}>Back to website</a></div>;
}
