-- Migration to add CV/Resume field to personal_info
ALTER TABLE public.personal_info ADD COLUMN IF NOT EXISTS resume_url TEXT;
