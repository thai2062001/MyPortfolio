-- =========================================================
-- Portfolio CMS Schema - Consolidated & Optimized
-- Supabase / PostgreSQL
-- =========================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Common function for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =========================================================
-- Project Categories
-- =========================================================
CREATE TABLE IF NOT EXISTS public.project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  name_ja TEXT,
  name_vi TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_project_categories_updated_at BEFORE UPDATE ON public.project_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published project categories" ON public.project_categories
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage project categories" ON public.project_categories
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_project_categories_order ON public.project_categories(order_index);
CREATE INDEX idx_project_categories_published ON public.project_categories(is_published);

-- =========================================================
-- Projects
-- =========================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_ja TEXT,
  title_vi TEXT,
  category_id UUID REFERENCES public.project_categories(id) ON DELETE SET NULL,
  short_description TEXT,
  short_description_ja TEXT,
  short_description_vi TEXT,
  description TEXT,
  description_ja TEXT,
  description_vi TEXT,
  overview TEXT,
  overview_ja TEXT,
  overview_vi TEXT,
  challenge TEXT,
  challenge_ja TEXT,
  challenge_vi TEXT,
  solution TEXT,
  solution_ja TEXT,
  solution_vi TEXT,
  client TEXT,
  duration TEXT,
  role TEXT,
  year TEXT,
  cover_image_url TEXT,
  tall BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  seo_title TEXT,
  seo_title_ja TEXT,
  seo_title_vi TEXT,
  seo_description TEXT,
  seo_description_ja TEXT,
  seo_description_vi TEXT,
  og_image_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published projects" ON public.projects
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage projects" ON public.projects
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_projects_category ON public.projects(category_id);
CREATE INDEX idx_projects_featured ON public.projects(is_featured);
CREATE INDEX idx_projects_published ON public.projects(is_published, published_at DESC);

-- =========================================================
-- Project Images (Gallery)
-- =========================================================
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

CREATE TRIGGER trg_project_images_updated_at BEFORE UPDATE ON public.project_images
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view project images of published projects" ON public.project_images
FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_images.project_id AND p.is_published = TRUE));

CREATE POLICY "Authenticated can manage project images" ON public.project_images
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_project_images_project ON public.project_images(project_id, order_index);
CREATE INDEX idx_project_images_cover ON public.project_images(project_id, is_cover);

-- =========================================================
-- Project Approaches
-- =========================================================
CREATE TABLE IF NOT EXISTS public.project_approaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  approach TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_project_approaches_updated_at BEFORE UPDATE ON public.project_approaches
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.project_approaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view project approaches of published projects" ON public.project_approaches
FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_approaches.project_id AND p.is_published = TRUE));

CREATE POLICY "Authenticated can manage project approaches" ON public.project_approaches
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_project_approaches_project ON public.project_approaches(project_id, order_index);

-- =========================================================
-- Project Results
-- =========================================================
CREATE TABLE IF NOT EXISTS public.project_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_project_results_updated_at BEFORE UPDATE ON public.project_results
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.project_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view project results of published projects" ON public.project_results
FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_results.project_id AND p.is_published = TRUE));

CREATE POLICY "Authenticated can manage project results" ON public.project_results
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_project_results_project ON public.project_results(project_id, order_index);

-- =========================================================
-- Project Testimonials
-- =========================================================
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

CREATE TRIGGER trg_project_testimonials_updated_at BEFORE UPDATE ON public.project_testimonials
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.project_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view project testimonials of published projects" ON public.project_testimonials
FOR SELECT USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_testimonials.project_id AND p.is_published = TRUE));

CREATE POLICY "Authenticated can manage project testimonials" ON public.project_testimonials
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_project_testimonials_project ON public.project_testimonials(project_id, order_index);

-- =========================================================
-- About Content
-- =========================================================
CREATE TABLE IF NOT EXISTS public.about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_ja TEXT NOT NULL,
  title_vi TEXT,
  content_en TEXT NOT NULL,
  content_ja TEXT NOT NULL,
  content_vi TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_about_content_updated_at BEFORE UPDATE ON public.about_content
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published about content" ON public.about_content
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage about content" ON public.about_content
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_about_content_order ON public.about_content(order_index);

-- =========================================================
-- Skills
-- =========================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  skill_name_ja TEXT,
  skill_name_vi TEXT,
  description TEXT,
  description_ja TEXT,
  description_vi TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_skills_updated_at BEFORE UPDATE ON public.skills
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published skills" ON public.skills
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage skills" ON public.skills
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_skills_category_order ON public.skills(category, order_index);

-- =========================================================
-- Clients
-- =========================================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published clients" ON public.clients
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage clients" ON public.clients
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_clients_order ON public.clients(order_index);

-- =========================================================
-- Testimonials
-- =========================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_en TEXT NOT NULL,
  role_ja TEXT NOT NULL,
  role_vi TEXT,
  quote_en TEXT NOT NULL,
  quote_ja TEXT NOT NULL,
  quote_vi TEXT,
  portrait_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_testimonials_updated_at BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published testimonials" ON public.testimonials
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage testimonials" ON public.testimonials
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_testimonials_order ON public.testimonials(order_index);

-- =========================================================
-- Metrics
-- =========================================================
CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL,
  label_en TEXT NOT NULL,
  label_ja TEXT NOT NULL,
  label_vi TEXT,
  color TEXT DEFAULT 'text-sage',
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_metrics_updated_at BEFORE UPDATE ON public.metrics
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published metrics" ON public.metrics
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage metrics" ON public.metrics
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_metrics_order ON public.metrics(order_index);

