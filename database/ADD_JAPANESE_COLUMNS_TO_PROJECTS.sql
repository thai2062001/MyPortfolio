-- Add Japanese columns to projects table for bilingual support
-- This migration adds support for Japanese translations of project content

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS title_ja TEXT,
ADD COLUMN IF NOT EXISTS short_description_ja TEXT,
ADD COLUMN IF NOT EXISTS description_ja TEXT,
ADD COLUMN IF NOT EXISTS overview_ja TEXT,
ADD COLUMN IF NOT EXISTS challenge_ja TEXT,
ADD COLUMN IF NOT EXISTS solution_ja TEXT,
ADD COLUMN IF NOT EXISTS seo_title_ja TEXT,
ADD COLUMN IF NOT EXISTS seo_description_ja TEXT;

-- Add comment to document the migration
COMMENT ON COLUMN public.projects.title_ja IS 'Japanese translation of project title';
COMMENT ON COLUMN public.projects.short_description_ja IS 'Japanese translation of short description';
COMMENT ON COLUMN public.projects.description_ja IS 'Japanese translation of description';
COMMENT ON COLUMN public.projects.overview_ja IS 'Japanese translation of overview';
COMMENT ON COLUMN public.projects.challenge_ja IS 'Japanese translation of challenge';
COMMENT ON COLUMN public.projects.solution_ja IS 'Japanese translation of solution';
COMMENT ON COLUMN public.projects.seo_title_ja IS 'Japanese translation of SEO title';
COMMENT ON COLUMN public.projects.seo_description_ja IS 'Japanese translation of SEO description';
