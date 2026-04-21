-- =========================================================
-- Step 09: Row Level Security (RLS) Policies
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fonts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navbar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise_strategic_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise_tool_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_approaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects_section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonial_section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats_section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_purpose_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_form_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_animation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_visit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_report_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Dynamic Policy Generation Helper Function
-- (Optional, but let's stick to standard SQL for clarity)

-- 1. Public Read Policies
DO $$ 
DECLARE 
  table_name_rec text;
BEGIN
  FOR table_name_rec IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name NOT IN ('contact_messages', 'activity_logs', 'portfolio_visit_events', 'daily_report_logs')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public can view %I" ON public.%I', table_name_rec, table_name_rec);
    EXECUTE format('CREATE POLICY "Public can view %I" ON public.%I FOR SELECT USING (true)', table_name_rec, table_name_rec);
  END LOOP;
END $$;

-- 2. Admin (Full) Policies
DO $$ 
DECLARE 
  table_name_rec text;
BEGIN
  FOR table_name_rec IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admins can manage %I" ON public.%I', table_name_rec, table_name_rec);
    EXECUTE format('CREATE POLICY "Admins can manage %I" ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', table_name_rec, table_name_rec);
  END LOOP;
END $$;

-- 3. Specialized Policies
-- Contact messages: Public can INSERT, only Admin can VIEW/DELETE
DROP POLICY IF EXISTS "Public can insert messages" ON public.contact_messages;
CREATE POLICY "Public can insert messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Portfolio visits: Public can record, view (for ID retrieval), and update stats
ALTER TABLE public.portfolio_visit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can record visits" ON public.portfolio_visit_events;
CREATE POLICY "Public can record visits" ON public.portfolio_visit_events FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view visits" ON public.portfolio_visit_events;
CREATE POLICY "Public can view visits" ON public.portfolio_visit_events FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can update visits" ON public.portfolio_visit_events;
CREATE POLICY "Public can update visits" ON public.portfolio_visit_events FOR UPDATE TO anon USING (true) WITH CHECK (true);