-- =========================================================
-- Personal Info (Single Row)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.personal_info (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  phone_number TEXT,
  email TEXT,
  address TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  blog_url TEXT,
  github_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_personal_info_updated_at BEFORE UPDATE ON public.personal_info
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view personal info" ON public.personal_info
FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated can manage personal info" ON public.personal_info
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

INSERT INTO public.personal_info (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- Contact Messages
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

CREATE TRIGGER trg_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert contact messages" ON public.contact_messages
FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Authenticated can manage contact messages" ON public.contact_messages
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- =========================================================
-- Contact Purpose Options
-- =========================================================
CREATE TABLE IF NOT EXISTS public.contact_purpose_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL UNIQUE,
  label_en TEXT NOT NULL,
  label_ja TEXT,
  label_vi TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_contact_purpose_options_updated_at BEFORE UPDATE ON public.contact_purpose_options
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.contact_purpose_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active purpose options" ON public.contact_purpose_options
FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Authenticated can manage purpose options" ON public.contact_purpose_options
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

INSERT INTO public.contact_purpose_options (value, label_en, label_ja, order_index) VALUES
('work', 'Work Inquiry', 'お仕事のご依頼', 0),
('freelance', 'Freelance Project', 'フリーランス案件', 1),
('job_opportunity', 'Job Opportunity', '採用について', 2),
('collaboration', 'Collaboration', 'コラボレーション', 3),
('question', 'General Question', '一般的な質問', 4),
('other', 'Other', 'その他', 5)
ON CONFLICT (value) DO NOTHING;

-- =========================================================
-- Contact Form Settings
-- =========================================================
CREATE TABLE IF NOT EXISTS public.contact_form_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  is_purpose_enabled BOOLEAN DEFAULT TRUE,
  is_purpose_required BOOLEAN DEFAULT FALSE,
  purpose_placeholder_en TEXT DEFAULT 'Select a purpose',
  purpose_placeholder_ja TEXT DEFAULT '目的を選択してください',
  purpose_placeholder_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_contact_form_settings_updated_at BEFORE UPDATE ON public.contact_form_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.contact_form_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view contact form settings" ON public.contact_form_settings
FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated can manage contact form settings" ON public.contact_form_settings
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

INSERT INTO public.contact_form_settings (id, is_purpose_enabled, is_purpose_required)
VALUES (1, TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- Site Settings (Single Row)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  site_name TEXT,
  default_language TEXT DEFAULT 'en',
  global_font_family TEXT,
  global_font_import_url TEXT,
  global_font_import_css TEXT,
  global_font_fallback TEXT DEFAULT 'sans-serif',
  global_custom_css TEXT,
  body_font_id UUID,
  heading_font_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site settings" ON public.site_settings
FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated can manage site settings" ON public.site_settings
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

INSERT INTO public.site_settings (id, site_name, default_language, global_font_family, global_font_import_url, global_font_import_css, global_font_fallback)
VALUES (1, 'Portfolio', 'en', 'Poppins', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', '@import url(''https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'');', 'sans-serif')
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- Hero Section (Single Row)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.hero_sections (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  is_published BOOLEAN DEFAULT TRUE,
  badge TEXT,
  badge_ja TEXT,
  badge_vi TEXT,
  title_line_1_en TEXT DEFAULT '',
  title_line_1_ja TEXT DEFAULT '',
  title_line_1_vi TEXT DEFAULT '',
  title_line_2_en TEXT,
  title_line_2_ja TEXT,
  title_line_2_vi TEXT,
  title_line_2_html TEXT,
  description_en TEXT,
  description_ja TEXT,
  description_vi TEXT,
  primary_button_label_en TEXT,
  primary_button_label_ja TEXT,
  primary_button_label_vi TEXT,
  primary_button_url TEXT,
  secondary_button_label_en TEXT,
  secondary_button_label_ja TEXT,
  secondary_button_label_vi TEXT,
  secondary_button_url TEXT,
  hero_image_url TEXT,
  hero_image_alt_en TEXT,
  hero_image_alt_ja TEXT,
  hero_image_alt_vi TEXT,
  hero_image_storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_hero_sections_updated_at BEFORE UPDATE ON public.hero_sections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published hero section" ON public.hero_sections
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage hero section" ON public.hero_sections
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

INSERT INTO public.hero_sections (id, is_published, badge, title_line_1_en, title_line_2_en, description_en, primary_button_label_en, primary_button_url, secondary_button_label_en, secondary_button_url, hero_image_alt_en)
VALUES (1, TRUE, 'SENIOR MARKETING EXECUTIVE', 'Pham Thi', 'Hai Yen.', 'Bright Strategies for Brand Acceleration. Turning vision into measurable growth.', 'VIEW WORK', '/projects', 'CONNECT', '/contact', 'Hero portrait')
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- Expertise Section (Single Row)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.expertise_sections (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  is_published BOOLEAN DEFAULT TRUE,
  eyebrow TEXT DEFAULT 'PROFICIENCIES',
  eyebrow_ja TEXT,
  eyebrow_vi TEXT,
  title TEXT DEFAULT 'Expertise & Tools',
  title_ja TEXT,
  title_vi TEXT,
  strategic_title TEXT DEFAULT 'Strategic Skills',
  strategic_title_ja TEXT,
  strategic_title_vi TEXT,
  strategic_helper_text TEXT,
  strategic_helper_text_ja TEXT,
  strategic_helper_text_vi TEXT,
  strategic_description TEXT,
  strategic_description_ja TEXT,
  strategic_description_vi TEXT,
  tools_title TEXT DEFAULT 'Technical Tools',
  tools_title_ja TEXT,
  tools_title_vi TEXT,
  tools_helper_text TEXT,
  tools_helper_text_ja TEXT,
  tools_helper_text_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_expertise_sections_updated_at BEFORE UPDATE ON public.expertise_sections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.expertise_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view expertise section" ON public.expertise_sections
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage expertise section" ON public.expertise_sections
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

INSERT INTO public.expertise_sections (id, is_published) VALUES (1, TRUE) ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- Expertise Strategic Skills
-- =========================================================
CREATE TABLE IF NOT EXISTS public.expertise_strategic_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL,
  skill_name_ja TEXT,
  skill_name_vi TEXT,
  icon_name TEXT NOT NULL,
  description TEXT,
  description_ja TEXT,
  description_vi TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_expertise_strategic_skills_updated_at BEFORE UPDATE ON public.expertise_strategic_skills
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.expertise_strategic_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published expertise strategic skills" ON public.expertise_strategic_skills
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage expertise strategic skills" ON public.expertise_strategic_skills
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_expertise_strategic_skills_order ON public.expertise_strategic_skills(order_index);

-- =========================================================
-- Expertise Tool Items
-- =========================================================
CREATE TABLE IF NOT EXISTS public.expertise_tool_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL,
  tool_name_ja TEXT,
  tool_name_vi TEXT,
  description TEXT,
  description_ja TEXT,
  description_vi TEXT,
  tool_url TEXT,
  icon_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_expertise_tool_items_updated_at BEFORE UPDATE ON public.expertise_tool_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.expertise_tool_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published expertise tool items" ON public.expertise_tool_items
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage expertise tool items" ON public.expertise_tool_items
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_expertise_tool_items_order ON public.expertise_tool_items(order_index);

-- =========================================================
-- Timeline Section Settings (Single Row)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.timeline_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow_en TEXT,
  title_en TEXT,
  description_en TEXT,
  eyebrow_ja TEXT,
  title_ja TEXT,
  description_ja TEXT,
  eyebrow_vi TEXT,
  title_vi TEXT,
  description_vi TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_timeline_section_settings_updated_at BEFORE UPDATE ON public.timeline_section_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.timeline_section_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view timeline section settings" ON public.timeline_section_settings
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage timeline section settings" ON public.timeline_section_settings
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

INSERT INTO public.timeline_section_settings (id, is_published) VALUES (1, TRUE) ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- Timeline Phases
-- =========================================================
CREATE TABLE IF NOT EXISTS public.timeline_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL,
  location TEXT,
  location_ja TEXT,
  location_vi TEXT,
  title_en TEXT NOT NULL,
  title_ja TEXT NOT NULL,
  title_vi TEXT,
  company_en TEXT,
  company_ja TEXT,
  company_vi TEXT,
  description_en TEXT NOT NULL,
  description_ja TEXT NOT NULL,
  description_vi TEXT,
  image_url TEXT,
  tag_en TEXT,
  tag_ja TEXT,
  tag_vi TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_timeline_phases_updated_at BEFORE UPDATE ON public.timeline_phases
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.timeline_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published timeline phases" ON public.timeline_phases
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage timeline phases" ON public.timeline_phases
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_timeline_phases_order ON public.timeline_phases(order_index);

-- =========================================================
-- Timeline Phase Images
-- =========================================================
CREATE TABLE IF NOT EXISTS public.timeline_phase_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES public.timeline_phases(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  is_cover BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_timeline_phase_images_updated_at BEFORE UPDATE ON public.timeline_phase_images
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.timeline_phase_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view timeline phase images of published phases" ON public.timeline_phase_images
FOR SELECT USING (EXISTS (SELECT 1 FROM public.timeline_phases p WHERE p.id = phase_id AND p.is_published = TRUE));

CREATE POLICY "Authenticated can manage timeline phase images" ON public.timeline_phase_images
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_timeline_phase_images_phase ON public.timeline_phase_images(phase_id, order_index);

-- =========================================================
-- Page Sections (Dynamic Section Management)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL,
  section_name TEXT NOT NULL,
  section_type TEXT NOT NULL,
  page_type TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  is_visible BOOLEAN DEFAULT TRUE,
  is_fixed BOOLEAN DEFAULT FALSE,
  data_source TEXT,
  source_table TEXT,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_page_sections_updated_at BEFORE UPDATE ON public.page_sections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published page sections" ON public.page_sections
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage page sections" ON public.page_sections
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_page_sections_page_type ON public.page_sections(page_type, order_index);
CREATE INDEX idx_page_sections_published ON public.page_sections(is_published);

-- =========================================================
-- Social Links
-- =========================================================
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_social_links_updated_at BEFORE UPDATE ON public.social_links
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published social links" ON public.social_links
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage social links" ON public.social_links
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_social_links_order ON public.social_links(order_index);

-- =========================================================
-- Fonts Management
-- =========================================================
CREATE TABLE IF NOT EXISTS public.fonts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  font_name TEXT NOT NULL UNIQUE,
  font_family TEXT NOT NULL,
  font_type TEXT,
  import_url TEXT,
  import_css TEXT,
  fallback TEXT DEFAULT 'sans-serif',
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_fonts_updated_at BEFORE UPDATE ON public.fonts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.fonts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view fonts" ON public.fonts
FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated can manage fonts" ON public.fonts
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- =========================================================
-- Skill Categories
-- =========================================================
-- Skill Categories
-- =========================================================
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  name_ja TEXT NOT NULL UNIQUE,
  name_vi TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_skill_categories_updated_at BEFORE UPDATE ON public.skill_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published skill categories" ON public.skill_categories
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage skill categories" ON public.skill_categories
FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_skill_categories_order ON public.skill_categories(order_index);


CREATE TABLE IF NOT EXISTS public.hero_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  layout_key text UNIQUE NOT NULL,
  layout_name text NOT NULL,
  description text,
  preview_image_url text,

  default_config jsonb DEFAULT '{}'::jsonb,
  supported_fields jsonb DEFAULT '{}'::jsonb,

  order_index int DEFAULT 0,
  is_active boolean DEFAULT true,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.hero_sections
ADD COLUMN IF NOT EXISTS selected_layout_key text,
ADD COLUMN IF NOT EXISTS layout_config jsonb DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_hero_layouts_key
ON public.hero_layouts(layout_key);

INSERT INTO public.hero_layouts (
  layout_key,
  layout_name,
  description,
  preview_image_url,
  default_config,
  order_index
)
VALUES
(
  'split-left-image-right',
  'Split Layout',
  'Text bên trái, ảnh bên phải',
  '',
  '{
    "textAlign": "left",
    "imagePosition": "right",
    "height": "fullscreen"
  }',
  1
),
(
  'centered-minimal',
  'Centered Minimal',
  'Text ở giữa, tối giản',
  '',
  '{
    "textAlign": "center",
    "maxWidth": "md",
    "showImage": false
  }',
  2
),
(
  'full-background',
  'Full Background',
  'Background full + overlay',
  '',
  '{
    "overlay": true,
    "overlayOpacity": 0.4,
    "textAlign": "center"
  }',
  3
),
(
  'card-overlay',
  'Card Overlay',
  'Ảnh nền + card nội dung',
  '',
  '{
    "card": true,
    "cardShadow": true,
    "textAlign": "left"
  }',
  4
)
ON CONFLICT (layout_key) DO NOTHING;


UPDATE public.hero_sections
SET 
  selected_layout_key = 'split-left-image-right',
  layout_config = '{
    "textAlign": "left",
    "imagePosition": "right",
    "height": "fullscreen"
  }'
WHERE selected_layout_key IS NULL;

ALTER TABLE public.hero_layouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access hero_layouts"
ON public.hero_layouts
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- =========================================================
-- Contact Section (Single Row)
CREATE TABLE IF NOT EXISTS public.contact_sections (
  id INTEGER PRIMARY KEY CHECK (id = 1),

  is_published BOOLEAN DEFAULT TRUE,

  eyebrow TEXT,
  eyebrow_ja TEXT,
  eyebrow_vi TEXT,

  title_line_1_en TEXT,
  title_line_1_ja TEXT,
  title_line_1_vi TEXT,

  title_line_2_en TEXT,
  title_line_2_ja TEXT,
  title_line_2_vi TEXT,

  title_line_2_html TEXT,

  description_en TEXT,
  description_ja TEXT,
  description_vi TEXT,

  primary_button_label_en TEXT,
  primary_button_label_ja TEXT,
  primary_button_label_vi TEXT,
  primary_button_url TEXT,

  background_image_url TEXT,
  overlay_opacity FLOAT DEFAULT 0.3,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- trigger updated_at
CREATE TRIGGER trg_contact_sections_updated_at
BEFORE UPDATE ON public.contact_sections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.contact_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view contact section"
ON public.contact_sections
FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Authenticated can manage contact section"
ON public.contact_sections
FOR ALL TO authenticated
USING (TRUE) WITH CHECK (TRUE);

-- default row
INSERT INTO public.contact_sections (
  id,
  eyebrow,
  title_line_1_en,
  title_line_2_en,
  description_en,
  primary_button_label_en
)
VALUES (
  1,
  'GET IN TOUCH',
  'Let’s build something',
  'remarkable together',
  'Start a conversation and tell me about your project.',
  'Start a conversation'
)
ON CONFLICT (id) DO NOTHING;


-- =========================================================
-- Skill Categories: add description + icon_url
-- =========================================================
ALTER TABLE public.skill_categories
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- =========================================================
-- Skills: add richer fields
-- =========================================================
ALTER TABLE public.skills
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS overview TEXT,
ADD COLUMN IF NOT EXISTS application TEXT,
ADD COLUMN IF NOT EXISTS use_cases TEXT,
ADD COLUMN IF NOT EXISTS icon_url TEXT,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level TEXT,
ADD COLUMN IF NOT EXISTS experience_level TEXT,
ADD COLUMN IF NOT EXISTS estimated_time TEXT,
ADD COLUMN IF NOT EXISTS tool_stack TEXT[],
ADD COLUMN IF NOT EXISTS key_points TEXT[],
ADD COLUMN IF NOT EXISTS related_skill_ids UUID[],
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- =========================================================
-- Migrate category TEXT -> category_id (FIXED)
-- =========================================================
UPDATE public.skills s
SET category_id = sc.id
FROM public.skill_categories sc
WHERE s.category_id IS NULL
  AND s.category = sc.name_en;

  -- =========================================================
-- Skill Highlights
-- =========================================================
CREATE TABLE IF NOT EXISTS public.skill_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_skill_highlights_updated_at
BEFORE UPDATE ON public.skill_highlights
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.skill_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published skill highlights"
ON public.skill_highlights
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.skills s
    WHERE s.id = skill_highlights.skill_id
      AND s.is_published = TRUE
  )
);

CREATE POLICY "Authenticated can manage skill highlights"
ON public.skill_highlights
FOR ALL TO authenticated
USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_skill_highlights_skill
ON public.skill_highlights(skill_id, order_index);

-- =========================================================
-- Skill Applications
-- =========================================================
CREATE TABLE IF NOT EXISTS public.skill_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_skill_applications_updated_at
BEFORE UPDATE ON public.skill_applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.skill_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published skill applications"
ON public.skill_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.skills s
    WHERE s.id = skill_applications.skill_id
      AND s.is_published = TRUE
  )
);

