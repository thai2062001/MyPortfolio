-- =========================================================
-- Add Section Visibility Controls to Skills Table
-- =========================================================
-- This allows each skill to control which sections are displayed
-- on its detail page (highlights, applications, tools, steps)

ALTER TABLE public.skills
ADD COLUMN IF NOT EXISTS show_highlights BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_applications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_tools BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_steps BOOLEAN DEFAULT TRUE;

-- Add comments for documentation
COMMENT ON COLUMN public.skills.show_highlights IS 'Show/hide Highlights section on skill detail page';
COMMENT ON COLUMN public.skills.show_applications IS 'Show/hide Applications section on skill detail page';
COMMENT ON COLUMN public.skills.show_tools IS 'Show/hide Tools section on skill detail page';
COMMENT ON COLUMN public.skills.show_steps IS 'Show/hide Steps section on skill detail page';

-- Example: Hide applications section for a specific skill
-- UPDATE public.skills SET show_applications = FALSE WHERE slug = 'react';
