-- =========================================================
-- Fix: Ensure Unique Constraints for ON CONFLICT support
-- =========================================================

DO $$ 
BEGIN 
    -- 1. Services (Essential for Step 10)
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_title_en_key') THEN
        ALTER TABLE public.services ADD CONSTRAINT services_title_en_key UNIQUE (title_en);
    END IF;

    -- 2. Page Sections
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'page_sections_page_type_section_name_key') THEN
        ALTER TABLE public.page_sections ADD CONSTRAINT page_sections_page_type_section_name_key UNIQUE (page_type, section_name);
    END IF;

    -- 3. Skill Categories
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'skill_categories_slug_key') THEN
        ALTER TABLE public.skill_categories ADD CONSTRAINT skill_categories_slug_key UNIQUE (slug);
    END IF;

    -- 4. Project Categories
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_categories_slug_key') THEN
        ALTER TABLE public.project_categories ADD CONSTRAINT project_categories_slug_key UNIQUE (slug);
    END IF;

    -- 5. Projects
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_slug_key') THEN
        ALTER TABLE public.projects ADD CONSTRAINT projects_slug_key UNIQUE (slug);
    END IF;

    -- 6. Blog Categories
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_categories_slug_key') THEN
        ALTER TABLE public.blog_categories ADD CONSTRAINT blog_categories_slug_key UNIQUE (slug);
    END IF;

    -- 7. Blog Posts
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_slug_key') THEN
        ALTER TABLE public.blog_posts ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);
    END IF;

    -- 8. About Tags
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'about_tags_label_en_key') THEN
        ALTER TABLE public.about_tags ADD CONSTRAINT about_tags_label_en_key UNIQUE (label_en);
    END IF;

    -- 9. Site Stats
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_stats_label_en_key') THEN
        ALTER TABLE public.site_stats ADD CONSTRAINT site_stats_label_en_key UNIQUE (label_en);
    END IF;

    -- 10. Contact Purpose Options
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_purpose_options_label_en_key') THEN
        ALTER TABLE public.contact_purpose_options ADD CONSTRAINT contact_purpose_options_label_en_key UNIQUE (label_en);
    END IF;

END $$;