CREATE POLICY "Authenticated can manage skill applications"
ON public.skill_applications
FOR ALL TO authenticated
USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_skill_applications_skill
ON public.skill_applications(skill_id, order_index);

-- =========================================================
-- Skill Tools
-- =========================================================
CREATE TABLE IF NOT EXISTS public.skill_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  tool_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_skill_tools_updated_at
BEFORE UPDATE ON public.skill_tools
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.skill_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published skill tools"
ON public.skill_tools
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.skills s
    WHERE s.id = skill_tools.skill_id
      AND s.is_published = TRUE
  )
);

CREATE POLICY "Authenticated can manage skill tools"
ON public.skill_tools
FOR ALL TO authenticated
USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_skill_tools_skill
ON public.skill_tools(skill_id, order_index);

-- =========================================================
-- Skill Steps
-- =========================================================
CREATE TABLE IF NOT EXISTS public.skill_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  step_title TEXT NOT NULL,
  step_description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_skill_steps_updated_at
BEFORE UPDATE ON public.skill_steps
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.skill_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published skill steps"
ON public.skill_steps
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.skills s
    WHERE s.id = skill_steps.skill_id
      AND s.is_published = TRUE
  )
);

CREATE POLICY "Authenticated can manage skill steps"
ON public.skill_steps
FOR ALL TO authenticated
USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_skill_steps_skill
ON public.skill_steps(skill_id, order_index);


WITH

-- ================= CATEGORY =================
cat1 AS (
  INSERT INTO public.skill_categories (slug, name_en, name_ja, description, icon_url, order_index, is_published)
  VALUES (
    'frontend-development',
    'Frontend Development',
    'フロントエンド開発',
    'Skills for building modern, responsive, and interactive user interfaces.',
    'https://res.cloudinary.com/demo/image/upload/v1/skill-categories/frontend.png',
    10,
    TRUE
  )
  RETURNING id
),
cat2 AS (
  INSERT INTO public.skill_categories (slug, name_en, name_ja, description, icon_url, order_index, is_published)
  VALUES (
    'backend-development',
    'Backend Development',
    'バックエンド開発',
    'Skills for building APIs, databases, and scalable server-side systems.',
    'https://res.cloudinary.com/demo/image/upload/v1/skill-categories/backend.png',
    11,
    TRUE
  )
  RETURNING id
),

-- ================= SKILLS =================
s1 AS (
  INSERT INTO public.skills (
    category_id, slug, skill_name, short_description, description, overview,
    application, use_cases, icon_url, cover_image_url,
    difficulty_level, experience_level, estimated_time,
    tool_stack, key_points, order_index, is_published
  )
  SELECT
    id,
    'react-development',
    'React Development',
    'Build dynamic and interactive UI using React.',
    'React development focuses on building reusable UI components and managing state efficiently.',
    'Used for building scalable frontend applications with component-based architecture.',
    'Applied in dashboards, SaaS platforms, and web apps.',
    'Used in admin panels, landing pages, and SPA apps.',
    'https://res.cloudinary.com/demo/image/upload/v1/skills/react.png',
    'https://res.cloudinary.com/demo/image/upload/v1/skills/react-cover.png',
    'Intermediate', '2+ years', '1-2 weeks',
    ARRAY['React', 'Next.js', 'TypeScript'],
    ARRAY['Component architecture', 'State management', 'Performance optimization'],
    1, TRUE
  FROM cat1 RETURNING id
),
s2 AS (
  INSERT INTO public.skills (
    category_id, slug, skill_name, short_description, description, overview,
    application, use_cases, icon_url, cover_image_url,
    difficulty_level, experience_level, estimated_time,
    tool_stack, key_points, order_index, is_published
  )
  SELECT
    id,
    'responsive-design',
    'Responsive Design',
    'Design layouts that work across all screen sizes.',
    'Responsive design ensures UI adapts seamlessly to different devices.',
    'Used for building mobile-first and adaptive layouts.',
    'Applied in websites, landing pages, and dashboards.',
    'Used in e-commerce, blogs, and SaaS apps.',
    'https://res.cloudinary.com/demo/image/upload/v1/skills/responsive.png',
    'https://res.cloudinary.com/demo/image/upload/v1/skills/responsive-cover.png',
    'Beginner', '1+ years', '3-5 days',
    ARRAY['CSS', 'Tailwind', 'Flexbox', 'Grid'],
    ARRAY['Mobile-first', 'Breakpoints', 'Flexible layout'],
    2, TRUE
  FROM cat1 RETURNING id
),

s3 AS (
  INSERT INTO public.skills (
    category_id, slug, skill_name, short_description, description, overview,
    application, use_cases, icon_url, cover_image_url,
    difficulty_level, experience_level, estimated_time,
    tool_stack, key_points, order_index, is_published
  )
  SELECT
    id,
    'api-development',
    'API Development',
    'Design and build RESTful APIs.',
    'API development enables communication between frontend and backend systems.',
    'Used for building scalable backend services.',
    'Applied in web apps, mobile apps, and integrations.',
    'Used in SaaS platforms, microservices, and data pipelines.',
    'https://res.cloudinary.com/demo/image/upload/v1/skills/api.png',
    'https://res.cloudinary.com/demo/image/upload/v1/skills/api-cover.png',
    'Advanced', '3+ years', '2-3 weeks',
    ARRAY['Node.js', 'Express', 'PostgreSQL'],
    ARRAY['REST API', 'Authentication', 'Error handling'],
    1, TRUE
  FROM cat2 RETURNING id
),
s4 AS (
  INSERT INTO public.skills (
    category_id, slug, skill_name, short_description, description, overview,
    application, use_cases, icon_url, cover_image_url,
    difficulty_level, experience_level, estimated_time,
    tool_stack, key_points, order_index, is_published
  )
  SELECT
    id,
    'database-design',
    'Database Design',
    'Design efficient and scalable database schemas.',
    'Database design focuses on structuring data efficiently.',
    'Used for optimizing queries and data storage.',
    'Applied in backend systems and analytics.',
    'Used in SaaS, e-commerce, and enterprise apps.',
    'https://res.cloudinary.com/demo/image/upload/v1/skills/db.png',
    'https://res.cloudinary.com/demo/image/upload/v1/skills/db-cover.png',
    'Advanced', '3+ years', '2 weeks',
    ARRAY['PostgreSQL', 'Supabase', 'SQL'],
    ARRAY['Normalization', 'Indexing', 'Query optimization'],
    2, TRUE
  FROM cat2 RETURNING id
),

