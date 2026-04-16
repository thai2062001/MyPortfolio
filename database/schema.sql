-- =========================================================
-- PORTFOLIO CMS - MASTER SCHEMA
-- Author: Antigravity AI
-- Purpose: Clean setup for new client deployment
-- =========================================================

-- =========================================================
-- EXTENSIONS & UTILITIES
-- =========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Global updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Global is_admin check function (standard Supabase auth)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (auth.role() = 'authenticated');
END;
$$;

-- =========================================================
-- CORE SYSTEM TABLES
-- =========================================================

-- Project Categories
CREATE TABLE IF NOT EXISTS public.project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_ja TEXT,
  category_id UUID REFERENCES public.project_categories(id) ON DELETE SET NULL,
  short_description TEXT,
  short_description_ja TEXT,
  description TEXT,
  description_ja TEXT,
  overview TEXT,
  overview_ja TEXT,
  challenge TEXT,
  challenge_ja TEXT,
  solution TEXT,
  solution_ja TEXT,
  client TEXT,
  duration TEXT,
  role TEXT,
  year TEXT,
  cover_image_url TEXT,
  tall BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Images
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  is_cover BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Tags
CREATE TABLE IF NOT EXISTS public.project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ja TEXT,
  description TEXT,
  icon_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Tag Relations
CREATE TABLE IF NOT EXISTS public.project_tag_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.project_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, tag_id)
);

-- Project Approaches
CREATE TABLE IF NOT EXISTS public.project_approaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  approach TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Results
CREATE TABLE IF NOT EXISTS public.project_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Testimonials
CREATE TABLE IF NOT EXISTS public.project_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT,
  avatar_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- IDENTITY & EXPERIENCE
-- =========================================================

-- Skill Categories
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  name_ja TEXT,
  description TEXT,
  icon_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE,
  skill_name TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  overview TEXT,
  icon_url TEXT,
  cover_image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline Phases
CREATE TABLE IF NOT EXISTS public.timeline_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ja TEXT,
  company_en TEXT,
  company_ja TEXT,
  description_en TEXT NOT NULL,
  description_ja TEXT,
  location TEXT,
  tag_en TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About Content
CREATE TABLE IF NOT EXISTS public.about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_ja TEXT,
  content_en TEXT NOT NULL,
  content_ja TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- SETTINGS & CONFIGURATION
-- =========================================================

-- Site Settings (ID 1 ONLY)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  site_name TEXT DEFAULT 'Portfolio',
  active_theme TEXT DEFAULT 'radiant',
  default_language TEXT DEFAULT 'en',
  global_font_family TEXT,
  global_font_import_url TEXT,
  global_font_fallback TEXT DEFAULT 'sans-serif',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page Sections (Dynamic Selector)
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL,
  section_name TEXT NOT NULL,
  section_type TEXT NOT NULL,
  page_type TEXT NOT NULL DEFAULT 'home',
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  is_visible BOOLEAN DEFAULT TRUE,
  is_fixed BOOLEAN DEFAULT FALSE,
  data_source TEXT,
  source_table TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_type, section_key)
);

-- =========================================================
-- MEDIA LIBRARY
-- =========================================================

