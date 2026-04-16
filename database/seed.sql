-- =========================================================
-- PORTFOLIO CMS - SEED DATA
-- Purpose: Standard initial data for new clients
-- =========================================================

-- 1. Initialize Site Settings
INSERT INTO public.site_settings (id, site_name, active_theme, default_language)
VALUES (1, 'My Portfolio', 'radiant', 'en')
ON CONFLICT (id) DO NOTHING;

-- 2. Initialize Media Folders
INSERT INTO public.media_folders (name, slug, is_system, order_index)
VALUES ('Common', 'common', TRUE, 0)
ON CONFLICT (slug) DO NOTHING;

-- 3. Initialize Home Page Sections
-- This defines the order and visibility of elements on the landing page
INSERT INTO public.page_sections (section_key, section_name, section_type, page_type, order_index, is_published, data_source, source_table, icon_name)
VALUES 
('hero', 'Hero Section', 'hero', 'home', 10, TRUE, 'custom', 'hero_sections', 'Layout'),
('projects', 'Selected Works', 'projects', 'home', 20, TRUE, 'table', 'projects', 'Briefcase'),
('expertise', 'Proficiencies', 'expertise', 'home', 30, TRUE, 'custom', 'expertise_sections', 'Zap'),
('experience', 'Professional Path', 'experience', 'home', 40, TRUE, 'table', 'timeline_phases', 'History'),
('testimonials', 'Voices', 'testimonials', 'home', 50, TRUE, 'table', 'testimonials', 'Quote'),
('clients', 'Past Partners', 'clients', 'home', 60, TRUE, 'table', 'clients', 'Users'),
('contact', 'Connect', 'contact', 'home', 70, TRUE, 'custom', 'contact_sections', 'Mail')
ON CONFLICT (page_type, section_key) DO NOTHING;

-- 4. Demo Data (Optional - Customer can delete)
-- Demo Category
INSERT INTO public.project_categories (slug, name, order_index)
VALUES ('digital-design', 'Digital Design', 1)
ON CONFLICT (slug) DO NOTHING;

-- Demo Project
INSERT INTO public.projects (
  slug, title, client, year, short_description, description, 
  is_published, is_featured, order_index
)
VALUES (
  'demo-project', 
  'Sample Project', 
  'Antigravity Client', 
  '2024', 
  'A brief overview of your amazing work.', 
  'Full detailed description of how you solved the client problem.',
  TRUE, TRUE, 0
)
ON CONFLICT (slug) DO NOTHING;

-- Demo Skill Category
INSERT INTO public.skill_categories (slug, name_en, order_index)
VALUES ('marketing-strategy', 'Marketing Strategy', 1)
ON CONFLICT (slug) DO NOTHING;

-- Demo Skill
INSERT INTO public.skills (skill_name, slug, short_description, order_index, is_published)
VALUES ('Content Optimization', 'content-optimization', 'Crafting stories that resonate.', 1, TRUE)
ON CONFLICT (slug) DO NOTHING;