-- ================= GENERATE COMMON DATA =================
all_skills AS (
  SELECT id FROM s1
  UNION ALL SELECT id FROM s2
  UNION ALL SELECT id FROM s3
  UNION ALL SELECT id FROM s4
),

-- ================= HIGHLIGHTS =================
h AS (
  INSERT INTO public.skill_highlights (skill_id, title, description, order_index)
  SELECT id, 'Core Strength', 'Key capability of this skill.', 1 FROM all_skills
),

-- ================= APPLICATIONS =================
a AS (
  INSERT INTO public.skill_applications (skill_id, title, description, order_index)
  SELECT id, 'Real-world Use', 'How this skill is used in real projects.', 1 FROM all_skills
),

-- ================= TOOLS =================
t AS (
  INSERT INTO public.skill_tools (skill_id, tool_name, description, icon_url, tool_url, order_index)
  SELECT id, 'Main Tool', 'Primary tool used for this skill.',
  'https://res.cloudinary.com/demo/image/upload/v1/tools/default.png',
  'https://example.com',
  1 FROM all_skills
),

-- ================= STEPS =================
st AS (
  INSERT INTO public.skill_steps (skill_id, step_title, step_description, order_index)
  SELECT id, 'Step 1', 'Basic workflow step.', 1 FROM all_skills
)

SELECT 'MULTI CATEGORY DATA INSERTED';


CREATE TABLE IF NOT EXISTS public.portfolio_visit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  visitor_id TEXT,
  session_id TEXT,

  page_key TEXT,
  page_url TEXT NOT NULL,
  referrer TEXT,
  traffic_source TEXT,

  device_type TEXT,
  screen_width INTEGER,
  screen_height INTEGER,

  user_agent TEXT,

  time_on_page_seconds INTEGER DEFAULT 0,
  max_scroll_percent INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visit_created_at ON public.portfolio_visit_events(created_at DESC);
CREATE INDEX idx_visit_page_key ON public.portfolio_visit_events(page_key);
CREATE INDEX idx_visit_visitor ON public.portfolio_visit_events(visitor_id);


ALTER TABLE public.portfolio_visit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert portfolio visit events"
ON public.portfolio_visit_events
FOR INSERT
TO anon, authenticated
WITH CHECK (TRUE);

CREATE POLICY "Authenticated can read portfolio visit events"
ON public.portfolio_visit_events
FOR SELECT
TO authenticated
USING (TRUE);

CREATE POLICY "Public can update portfolio visit events"
ON public.portfolio_visit_events
FOR UPDATE
TO anon, authenticated
USING (TRUE)
WITH CHECK (TRUE);

CREATE POLICY "Public can update portfolio visit events"
ON public.portfolio_visit_events
FOR UPDATE
TO anon, authenticated
USING (TRUE)
WITH CHECK (TRUE);


CREATE TABLE IF NOT EXISTS public.daily_report_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date DATE NOT NULL UNIQUE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'sent',
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.daily_report_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can manage daily report logs" ON public.daily_report_logs;

CREATE POLICY "Authenticated can manage daily report logs"
ON public.daily_report_logs
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);


select vault.create_secret('https://eusupcbxvnsyhzklwzyh.supabase.co', 'project_url');

select vault.create_secret(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3VwY2J4dm5zeWh6a2x3enloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDE1NzQsImV4cCI6MjA4OTkxNzU3NH0.STym2EdPc93M_i1YKlp500NGYFkVTP71cYKVkkbZvtU',
  'anon_key'
);
create extension if not exists pg_cron;

select
  cron.schedule(
    'daily-analytics-report-5pm-vn',
    '0 10 * * *',
    $$
    select
      net.http_post(
        url:= (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
          || '/functions/v1/send-daily-analytics-report',
        headers:= jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key')
        ),
        body:= '{}'::jsonb
      );
    $$
  );

  create extension if not exists pg_net;



  

  alter table public.daily_report_logs
drop constraint if exists daily_report_logs_report_date_key;

alter table public.daily_report_logs
add column if not exists trigger_source text,
add column if not exists note text;


create table if not exists public.page_animation_settings (
  id uuid primary key default gen_random_uuid(),

  page_type text not null unique,
  is_enabled boolean default true,

  animation_preset text default 'fade-up',
  trigger_type text default 'while-in-view',
  duration_ms integer default 700,
  delay_ms integer default 0,
  stagger_ms integer default 120,
  ease_type text default 'easeOut',

  distance_px integer default 24,
  scale_from numeric(4,2) default 1.00,
  opacity_from numeric(4,2) default 0.00,
  blur_px integer default 0,

  once_only boolean default true,
  amount_visible numeric(3,2) default 0.20,

  respect_reduced_motion boolean default true,
  is_published boolean default true,

  extra_config jsonb default '{}'::jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_page_animation_settings_updated_at
before update on public.page_animation_settings
for each row execute function public.set_updated_at();

alter table public.page_animation_settings enable row level security;

create policy "Public can view published page animation settings"
on public.page_animation_settings
for select
using (is_published = true);

create policy "Authenticated can manage page animation settings"
on public.page_animation_settings
for all to authenticated
using (true) with check (true);

create index if not exists idx_page_animation_settings_page_type
on public.page_animation_settings(page_type);


create table if not exists public.section_animation_settings (
  id uuid primary key default gen_random_uuid(),

  page_section_id uuid not null references public.page_sections(id) on delete cascade,
  page_type text not null,
  section_key text not null,

  is_enabled boolean default true,
  use_page_default boolean default true,

  animation_preset text,
  trigger_type text default 'while-in-view',
  duration_ms integer,
  delay_ms integer default 0,
  stagger_ms integer,
  ease_type text,

  distance_px integer,
  scale_from numeric(4,2),
  opacity_from numeric(4,2),
  blur_px integer,

  once_only boolean,
  amount_visible numeric(3,2),

  mobile_animation_preset text,
  mobile_disable boolean default false,

  target_scope text default 'section',
  target_selector text,
  split_children boolean default false,

  order_index integer default 0,
  is_published boolean default true,

  extra_config jsonb default '{}'::jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint uq_section_animation_page_section unique (page_section_id)
);

create trigger trg_section_animation_settings_updated_at
before update on public.section_animation_settings
for each row execute function public.set_updated_at();

alter table public.section_animation_settings enable row level security;

create policy "Public can view published section animation settings"
on public.section_animation_settings
for select
using (is_published = true);

create policy "Authenticated can manage section animation settings"
on public.section_animation_settings
for all to authenticated
using (true) with check (true);

create index if not exists idx_section_animation_settings_page_type
on public.section_animation_settings(page_type);

create index if not exists idx_section_animation_settings_section_key
on public.section_animation_settings(section_key);

create index if not exists idx_section_animation_settings_page_section_id
on public.section_animation_settings(page_section_id);


-- =========================================================
-- PAGE ANIMATION SETTINGS
-- =========================================================
alter table public.page_animation_settings enable row level security;

drop policy if exists "Public can view published page animation settings" on public.page_animation_settings;
drop policy if exists "Authenticated can manage page animation settings" on public.page_animation_settings;

create policy "Public can view published page animation settings"
on public.page_animation_settings
for select
using (is_published = true);

create policy "Authenticated can manage page animation settings"
on public.page_animation_settings
for all to authenticated
using (true)
with check (true);

-- =========================================================
-- SECTION ANIMATION SETTINGS
-- =========================================================
alter table public.section_animation_settings enable row level security;

drop policy if exists "Public can view published section animation settings" on public.section_animation_settings;
drop policy if exists "Authenticated can manage section animation settings" on public.section_animation_settings;

create policy "Public can view published section animation settings"
on public.section_animation_settings
for select
using (is_published = true);

create policy "Authenticated can manage section animation settings"
on public.section_animation_settings
for all to authenticated
using (true)
with check (true);

-- =========================================================
-- PAGE SECTIONS
-- đảm bảo public đọc được section published
-- =========================================================
alter table public.page_sections enable row level security;

drop policy if exists "Public can view published page sections" on public.page_sections;
drop policy if exists "Authenticated can manage page sections" on public.page_sections;

create policy "Public can view published page sections"
on public.page_sections
for select
using (is_published = true);

create policy "Authenticated can manage page sections"
on public.page_sections
for all to authenticated
using (true)
with check (true);

-- =========================================================
-- PORTFOLIO VISIT EVENTS
-- thêm lại cho chắc nếu đang lỗi insert từ anon
-- =========================================================
alter table public.portfolio_visit_events enable row level security;

drop policy if exists "Public can insert portfolio visit events" on public.portfolio_visit_events;
drop policy if exists "Authenticated can read portfolio visit events" on public.portfolio_visit_events;
drop policy if exists "Public can update portfolio visit events" on public.portfolio_visit_events;

create policy "Public can insert portfolio visit events"
on public.portfolio_visit_events
for insert
to anon, authenticated
with check (true);

create policy "Authenticated can read portfolio visit events"
on public.portfolio_visit_events
for select
to authenticated
using (true);

create policy "Public can update portfolio visit events"
on public.portfolio_visit_events
for update
to anon, authenticated
using (true)
with check (true);



-- =========================================================
-- DROP SECTION ANIMATION SETTINGS
-- =========================================================

-- drop trigger
drop trigger if exists trg_section_animation_settings_updated_at
on public.section_animation_settings;

-- drop policies
drop policy if exists "Public can view published section animation settings"
on public.section_animation_settings;

drop policy if exists "Authenticated can manage section animation settings"
on public.section_animation_settings;

-- drop indexes
drop index if exists idx_section_animation_settings_page_type;
drop index if exists idx_section_animation_settings_section_key;
drop index if exists idx_section_animation_settings_page_section_id;

-- drop table
drop table if exists public.section_animation_settings cascade;

-- =========================================================
-- DROP PAGE ANIMATION SETTINGS
-- =========================================================

-- drop trigger
drop trigger if exists trg_page_animation_settings_updated_at
on public.page_animation_settings;

-- drop policies
drop policy if exists "Public can view published page animation settings"
on public.page_animation_settings;

drop policy if exists "Authenticated can manage page animation settings"
on public.page_animation_settings;

-- drop index
drop index if exists idx_page_animation_settings_page_type;

-- drop table
drop table if exists public.page_animation_settings cascade;


-- =========================================================
-- Skill Images (Gallery)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.skill_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  skill_id UUID NOT NULL
    REFERENCES public.skills(id)
    ON DELETE CASCADE,

  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,

  is_cover BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- trigger updated_at
CREATE TRIGGER trg_skill_images_updated_at
BEFORE UPDATE ON public.skill_images
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.skill_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view skill images of published skills"
ON public.skill_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.skills s
    WHERE s.id = skill_images.skill_id
      AND s.is_published = TRUE
  )
);

