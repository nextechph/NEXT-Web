'use client';
export default function ErrorPage({reset}){return <main className="not-found"><h1>We couldn’t load this page.</h1><p>Please try again in a moment.</p><button className="btn-primary" onClick={reset}>Try again</button><a href="/">Return home</a></main>;}
