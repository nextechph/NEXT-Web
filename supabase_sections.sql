-- Run once in the Supabase SQL Editor for an existing NEXT database.
-- Also safe to rerun. Uses the same authenticated-admin model as existing editors.
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id text PRIMARY KEY CHECK (id IN ('templates', 'second-boot')),
    content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object'),
    updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read homepage sections" ON public.homepage_sections;
CREATE POLICY "Public read homepage sections" ON public.homepage_sections
    FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin manage homepage sections" ON public.homepage_sections;
CREATE POLICY "Admin manage homepage sections" ON public.homepage_sections
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
GRANT SELECT ON public.homepage_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