CREATE POLICY "Authenticated can manage skill images"
ON public.skill_images
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- index
CREATE INDEX idx_skill_images_skill
ON public.skill_images(skill_id, order_index);



-- =========================================================
-- Skill Highlight Images (Gallery for each skill highlight item)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.skill_highlight_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  highlight_id UUID NOT NULL
    REFERENCES public.skill_highlights(id)
    ON DELETE CASCADE,

  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,

  is_cover BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- trigger updated_at
DROP TRIGGER IF EXISTS trg_skill_highlight_images_updated_at
ON public.skill_highlight_images;

CREATE TRIGGER trg_skill_highlight_images_updated_at
BEFORE UPDATE ON public.skill_highlight_images
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.skill_highlight_images ENABLE ROW LEVEL SECURITY;

-- xóa policy cũ nếu chạy lại
DROP POLICY IF EXISTS "Public can view skill highlight images of published skills"
ON public.skill_highlight_images;

DROP POLICY IF EXISTS "Authenticated can manage skill highlight images"
ON public.skill_highlight_images;

-- public chỉ xem được ảnh highlight của skill đã published
CREATE POLICY "Public can view skill highlight images of published skills"
ON public.skill_highlight_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.skill_highlights sh
    JOIN public.skills s
      ON s.id = sh.skill_id
    WHERE sh.id = skill_highlight_images.highlight_id
      AND s.is_published = TRUE
  )
);

-- admin/authenticated quản lý toàn bộ
CREATE POLICY "Authenticated can manage skill highlight images"
ON public.skill_highlight_images
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- index
CREATE INDEX IF NOT EXISTS idx_skill_highlight_images_highlight
ON public.skill_highlight_images(highlight_id, order_index);

CREATE INDEX IF NOT EXISTS idx_skill_highlight_images_cover
ON public.skill_highlight_images(highlight_id, is_cover);



-- =========================================================
-- Skills: add Japanese columns
-- =========================================================
ALTER TABLE public.skills
ADD COLUMN IF NOT EXISTS skill_name_ja TEXT,
ADD COLUMN IF NOT EXISTS short_description_ja TEXT,
ADD COLUMN IF NOT EXISTS description_ja TEXT,
ADD COLUMN IF NOT EXISTS overview_ja TEXT,
ADD COLUMN IF NOT EXISTS application_ja TEXT,
ADD COLUMN IF NOT EXISTS use_cases_ja TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level_ja TEXT,
ADD COLUMN IF NOT EXISTS experience_level_ja TEXT,
ADD COLUMN IF NOT EXISTS estimated_time_ja TEXT,
ADD COLUMN IF NOT EXISTS seo_title_ja TEXT,
ADD COLUMN IF NOT EXISTS seo_description_ja TEXT;


-- PROJECTS
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS title_ja TEXT,
ADD COLUMN IF NOT EXISTS short_description_ja TEXT,
ADD COLUMN IF NOT EXISTS description_ja TEXT,
ADD COLUMN IF NOT EXISTS overview_ja TEXT,
ADD COLUMN IF NOT EXISTS challenge_ja TEXT,
ADD COLUMN IF NOT EXISTS solution_ja TEXT;

-- PROJECT CATEGORIES
ALTER TABLE public.project_categories
ADD COLUMN IF NOT EXISTS name_ja TEXT;

-- PROJECT RESULTS
ALTER TABLE public.project_results
ADD COLUMN IF NOT EXISTS label_ja TEXT,
ADD COLUMN IF NOT EXISTS value_ja TEXT;

-- PROJECT APPROACHES
ALTER TABLE public.project_approaches
ADD COLUMN IF NOT EXISTS approach_ja TEXT;

-- PROJECT TESTIMONIALS
ALTER TABLE public.project_testimonials
ADD COLUMN IF NOT EXISTS quote_ja TEXT,
ADD COLUMN IF NOT EXISTS title_ja TEXT,
ADD COLUMN IF NOT EXISTS company_ja TEXT;



ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS video_url TEXT;

ALTER TABLE public.project_testimonials
ADD COLUMN IF NOT EXISTS video_url TEXT;


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


ALTER TABLE public.projects
ADD COLUMN order_index INTEGER DEFAULT 0;


CREATE INDEX idx_projects_order
ON public.projects(order_index);


-- =========================================================
-- ENSURE JAPANESE COLUMNS FOR:
-- Testimonials, Strategic Skills, Tool Items, About Me
-- Safe to run multiple times
-- =========================================================

BEGIN;

-- 1) Testimonials
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS role_ja TEXT,
ADD COLUMN IF NOT EXISTS quote_ja TEXT;

-- 2) Expertise Strategic Skills
ALTER TABLE public.expertise_strategic_skills
ADD COLUMN IF NOT EXISTS skill_name_ja TEXT,
ADD COLUMN IF NOT EXISTS description_ja TEXT;

-- 3) Expertise Tool Items
ALTER TABLE public.expertise_tool_items
ADD COLUMN IF NOT EXISTS tool_name_ja TEXT,
ADD COLUMN IF NOT EXISTS description_ja TEXT;

-- 4) About Me / About Content
ALTER TABLE public.about_content
ADD COLUMN IF NOT EXISTS title_ja TEXT,
ADD COLUMN IF NOT EXISTS content_ja TEXT;

-- 5) Expertise section titles/helpers (nếu UI section này cũng cần JA đầy đủ)
ALTER TABLE public.expertise_sections
ADD COLUMN IF NOT EXISTS eyebrow_ja TEXT,
ADD COLUMN IF NOT EXISTS title_ja TEXT,
ADD COLUMN IF NOT EXISTS strategic_title_ja TEXT,
ADD COLUMN IF NOT EXISTS strategic_helper_text_ja TEXT,
ADD COLUMN IF NOT EXISTS strategic_description_ja TEXT,
ADD COLUMN IF NOT EXISTS tools_title_ja TEXT,
ADD COLUMN IF NOT EXISTS tools_helper_text_ja TEXT;

-- =========================================================
-- OPTIONAL: backfill JA from EN if JA is currently NULL
-- =========================================================

UPDATE public.testimonials
SET
  role_ja = COALESCE(role_ja, role_en),
  quote_ja = COALESCE(quote_ja, quote_en);

UPDATE public.expertise_strategic_skills
SET
  skill_name_ja = COALESCE(skill_name_ja, skill_name),
  description_ja = COALESCE(description_ja, description);

UPDATE public.expertise_tool_items
SET
  tool_name_ja = COALESCE(tool_name_ja, tool_name),
  description_ja = COALESCE(description_ja, description);

UPDATE public.about_content
SET
  title_ja = COALESCE(title_ja, title_en),
  content_ja = COALESCE(content_ja, content_en);

