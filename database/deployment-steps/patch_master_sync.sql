-- =========================================================
-- MASTER SYNC PATCH V15 (THE FINAL INFRASTRUCTURE RECOVERY)
-- Created: 2026-04-16
-- Fixes 404 (faqs) and 400 (section_type_enum) errors.
-- Absolute recovery for missing types and tables.
-- =========================================================

DO $$ 
BEGIN
    -- [1] ENUM EXPANSION: section_type_enum
    -- Adding missing types to the enum to prevent 400 Bad Request
    ALTER TYPE public.section_type_enum ADD VALUE IF NOT EXISTS 'faq';
    ALTER TYPE public.section_type_enum ADD VALUE IF NOT EXISTS 'blog';
    ALTER TYPE public.section_type_enum ADD VALUE IF NOT EXISTS 'services';
    ALTER TABLE public.page_sections ALTER COLUMN section_type TYPE TEXT; -- Convert to TEXT for maximum flexibility like original schema

    -- [1.5] ABOUT CONTENT FIXES (Essential for relations)
    ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
    BEGIN
        ALTER TABLE public.about_content ADD CONSTRAINT uq_about_content_id UNIQUE (id);
    EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL; END;

    -- [2] TABLE RECOVERY: FAQS (Fixes 404 Not Found)
    CREATE TABLE IF NOT EXISTS public.faqs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_en TEXT NOT NULL,
        question_ja TEXT,
        question_vi TEXT,
        answer_en TEXT NOT NULL,
        answer_ja TEXT,
        answer_vi TEXT,
        category TEXT,
        order_index INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_faqs_updated_at') THEN
        CREATE TRIGGER trg_faqs_updated_at BEFORE UPDATE ON public.faqs
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;

    ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public can view published faqs" ON public.faqs;
    CREATE POLICY "Public can view published faqs" ON public.faqs FOR SELECT USING (is_published = TRUE);
    DROP POLICY IF EXISTS "Authenticated can manage faqs" ON public.faqs;
    CREATE POLICY "Authenticated can manage faqs" ON public.faqs FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

    -- [3] TABLE RECOVERY: About Content Relations
    CREATE TABLE IF NOT EXISTS public.about_content_tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        about_id UUID REFERENCES public.about_content(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES public.about_tags(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT uq_about_content_tag UNIQUE (about_id, tag_id)
    );

    -- Ensure the column exists if the table was created previously with a different name
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'about_content_tags') THEN
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'about_content_tags' AND column_name = 'about_id') THEN
            ALTER TABLE public.about_content_tags ADD COLUMN about_id UUID REFERENCES public.about_content(id) ON DELETE CASCADE;
            ALTER TABLE public.about_content_tags DROP COLUMN IF EXISTS content_key;
        END IF;
    END IF;

    CREATE TABLE IF NOT EXISTS public.project_testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
        quote_en TEXT NOT NULL,
        quote_ja TEXT,
        quote_vi TEXT,
        name TEXT NOT NULL,
        title_en TEXT,
        title_ja TEXT,
        title_vi TEXT,
        company_en TEXT,
        company_ja TEXT,
        company_vi TEXT,
        avatar_url TEXT,
        video_url TEXT,
        order_index INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- [4] OTHER RECOVERY TABLES
    CREATE TABLE IF NOT EXISTS public.clients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        logo_url TEXT NOT NULL,
        website_url TEXT,
        order_index INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.timeline_phase_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phase_id UUID NOT NULL REFERENCES public.timeline_phases(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        alt_text TEXT,
        caption TEXT,
        is_cover BOOLEAN DEFAULT FALSE,
        order_index INTEGER DEFAULT 0,
        image_orientation TEXT DEFAULT 'landscape',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.hero_layouts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        layout_key TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        thumbnail_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE public.hero_layouts ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public can view active hero layouts" ON public.hero_layouts;
    CREATE POLICY "Public can view active hero layouts" ON public.hero_layouts FOR SELECT USING (is_active = TRUE);
    DROP POLICY IF EXISTS "Authenticated can manage hero layouts" ON public.hero_layouts;
    CREATE POLICY "Authenticated can manage hero layouts" ON public.hero_layouts FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

    -- [5] SITE SETTINGS & SEO DEEP SYNC
    ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS active_theme_id TEXT;
    ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS google_analytics_id TEXT;
    ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS facebook_pixel_id TEXT;
    ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#000000';
    
    ALTER TABLE public.hero_sections ADD COLUMN IF NOT EXISTS selected_layout_key TEXT DEFAULT 'default';
    ALTER TABLE public.hero_sections ADD COLUMN IF NOT EXISTS layout_config JSONB DEFAULT '{}'::jsonb;

    -- [6] TESTIMONIALS NAMING SYNC (Fixes PGRST204/205)
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'testimonials') THEN
        ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS name TEXT;
        ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS role_en TEXT;
        ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS role_ja TEXT;
        ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS role_vi TEXT;
        ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS quote_en TEXT;
        ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS quote_ja TEXT;
        ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS quote_vi TEXT;
        ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS portrait_url TEXT;
        
        -- Copy data if empty
        UPDATE public.testimonials SET name = author_name WHERE name IS NULL AND author_name IS NOT NULL;
        UPDATE public.testimonials SET role_en = author_title_en WHERE role_en IS NULL AND author_title_en IS NOT NULL;
        UPDATE public.testimonials SET portrait_url = author_avatar_url WHERE portrait_url IS NULL AND author_avatar_url IS NOT NULL;
    END IF;

    -- [7] SKILLS & PROJECTS & EXPERTISE (Multilingual & Array Fields)
    ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tall BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS video_url TEXT;
    ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

    ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS tool_stack TEXT[];
    ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS key_points TEXT[];
    ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS related_skill_ids UUID[];
    ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS application_ja TEXT;
    ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS application_vi TEXT;
    ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS use_cases_ja TEXT;
    ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS use_cases_vi TEXT;

    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS strategic_description_ja TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS strategic_description_vi TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS strategic_helper_text_ja TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS strategic_helper_text_vi TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS tools_helper_text_ja TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS tools_helper_text_vi TEXT;

    ALTER TABLE public.about_images ADD COLUMN IF NOT EXISTS is_cover BOOLEAN DEFAULT FALSE;

    ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS title_ja TEXT;
    ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS title_vi TEXT;
    ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS content_ja TEXT;
    ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS content_vi TEXT;
    ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
    ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

    -- [7.5] EXPERTISE SECTIONS SYNC (Fixes 406)
    BEGIN
        ALTER TABLE public.expertise_section_settings RENAME TO expertise_sections;
    EXCEPTION WHEN undefined_table THEN NULL; WHEN duplicate_table THEN NULL; END;

    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS eyebrow_ja TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS eyebrow_vi TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS title_ja TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS title_vi TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS description_en TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS description_ja TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS description_vi TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS strategic_title_en TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS strategic_title_ja TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS strategic_title_vi TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS tools_title_en TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS tools_title_ja TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS tools_title_vi TEXT;
    ALTER TABLE public.expertise_sections ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

    -- [8] TIMELINE SECTION SETTINGS SYNC
    ALTER TABLE public.timeline_section_settings ADD COLUMN IF NOT EXISTS description_en TEXT;
    ALTER TABLE public.timeline_section_settings ADD COLUMN IF NOT EXISTS description_ja TEXT;
    ALTER TABLE public.timeline_section_settings ADD COLUMN IF NOT EXISTS description_vi TEXT;
    ALTER TABLE public.timeline_section_settings ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.timeline_section_settings ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

    -- [9] GLOBAL STATUS COVERAGE (Final Fix for PGRST204)
    ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.experience_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.experience_items ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.blog_categories ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    BEGIN
        -- Safe migration for label_en -> name_en
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'about_tags' AND column_name = 'label_en') THEN
            IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'about_tags' AND column_name = 'name_en') THEN
                UPDATE public.about_tags SET name_en = label_en WHERE name_en IS NULL;
                ALTER TABLE public.about_tags DROP COLUMN label_en;
            ELSE
                ALTER TABLE public.about_tags RENAME COLUMN label_en TO name_en;
            END IF;
        END IF;
        -- Safe migration for label_ja -> name_ja
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'about_tags' AND column_name = 'label_ja') THEN
            IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'about_tags' AND column_name = 'name_ja') THEN
                UPDATE public.about_tags SET name_ja = label_ja WHERE name_ja IS NULL;
                ALTER TABLE public.about_tags DROP COLUMN label_ja;
            ELSE
                ALTER TABLE public.about_tags RENAME COLUMN label_ja TO name_ja;
            END IF;
        END IF;
        -- Safe migration for label_vi -> name_vi
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'about_tags' AND column_name = 'label_vi') THEN
            IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'about_tags' AND column_name = 'name_vi') THEN
                UPDATE public.about_tags SET name_vi = label_vi WHERE name_vi IS NULL;
                ALTER TABLE public.about_tags DROP COLUMN label_vi;
            ELSE
                ALTER TABLE public.about_tags RENAME COLUMN label_vi TO name_vi;
            END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    ALTER TABLE public.about_tags ADD COLUMN IF NOT EXISTS name_en TEXT;
    ALTER TABLE public.about_tags ADD COLUMN IF NOT EXISTS name_ja TEXT;
    ALTER TABLE public.about_tags ADD COLUMN IF NOT EXISTS name_vi TEXT;
    ALTER TABLE public.about_tags ADD COLUMN IF NOT EXISTS slug TEXT;
    ALTER TABLE public.about_tags ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE public.about_tags ADD COLUMN IF NOT EXISTS icon_url TEXT;
    ALTER TABLE public.about_tags ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
    ALTER TABLE public.about_tags ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.about_tags ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.blog_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.blog_tags ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.blog_tags ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.project_categories ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.project_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.project_tags ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.project_tags ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.services ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.metrics ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.metrics ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

    BEGIN
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'site_stats' AND column_name = 'value') THEN
            IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'site_stats' AND column_name = 'value_text') THEN
                UPDATE public.site_stats SET value_text = "value" WHERE value_text IS NULL;
                ALTER TABLE public.site_stats DROP COLUMN "value";
            ELSE
                ALTER TABLE public.site_stats RENAME COLUMN "value" TO value_text;
            END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    ALTER TABLE public.site_stats ADD COLUMN IF NOT EXISTS stat_key TEXT;
    ALTER TABLE public.site_stats ADD COLUMN IF NOT EXISTS value_text TEXT;
    ALTER TABLE public.site_stats ADD COLUMN IF NOT EXISTS description_en TEXT;
    ALTER TABLE public.site_stats ADD COLUMN IF NOT EXISTS description_ja TEXT;
    ALTER TABLE public.site_stats ADD COLUMN IF NOT EXISTS description_vi TEXT;
    ALTER TABLE public.site_stats ADD COLUMN IF NOT EXISTS icon_url TEXT;
    ALTER TABLE public.site_stats ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
    ALTER TABLE public.site_stats ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

    -- [10.5] EXPERTISE STRATEGIC SKILLS SYNC (Frontend Compatibility + Safety)
    ALTER TABLE public.expertise_strategic_skills ADD COLUMN IF NOT EXISTS slug TEXT;
    ALTER TABLE public.expertise_strategic_skills ADD COLUMN IF NOT EXISTS skill_name TEXT;
    ALTER TABLE public.expertise_strategic_skills ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE public.expertise_strategic_skills ADD COLUMN IF NOT EXISTS skill_name_en TEXT;
    ALTER TABLE public.expertise_strategic_skills ADD COLUMN IF NOT EXISTS description_en TEXT;
    ALTER TABLE public.expertise_strategic_skills ALTER COLUMN skill_name_en DROP NOT NULL; -- Safety fix for 23502
    ALTER TABLE public.expertise_strategic_skills ADD COLUMN IF NOT EXISTS skill_name_ja TEXT;
    ALTER TABLE public.expertise_strategic_skills ADD COLUMN IF NOT EXISTS skill_name_vi TEXT;
    ALTER TABLE public.expertise_strategic_skills ADD COLUMN IF NOT EXISTS description_ja TEXT;
    ALTER TABLE public.expertise_strategic_skills ADD COLUMN IF NOT EXISTS description_vi TEXT;
    ALTER TABLE public.expertise_strategic_skills ADD COLUMN IF NOT EXISTS icon_url TEXT;

    -- [10.6] EXPERTISE TOOL ITEMS SYNC
    ALTER TABLE public.expertise_tool_items ADD COLUMN IF NOT EXISTS tool_name TEXT;
    ALTER TABLE public.expertise_tool_items ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE public.expertise_tool_items ADD COLUMN IF NOT EXISTS tool_name_en TEXT;
    ALTER TABLE public.expertise_tool_items ADD COLUMN IF NOT EXISTS description_en TEXT;
    ALTER TABLE public.expertise_tool_items ALTER COLUMN tool_name_en DROP NOT NULL; -- Safety fix for 23502
    ALTER TABLE public.expertise_tool_items ADD COLUMN IF NOT EXISTS tool_name_ja TEXT;
    ALTER TABLE public.expertise_tool_items ADD COLUMN IF NOT EXISTS tool_name_vi TEXT;
    ALTER TABLE public.expertise_tool_items ADD COLUMN IF NOT EXISTS description_ja TEXT;
    ALTER TABLE public.expertise_tool_items ADD COLUMN IF NOT EXISTS description_vi TEXT;
    ALTER TABLE public.expertise_tool_items ADD COLUMN IF NOT EXISTS icon_url TEXT;

    -- [11] UNIQUE CONSTRAINTS SYNC
    BEGIN
        ALTER TABLE public.page_sections ADD CONSTRAINT uq_page_sections_key UNIQUE (section_key);
    EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL; END;

    BEGIN
        ALTER TABLE public.site_stats ADD CONSTRAINT uq_site_stats_key UNIQUE (stat_key);
    EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL; END;

    BEGIN
        ALTER TABLE public.about_content ADD CONSTRAINT uq_about_content_key UNIQUE (section_key);
    EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL; END;

    BEGIN
        ALTER TABLE public.hero_layouts ADD CONSTRAINT uq_hero_layouts_key UNIQUE (layout_key);
    EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL; END;

END $$;

-- [9] REFRESH CACHE
NOTIFY pgrst, 'reload schema';
