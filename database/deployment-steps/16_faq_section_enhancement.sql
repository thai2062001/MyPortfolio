-- =========================================================
-- Step 16: FAQ Section Enhancement & Management
-- =========================================================

-- 1. Create FAQ Section Settings Table
CREATE TABLE IF NOT EXISTS public.faq_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow_en TEXT DEFAULT 'FAQ',
  eyebrow_ja TEXT,
  eyebrow_vi TEXT,
  title_en TEXT DEFAULT 'Got Questions?',
  title_ja TEXT,
  title_vi TEXT,
  description_en TEXT DEFAULT 'Find answers to common questions about my services and workflow.',
  description_ja TEXT,
  description_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Toggle updated_at
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_faq_section_settings_updated_at') THEN
    CREATE TRIGGER trg_faq_section_settings_updated_at BEFORE UPDATE ON public.faq_section_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 2. Ensure page_sections has FAQ entries
INSERT INTO public.page_sections (section_key, section_type, section_name, page_type, order_index, is_published)
VALUES 
('home_faq', 'faq', 'FAQ Section', 'home', 10, TRUE),
('portfolio_faq', 'faq', 'FAQ Section', 'portfolio', 10, TRUE)
ON CONFLICT (section_key) DO UPDATE SET 
    section_type = EXCLUDED.section_type,
    section_name = EXCLUDED.section_name,
    is_published = TRUE;

-- 3. Seed initial settings
INSERT INTO public.faq_section_settings (id, eyebrow_en, title_en, description_en)
VALUES (1, 'FAQ', 'Got Questions?', 'Find answers to common questions about my services and workflow.')
ON CONFLICT (id) DO NOTHING;

-- 4. RLS for settings
ALTER TABLE public.faq_section_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view faq settings" ON public.faq_section_settings;
CREATE POLICY "Public can view faq settings" ON public.faq_section_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated can manage faq settings" ON public.faq_section_settings;
CREATE POLICY "Authenticated can manage faq settings" ON public.faq_section_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