UPDATE public.expertise_sections
SET
  eyebrow_ja = COALESCE(eyebrow_ja, eyebrow),
  title_ja = COALESCE(title_ja, title),
  strategic_title_ja = COALESCE(strategic_title_ja, strategic_title),
  strategic_helper_text_ja = COALESCE(strategic_helper_text_ja, strategic_helper_text),
  strategic_description_ja = COALESCE(strategic_description_ja, strategic_description),
  tools_title_ja = COALESCE(tools_title_ja, tools_title),
  tools_helper_text_ja = COALESCE(tools_helper_text_ja, tools_helper_text)
WHERE id = 1;

COMMIT;


-- =========================================================
-- FAQ
-- =========================================================
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

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- trigger updated_at
CREATE TRIGGER trg_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can view published faqs"
ON public.faqs
FOR SELECT
USING (is_published = TRUE);

-- Admin manage
CREATE POLICY "Authenticated can manage faqs"
ON public.faqs
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- index
CREATE INDEX idx_faqs_order
ON public.faqs(order_index);

CREATE INDEX idx_faqs_category
ON public.faqs(category);

ALTER TYPE section_type_enum ADD VALUE 'faq';

ALTER TYPE section_type_enum ADD VALUE IF NOT EXISTS 'faq';



INSERT INTO public.page_sections (
  section_key,
  section_name,
  section_type,
  page_type,
  order_index,
  is_published,
  is_visible,
  data_source,
  source_table,
  description
)
VALUES (
  'faq',
  'FAQ Section',
  'faq',
  'home',
  999,
  TRUE,
  TRUE,
  'custom', -- 👈 bắt buộc
  'faqs',   -- 👈 OK
  'Frequently Asked Questions'
)
ON CONFLICT DO NOTHING;


ALTER TABLE public.expertise_strategic_skills
ADD COLUMN IF NOT EXISTS icon_url TEXT;


ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS company TEXT;

ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS purpose TEXT;


-- Thêm cột phân loại ảnh ngang / dọc cho timeline
ALTER TABLE public.timeline_phase_images
ADD COLUMN IF NOT EXISTS image_orientation TEXT DEFAULT 'landscape';

-- Thêm check constraint để tránh nhập sai
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'timeline_phase_images_image_orientation_check'
  ) THEN
    ALTER TABLE public.timeline_phase_images
    ADD CONSTRAINT timeline_phase_images_image_orientation_check
    CHECK (image_orientation IN ('landscape', 'portrait'));
  END IF;
END $$;

-- Index để query nhanh hơn nếu cần lọc
CREATE INDEX IF NOT EXISTS idx_timeline_phase_images_orientation
ON public.timeline_phase_images(phase_id, image_orientation, order_index);


-- Thêm cột mặc định cho cả phase
ALTER TABLE public.timeline_phases
ADD COLUMN IF NOT EXISTS default_image_orientation TEXT DEFAULT 'landscape';

-- Check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'timeline_phases_default_image_orientation_check'
  ) THEN
    ALTER TABLE public.timeline_phases
    ADD CONSTRAINT timeline_phases_default_image_orientation_check
    CHECK (default_image_orientation IN ('landscape', 'portrait'));
  END IF;
END $$;


-- =========================================================
-- Stats / Metrics Section riêng
-- Không liên quan bảng cũ
-- =========================================================

CREATE TABLE IF NOT EXISTS public.site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  stat_key TEXT UNIQUE,
  value_text TEXT NOT NULL,
  label_en TEXT NOT NULL,
  label_ja TEXT,
  label_vi TEXT,

  description_en TEXT,
  description_ja TEXT,
  description_vi TEXT,

  icon_url TEXT,

  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_site_stats_updated_at ON public.site_stats;

CREATE TRIGGER trg_site_stats_updated_at
BEFORE UPDATE ON public.site_stats
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Public chỉ được đọc item đang publish
DROP POLICY IF EXISTS "Public can view published site stats" ON public.site_stats;
CREATE POLICY "Public can view published site stats"
ON public.site_stats
FOR SELECT
USING (is_published = TRUE);

-- Authenticated quản lý toàn bộ
DROP POLICY IF EXISTS "Authenticated can manage site stats" ON public.site_stats;
CREATE POLICY "Authenticated can manage site stats"
ON public.site_stats
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- Index
CREATE INDEX IF NOT EXISTS idx_site_stats_order
ON public.site_stats(order_index);

CREATE INDEX IF NOT EXISTS idx_site_stats_published
ON public.site_stats(is_published);

-- Seed mẫu giống UI bạn gửi
INSERT INTO public.site_stats (
  stat_key,
  value_text,
  label_en,
  label_ja,
  description_en,
  description_ja,
  icon_url,
  order_index,
  is_published
)
VALUES
(
  'ad_impressions',
  '3m+',
  'Ad impressions managed',
  '管理した広告インプレッション',
  NULL,
  NULL,
  NULL,
  1,
  TRUE
),
(
  'projects_launched',
  '27+',
  'Successful projects launched',
  '立ち上げたプロジェクト数',
  NULL,
  NULL,
  NULL,
  2,
  TRUE
),
(
  'client_satisfaction',
  '98%',
  'Client satisfaction rate',
  '顧客満足度',
  NULL,
  NULL,
  NULL,
  3,
  TRUE
),
(
  'monthly_visitors',
  '50k+',
  'Monthly visitors driven through SEO',
  'SEO経由の月間訪問者数',
  NULL,
  NULL,
  NULL,
  4,
  TRUE
)
ON CONFLICT (stat_key) DO NOTHING;
-- =========================================================
-- Stats / Metrics Section riêng
-- Không liên quan bảng cũ
-- =========================================================

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

DROP TRIGGER IF EXISTS trg_site_stats_updated_at ON public.site_stats;

CREATE TRIGGER trg_site_stats_updated_at
BEFORE UPDATE ON public.site_stats
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published site stats" ON public.site_stats;
CREATE POLICY "Public can view published site stats"
ON public.site_stats
FOR SELECT
USING (is_published = TRUE);

DROP POLICY IF EXISTS "Authenticated can manage site stats" ON public.site_stats;
CREATE POLICY "Authenticated can manage site stats"
ON public.site_stats
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_site_stats_order
ON public.site_stats(order_index);

CREATE INDEX IF NOT EXISTS idx_site_stats_published
ON public.site_stats(is_published);

INSERT INTO public.site_stats (
  stat_key,
  value_text,
  label_en,
  label_ja,
  description_en,
  description_ja,
  icon_url,
  order_index,
  is_published
)
VALUES
(
  'ad_impressions',
  '3m+',
  'Ad impressions managed',
  '管理した広告インプレッション',
  NULL,
  NULL,
  NULL,
  1,
  TRUE
),
(
  'projects_launched',
  '27+',
  'Successful projects launched',
  '立ち上げたプロジェクト数',
  NULL,
  NULL,
  NULL,
  2,
  TRUE
),
(
  'client_satisfaction',
  '98%',
  'Client satisfaction rate',
  '顧客満足度',
  NULL,
  NULL,
  NULL,
  3,
  TRUE
),
(
  'monthly_visitors',
  '50k+',
  'Monthly visitors driven through SEO',
  'SEO経由の月間訪問者数',
  NULL,
  NULL,
  NULL,
  4,
  TRUE
)
ON CONFLICT (stat_key) DO NOTHING;

-- =========================================================
-- Stats Section Settings
-- =========================================================

CREATE TABLE IF NOT EXISTS public.site_stats_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),

  is_published BOOLEAN DEFAULT TRUE,

  eyebrow_en TEXT,
  eyebrow_ja TEXT,
  eyebrow_vi TEXT,

  title_en TEXT,
  title_ja TEXT,
  title_vi TEXT,

  description_en TEXT,
  description_ja TEXT,
  description_vi TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_site_stats_section_settings_updated_at
ON public.site_stats_section_settings;

CREATE TRIGGER trg_site_stats_section_settings_updated_at
BEFORE UPDATE ON public.site_stats_section_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.site_stats_section_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site stats section settings"
ON public.site_stats_section_settings;
CREATE POLICY "Public can view site stats section settings"
ON public.site_stats_section_settings
FOR SELECT
USING (is_published = TRUE);

DROP POLICY IF EXISTS "Authenticated can manage site stats section settings"
ON public.site_stats_section_settings;
CREATE POLICY "Authenticated can manage site stats section settings"
ON public.site_stats_section_settings
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

INSERT INTO public.site_stats_section_settings (
  id,
  is_published,
  title_en,
  title_ja
)
VALUES (
  1,
  TRUE,
  'Stats',
  '実績'
)
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- Add into page_sections for Section Management
-- section_type dùng metrics để hợp lệ enum
-- =========================================================

INSERT INTO public.page_sections (
  section_key,
  section_name,
  section_type,
  page_type,
  order_index,
  is_published,
  is_visible,
  is_fixed,
  data_source,
  source_table,
  description,
  icon_name
)
SELECT
  'stats',
  'Stats Section',
  'metrics',
  'home',
  50,
  TRUE,
  TRUE,
  FALSE,
  'custom',
  'site_stats',
  'Statistics / Achievements section',
  'BarChart3'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.page_sections
  WHERE section_key = 'stats'
    AND page_type = 'home'
);

UPDATE public.page_sections
SET
  section_type = 'stats',
  section_name = 'Stats Section',
  data_source = 'custom',
  source_table = 'site_stats',
  description = 'Statistics / Achievements section'