-- Media Folders
CREATE TABLE IF NOT EXISTS public.media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.media_folders(id) ON DELETE CASCADE,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Assets
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES public.media_folders(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  public_id TEXT UNIQUE,
  format TEXT,
  bytes INTEGER,
  width INTEGER,
  height INTEGER,
  resource_type TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- CONTACT MESSAGES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  purpose TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_replied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- TRIGGERS (Auto Updated_at)
-- =========================================================
CREATE TRIGGER trg_project_categories_updated_at BEFORE UPDATE ON public.project_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_project_images_updated_at BEFORE UPDATE ON public.project_images FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_project_approaches_updated_at BEFORE UPDATE ON public.project_approaches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_project_results_updated_at BEFORE UPDATE ON public.project_results FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_project_testimonials_updated_at BEFORE UPDATE ON public.project_testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_project_tags_updated_at BEFORE UPDATE ON public.project_tags FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_skill_categories_updated_at BEFORE UPDATE ON public.skill_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_timeline_phases_updated_at BEFORE UPDATE ON public.timeline_phases FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_about_content_updated_at BEFORE UPDATE ON public.about_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_page_sections_updated_at BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_media_folders_updated_at BEFORE UPDATE ON public.media_folders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_media_assets_updated_at BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY (RLS) policies
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_approaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_testimonials ENABLE ROW LEVEL SECURITY;

-- Select policies (Public)
CREATE POLICY "Public can view published project categories" ON public.project_categories FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view project images" ON public.project_images FOR SELECT USING (TRUE);
CREATE POLICY "Public can view project approaches" ON public.project_approaches FOR SELECT USING (TRUE);
CREATE POLICY "Public can view project results" ON public.project_results FOR SELECT USING (TRUE);
CREATE POLICY "Public can view project testimonials" ON public.project_testimonials FOR SELECT USING (TRUE);
CREATE POLICY "Public can view active tags" ON public.project_tags FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view tag relations" ON public.project_tag_relations FOR SELECT USING (TRUE);
CREATE POLICY "Public can view published skill categories" ON public.skill_categories FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view published skills" ON public.skills FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view published timeline phases" ON public.timeline_phases FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view published about content" ON public.about_content FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public can view published page sections" ON public.page_sections FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view media folders" ON public.media_folders FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view media assets" ON public.media_assets FOR SELECT USING (TRUE);

-- Insight policies (Contact messages: Only Insert for public)
CREATE POLICY "Public can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (TRUE);

-- Admin policies (Full access for Authenticated)
CREATE POLICY "Admin manage project categories" ON public.project_categories FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage projects" ON public.projects FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage project images" ON public.project_images FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage project approaches" ON public.project_approaches FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage project results" ON public.project_results FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage project testimonials" ON public.project_testimonials FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage project tags" ON public.project_tags FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage project tag relations" ON public.project_tag_relations FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage skill categories" ON public.skill_categories FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage skills" ON public.skills FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage timeline phases" ON public.timeline_phases FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage about content" ON public.about_content FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage site settings" ON public.site_settings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage page sections" ON public.page_sections FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage media folders" ON public.media_folders FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage media assets" ON public.media_assets FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage contact messages" ON public.contact_messages FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- =========================================================
-- INDEXES
-- =========================================================
CREATE INDEX idx_projects_order ON public.projects(order_index);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_skill_order ON public.skills(order_index);
CREATE INDEX idx_timeline_order ON public.timeline_phases(order_index);
-- =========================================================
-- FAQ
-- =========================================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_en TEXT NOT NULL,
  question_ja TEXT,
  answer_en TEXT NOT NULL,
  answer_ja TEXT,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stats / Metrics
CREATE TABLE IF NOT EXISTS public.site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_key TEXT UNIQUE,
  value_text TEXT NOT NULL,
  label_en TEXT NOT NULL,
  label_ja TEXT,
  description_en TEXT,
  description_ja TEXT,
  icon_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_stats_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  is_published BOOLEAN DEFAULT TRUE,
  eyebrow_en TEXT,
  eyebrow_ja TEXT,
  title_en TEXT,
  title_ja TEXT,
  description_en TEXT,
  description_ja TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About Tags
CREATE TABLE IF NOT EXISTS public.about_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ja TEXT,
  description TEXT,
  icon_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.about_content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about_id UUID NOT NULL REFERENCES public.about_content(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.about_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(about_id, tag_id)
);

-- Analytics
CREATE TABLE IF NOT EXISTS public.portfolio_visit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'page_view', 'project_click', etc.
  pathname TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- ADDITIONAL TRIGGERS
-- =========================================================
CREATE TRIGGER trg_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_site_stats_updated_at BEFORE UPDATE ON public.site_stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_site_stats_section_settings_updated_at BEFORE UPDATE ON public.site_stats_section_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_about_tags_updated_at BEFORE UPDATE ON public.about_tags FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- ADDITIONAL RLS
-- =========================================================
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats_section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_visit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published faqs" ON public.faqs FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view published stats" ON public.site_stats FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view stats settings" ON public.site_stats_section_settings FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view active about tags" ON public.about_tags FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view about tag relations" ON public.about_content_tags FOR SELECT USING (TRUE);
CREATE POLICY "Public can insert analytics" ON public.portfolio_visit_events FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admin manage faqs" ON public.faqs FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage stats" ON public.site_stats FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage stats settings" ON public.site_stats_section_settings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage about tags" ON public.about_tags FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage about tag relations" ON public.about_content_tags FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin manage analytics" ON public.portfolio_visit_events FOR SELECT TO authenticated USING (TRUE);
