'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X } from 'lucide-react';
const links = [['/', 'Home'], ['/templates','Templates'], ['/second-boot','Second Boot'], ['/portfolio','Portfolio'], ['/planner','Planner'], ['/contact','Contact'], ['/blog','Blog'], ['/team','Team']];
export default function Header() {
    const pathname = usePathname();
    const [open,setOpen] = useState(false);
    const [theme,setTheme] = useState('dark');
    useEffect(() => { setTheme(document.documentElement.dataset.theme || 'dark'); }, []);
    useEffect(() => {
        const close = event => { if (event.key === 'Escape') setOpen(false); };
        const resize = () => { if (window.innerWidth >= 1280) setOpen(false); };
        document.addEventListener('keydown',close); window.addEventListener('resize',resize);
        return () => { document.removeEventListener('keydown',close); window.removeEventListener('resize',resize); };
    },[]);
    function toggleTheme() {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next); document.documentElement.dataset.theme = next;
        try { localStorage.setItem('theme',next); } catch {}
    }
    return <header className="header catalog-header"><div className="nav-container">
        <a href="/" className="logo-group" aria-label="NEXT Technology home"><img src="/assets/logo.png" alt="NEXT Technology" className="logo-img" width="140" height="64" /></a>
        <nav className="nav-links" aria-label="Main navigation">{links.map(([href,label]) => <a key={href} href={href} className="nav-link" aria-current={pathname === href ? 'page' : undefined}>{label}</a>)}</nav>
        <div className="nav-actions"><button type="button" className="theme-toggle" id="themeToggleBtn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><Sun className="sun-icon"/><Moon className="moon-icon"/></button><a href="/planner" className="btn-primary">Start Project</a><button type="button" className="mobile-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobileNav" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>
        </div><nav className={`mobile-nav${open ? ' open' : ''}`} id="mobileNav" aria-label="Mobile navigation">{links.map(([href,label]) => <a key={href} href={href} className="mobile-nav-link" aria-current={pathname === href ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</a>)}<a href="/planner" className="btn-primary mobile-btn">Start Project</a></nav>
    </header>;
}