WHERE section_key = 'stats'
  AND page_type = 'home';


  ALTER TABLE public.about_content
DROP COLUMN image_url;

-- =========================================================
-- About Images (Gallery)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.about_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  about_id UUID NOT NULL
    REFERENCES public.about_content(id)
    ON DELETE CASCADE,

  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,

  is_cover BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- trigger updated_at
CREATE TRIGGER trg_about_images_updated_at
BEFORE UPDATE ON public.about_images
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.about_images ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can view about images"
ON public.about_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.about_content ac
    WHERE ac.id = about_images.about_id
      AND ac.is_published = TRUE
  )
);

-- Admin manage
CREATE POLICY "Authenticated can manage about images"
ON public.about_images
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- index
CREATE INDEX idx_about_images_about
ON public.about_images(about_id, order_index);

CREATE INDEX idx_about_images_cover
ON public.about_images(about_id, is_cover);

-- =========================================================
-- ABOUT TAGS
-- =========================================================

CREATE TABLE IF NOT EXISTS public.about_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ja TEXT,
  name_vi TEXT,
  description TEXT,
  icon_url TEXT,

  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- trigger updated_at
DROP TRIGGER IF EXISTS trg_about_tags_updated_at
ON public.about_tags;

CREATE TRIGGER trg_about_tags_updated_at
BEFORE UPDATE ON public.about_tags
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.about_tags ENABLE ROW LEVEL SECURITY;

-- xóa policy cũ nếu chạy lại
DROP POLICY IF EXISTS "Public can view active about tags"
ON public.about_tags;

DROP POLICY IF EXISTS "Authenticated can manage about tags"
ON public.about_tags;

-- public chỉ đọc tag active
CREATE POLICY "Public can view active about tags"
ON public.about_tags
FOR SELECT
USING (is_active = TRUE);

-- authenticated quản lý toàn bộ
CREATE POLICY "Authenticated can manage about tags"
ON public.about_tags
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- indexes
CREATE INDEX IF NOT EXISTS idx_about_tags_order
ON public.about_tags(order_index);

CREATE INDEX IF NOT EXISTS idx_about_tags_active
ON public.about_tags(is_active);

CREATE INDEX IF NOT EXISTS idx_about_tags_slug
ON public.about_tags(slug);


-- =========================================================
-- ABOUT CONTENT TAGS (pivot many-to-many)
-- =========================================================

CREATE TABLE IF NOT EXISTS public.about_content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  about_id UUID NOT NULL
    REFERENCES public.about_content(id)
    ON DELETE CASCADE,

  tag_id UUID NOT NULL
    REFERENCES public.about_tags(id)
    ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT uq_about_content_tags UNIQUE (about_id, tag_id)
);

-- RLS
ALTER TABLE public.about_content_tags ENABLE ROW LEVEL SECURITY;

-- xóa policy cũ nếu chạy lại
DROP POLICY IF EXISTS "Public can view about content tags of published about content"
ON public.about_content_tags;

DROP POLICY IF EXISTS "Authenticated can manage about content tags"
ON public.about_content_tags;

-- public chỉ đọc được tag assignment của about_content đã publish
CREATE POLICY "Public can view about content tags of published about content"
ON public.about_content_tags
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.about_content ac
    JOIN public.about_tags at
      ON at.id = about_content_tags.tag_id
    WHERE ac.id = about_content_tags.about_id
      AND ac.is_published = TRUE
      AND at.is_active = TRUE
  )
);

-- authenticated quản lý toàn bộ
CREATE POLICY "Authenticated can manage about content tags"
ON public.about_content_tags
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- indexes
CREATE INDEX IF NOT EXISTS idx_about_content_tags_about
ON public.about_content_tags(about_id);

CREATE INDEX IF NOT EXISTS idx_about_content_tags_tag
ON public.about_content_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_about_content_tags_about_tag
ON public.about_content_tags(about_id, tag_id);

INSERT INTO public.about_tags (
  slug,
  name_en,
  name_ja,
  description,
  icon_url,
  order_index,
  is_active
)
VALUES
(
  'branding',
  'Branding',
  'ブランディング',
  'Brand strategy and identity',
  NULL,
  1,
  TRUE
),
(
  'marketing',
  'Marketing',
  'マーケティング',
  'Marketing and campaign planning',
  NULL,
  2,
  TRUE
),
(
  'creative',
  'Creative',
  'クリエイティブ',
  'Creative direction and visual ideas',
  NULL,
  3,
  TRUE
)
ON CONFLICT (slug) DO NOTHING;


CREATE TABLE IF NOT EXISTS public.project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ja TEXT,
  name_vi TEXT,
  description TEXT,
  icon_url TEXT,

  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS public.project_tag_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  project_id UUID NOT NULL
    REFERENCES public.projects(id)
    ON DELETE CASCADE,

  tag_id UUID NOT NULL
    REFERENCES public.project_tags(id)
    ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT uq_project_tag UNIQUE (project_id, tag_id)
);



CREATE INDEX idx_project_tag_project
ON public.project_tag_relations(project_id);

CREATE INDEX idx_project_tag_tag
ON public.project_tag_relations(tag_id);

ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tag_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active project tags"
ON public.project_tags
FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Public can view project tag relations"
ON public.project_tag_relations
FOR SELECT
USING (TRUE);

CREATE POLICY "Authenticated can manage project tags"
ON public.project_tags
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

CREATE POLICY "Authenticated can manage project tag relations"
ON public.project_tag_relations
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);


-- =========================================================
-- MEDIA FOLDERS
-- Chỉ seed 1 folder mặc định: common
-- User có thể tự tạo thêm folder trong admin
-- =========================================================

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

DROP TRIGGER IF EXISTS trg_media_folders_updated_at
ON public.media_folders;

CREATE TRIGGER trg_media_folders_updated_at
BEFORE UPDATE ON public.media_folders
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active media folders"
ON public.media_folders;

DROP POLICY IF EXISTS "Authenticated can manage media folders"
ON public.media_folders;

CREATE POLICY "Public can view active media folders"
ON public.media_folders
FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Authenticated can manage media folders"
ON public.media_folders
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_media_folders_parent
ON public.media_folders(parent_id);

CREATE INDEX IF NOT EXISTS idx_media_folders_order
ON public.media_folders(order_index);

CREATE INDEX IF NOT EXISTS idx_media_folders_active
ON public.media_folders(is_active);

CREATE INDEX IF NOT EXISTS idx_media_folders_slug
ON public.media_folders(slug);


-- =========================================================
-- MEDIA ASSETS
-- Nếu không chọn folder thì sẽ gán vào folder common
-- =========================================================

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  folder_id UUID REFERENCES public.media_folders(id) ON DELETE SET NULL,

  file_name TEXT NOT NULL,
  original_file_name TEXT,
  file_extension TEXT,
  mime_type TEXT,

  asset_type TEXT NOT NULL DEFAULT 'image',
  -- image | icon | svg | video | other

  provider TEXT NOT NULL DEFAULT 'cloudinary',
  public_id TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  secure_url TEXT NOT NULL,

  width INTEGER,
  height INTEGER,
  file_size BIGINT,

  alt_text TEXT,
  title TEXT,
  caption TEXT,

  tags TEXT[] DEFAULT '{}',

  is_svg BOOLEAN DEFAULT FALSE,
  is_icon BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_media_assets_updated_at
ON public.media_assets;

CREATE TRIGGER trg_media_assets_updated_at
BEFORE UPDATE ON public.media_assets
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'media_assets_asset_type_check'
  ) THEN
    ALTER TABLE public.media_assets
    ADD CONSTRAINT media_assets_asset_type_check
    CHECK (asset_type IN ('image', 'icon', 'svg', 'video', 'other'));
  END IF;
END $$;

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active media assets"
ON public.media_assets;

DROP POLICY IF EXISTS "Authenticated can manage media assets"
ON public.media_assets;

CREATE POLICY "Public can view active media assets"
ON public.media_assets
FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Authenticated can manage media assets"
ON public.media_assets
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_media_assets_folder
ON public.media_assets(folder_id);

CREATE INDEX IF NOT EXISTS idx_media_assets_type
ON public.media_assets(asset_type);

CREATE INDEX IF NOT EXISTS idx_media_assets_active
ON public.media_assets(is_active);

