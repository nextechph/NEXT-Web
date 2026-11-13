// This is the existing public project key. Authorization remains enforced by RLS.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ixelabdnxkizgkgzdhnb.supabase.co";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZWxhYmRueGtpemdrZ3pkaG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMjY4MDIsImV4cCI6MjA5NjgwMjgwMn0.qiFoSGG95l2rfQGkvCJd0qEVNTpnpXD8f3hkb2Zov3Y";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://nexttechnologyph.com').replace(/\/+$/, '');