CREATE INDEX IF NOT EXISTS idx_media_assets_created_at
ON public.media_assets(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_media_assets_public_id
ON public.media_assets(public_id);

CREATE INDEX IF NOT EXISTS idx_media_assets_is_svg
ON public.media_assets(is_svg);

CREATE INDEX IF NOT EXISTS idx_media_assets_is_icon
ON public.media_assets(is_icon);


-- =========================================================
-- VIEW HELPER
-- =========================================================

CREATE OR REPLACE VIEW public.media_assets_with_folder AS
SELECT
  ma.id,
  ma.folder_id,
  mf.name AS folder_name,
  mf.slug AS folder_slug,
  ma.file_name,
  ma.original_file_name,
  ma.file_extension,
  ma.mime_type,
  ma.asset_type,
  ma.provider,
  ma.public_id,
  ma.url,
  ma.secure_url,
  ma.width,
  ma.height,
  ma.file_size,
  ma.alt_text,
  ma.title,
  ma.caption,
  ma.tags,
  ma.is_svg,
  ma.is_icon,
  ma.is_active,
  ma.created_at,
  ma.updated_at
FROM public.media_assets ma
LEFT JOIN public.media_folders mf
  ON mf.id = ma.folder_id;


-- =========================================================
-- SEED 1 FOLDER MẶC ĐỊNH
-- =========================================================

INSERT INTO public.media_folders (
  name,
  slug,
  parent_id,
  description,
  order_index,
  is_active,
  is_system
)
VALUES (
  'Common',
  'common',
  NULL,
  'Default folder for uploaded media assets',
  0,
  TRUE,
  TRUE
)
ON CONFLICT (slug) DO NOTHING;

drop policy if exists "Public can read portfolio visit events" on public.portfolio_visit_events;

create policy "Public can read portfolio visit events"
on public.portfolio_visit_events
for select
to anon, authenticated
using (true);


-- =========================================================
-- BỔ SUNG CỘT TIẾNG VIỆT CHO HỆ THỐNG PORTFOLIO
-- =========================================================

-- Script completed. Trilingual support fully integrated into base schema.

-- =========================================================
-- MIGRATION: THEME SYSTEM & ADVANCED SETTINGS
-- Added: 2026-04-13
-- =========================================================

-- 1. Available Themes Registry
CREATE TABLE IF NOT EXISTS public.themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for themes table
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view active themes') THEN
        CREATE POLICY "Public can view active themes" ON public.themes FOR SELECT USING (is_active = TRUE);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated can manage themes') THEN
        CREATE POLICY "Authenticated can manage themes" ON public.themes FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
    END IF;
END $$;

-- 2. Register Default Themes
INSERT INTO public.themes (id, name, description)
VALUES 
('radiant', 'Radiant Growth', 'Modern layout with vibrant colors and glassmorphism.'),
('minimal', 'Minimalist', 'Clean, minimal layout focused on typography and white space.'),
('editorial', 'Editorial', 'High-end magazine style using serif typography.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 3. Upgrade site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS active_theme_id TEXT REFERENCES public.themes(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT FALSE;

-- 4. Set default theme for existing config
UPDATE public.site_settings 
SET active_theme_id = 'radiant' 
WHERE id = 1 AND (active_theme_id IS NULL OR active_theme_id = '');



-- =========================================================
-- BLOG CATEGORIES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  name_ja TEXT,
  name_vi TEXT,

  description TEXT,

  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_blog_categories_updated_at
ON public.blog_categories;

CREATE TRIGGER trg_blog_categories_updated_at
BEFORE UPDATE ON public.blog_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active blog categories"
ON public.blog_categories;

DROP POLICY IF EXISTS "Authenticated can manage blog categories"
ON public.blog_categories;

CREATE POLICY "Public can view active blog categories"
ON public.blog_categories
FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Authenticated can manage blog categories"
ON public.blog_categories
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_blog_categories_order
ON public.blog_categories(order_index);

CREATE INDEX IF NOT EXISTS idx_blog_categories_active
ON public.blog_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug
ON public.blog_categories(slug);


-- =========================================================
-- BLOG TAGS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  name_ja TEXT,
  name_vi TEXT,

  description TEXT,

  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_blog_tags_updated_at
ON public.blog_tags;

CREATE TRIGGER trg_blog_tags_updated_at
BEFORE UPDATE ON public.blog_tags
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active blog tags"
ON public.blog_tags;

DROP POLICY IF EXISTS "Authenticated can manage blog tags"
ON public.blog_tags;

CREATE POLICY "Public can view active blog tags"
ON public.blog_tags
FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Authenticated can manage blog tags"
ON public.blog_tags
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_blog_tags_order
ON public.blog_tags(order_index);

CREATE INDEX IF NOT EXISTS idx_blog_tags_active
ON public.blog_tags(is_active);

CREATE INDEX IF NOT EXISTS idx_blog_tags_slug
ON public.blog_tags(slug);


-- =========================================================
-- BLOG POSTS
-- draft / published / scheduled / archived
-- =========================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  slug TEXT NOT NULL UNIQUE,

  category_id UUID
    REFERENCES public.blog_categories(id)
    ON DELETE SET NULL,

  title_en TEXT NOT NULL,
  title_ja TEXT,
  title_vi TEXT,

  excerpt_en TEXT,
  excerpt_ja TEXT,
  excerpt_vi TEXT,

  content_en TEXT,
  content_ja TEXT,
  content_vi TEXT,

  cover_image_url TEXT,

  status TEXT NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,

  reading_time INTEGER DEFAULT 0,

  seo_title_en TEXT,
  seo_title_ja TEXT,
  seo_title_vi TEXT,

  seo_description_en TEXT,
  seo_description_ja TEXT,
  seo_description_vi TEXT,

  og_image_url TEXT,
  canonical_url TEXT,

  noindex BOOLEAN DEFAULT FALSE,

  order_index INTEGER DEFAULT 0,

  published_at TIMESTAMPTZ,
  last_draft_saved_at TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT blog_posts_status_check
  CHECK (status IN ('draft', 'published', 'scheduled', 'archived'))
);

DROP TRIGGER IF EXISTS trg_blog_posts_updated_at
ON public.blog_posts;

CREATE TRIGGER trg_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published blog posts"
ON public.blog_posts;

DROP POLICY IF EXISTS "Authenticated can manage blog posts"
ON public.blog_posts;

CREATE POLICY "Public can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (
  status = 'published'
  AND (
    published_at IS NULL
    OR published_at <= NOW()
  )
);

CREATE POLICY "Authenticated can manage blog posts"
ON public.blog_posts
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug
ON public.blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category
ON public.blog_posts(category_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status
ON public.blog_posts(status);

CREATE INDEX IF NOT EXISTS idx_blog_posts_featured
ON public.blog_posts(is_featured);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
ON public.blog_posts(published_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_order
ON public.blog_posts(order_index);

CREATE INDEX IF NOT EXISTS idx_blog_posts_noindex
ON public.blog_posts(noindex);


-- =========================================================
-- BLOG POST TAG RELATIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  post_id UUID NOT NULL
    REFERENCES public.blog_posts(id)
    ON DELETE CASCADE,

  tag_id UUID NOT NULL
    REFERENCES public.blog_tags(id)
    ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT uq_blog_post_tag UNIQUE (post_id, tag_id)
);

ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view blog post tags"
ON public.blog_post_tags;

DROP POLICY IF EXISTS "Authenticated can manage blog post tags"
ON public.blog_post_tags;

CREATE POLICY "Public can view blog post tags"
ON public.blog_post_tags
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.blog_posts bp
    JOIN public.blog_tags bt
      ON bt.id = blog_post_tags.tag_id
    WHERE bp.id = blog_post_tags.post_id
      AND bp.status = 'published'
      AND (bp.published_at IS NULL OR bp.published_at <= NOW())
      AND bt.is_active = TRUE
  )
);

CREATE POLICY "Authenticated can manage blog post tags"
ON public.blog_post_tags
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post
ON public.blog_post_tags(post_id);

CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag
ON public.blog_post_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_tag
ON public.blog_post_tags(post_id, tag_id);


-- =========================================================
-- OPTIONAL SEED
-- =========================================================
INSERT INTO public.blog_categories (
  slug, name_en, name_ja, name_vi, description, order_index, is_active
)
VALUES
('seo', 'SEO', 'SEO', 'SEO', 'Search engine optimization articles', 1, TRUE),
('marketing', 'Marketing', 'マーケティング', 'Marketing', 'Marketing articles and ideas', 2, TRUE),
('case-study', 'Case Study', '事例紹介', 'Case Study', 'Selected project and campaign breakdowns', 3, TRUE),
('insight', 'Insight', 'インサイト', 'Góc nhìn', 'Short professional thoughts and insights', 4, TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_tags (
  slug, name_en, name_ja, name_vi, description, order_index, is_active
)
VALUES
('seo-audit', 'SEO Audit', 'SEO監査', 'SEO Audit', NULL, 1, TRUE),
('content-strategy', 'Content Strategy', 'コンテンツ戦略', 'Chiến lược nội dung', NULL, 2, TRUE),
('branding', 'Branding', 'ブランディング', 'Branding', NULL, 3, TRUE),
('portfolio', 'Portfolio', 'ポートフォリオ', 'Portfolio', NULL, 4, TRUE),
('supabase', 'Supabase', 'Supabase', 'Supabase', NULL, 5, TRUE)
ON CONFLICT (slug) DO NOTHING;



ALTER TYPE public.section_type_enum ADD VALUE IF NOT EXISTS 'blog';
ALTER TYPE public.section_data_source_enum ADD VALUE IF NOT EXISTS 'blog_posts';
ALTER TYPE public.section_data_source_enum ADD VALUE IF NOT EXISTS 'blog_categories';


INSERT INTO public.page_sections (
  section_key, 
  section_name, 
  section_type, 
  page_type, 
  order_index,
  is_published, 
  is_visible, 
  is_fixed, 
  data_source, 
  description, 
  icon_name
) VALUES (
  'home_blogs', 
  'Blog Section', 
  'blog'::public.section_type_enum, 
  'home'::public.page_type_enum, 
  8,
  true, 
  true, 
  false, 
  'blog_posts'::public.section_data_source_enum, 
  'Hiển thị các bài viết mới nhất và kiến thức chuyên môn', 
  'book-open'
) ON CONFLICT (section_key, page_type) DO NOTHING;
