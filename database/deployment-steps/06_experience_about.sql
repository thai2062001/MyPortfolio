-- =========================================================
-- Step 06: Experience, About & Timeline
-- =========================================================

-- 1. Experience
CREATE TABLE IF NOT EXISTS public.experience_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.experience_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES public.experience_items(id) ON DELETE CASCADE,
  content_en TEXT,
  content_ja TEXT,
  content_vi TEXT,
  key_achievements TEXT[],
  technologies_used TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_experience_items_updated_at') THEN
    CREATE TRIGGER trg_experience_items_updated_at BEFORE UPDATE ON public.experience_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_experience_details_updated_at') THEN
    CREATE TRIGGER trg_experience_details_updated_at BEFORE UPDATE ON public.experience_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 2. About Content & Tags
CREATE TABLE IF NOT EXISTS public.about_content (
  section_key TEXT PRIMARY KEY,
  title_en TEXT,
  content_en TEXT,
  title_ja TEXT,
  content_ja TEXT,
  title_vi TEXT,
  content_vi TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.about_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_en TEXT NOT NULL UNIQUE,
  label_ja TEXT,
  label_vi TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.about_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow_en TEXT DEFAULT 'STORY',
  eyebrow_ja TEXT,
  eyebrow_vi TEXT,
  title_en TEXT DEFAULT 'About Me',
  title_ja TEXT,
  title_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_about_content_updated_at') THEN
    CREATE TRIGGER trg_about_content_updated_at BEFORE UPDATE ON public.about_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_about_section_settings_updated_at') THEN
    CREATE TRIGGER trg_about_section_settings_updated_at BEFORE UPDATE ON public.about_section_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 3. Awards
CREATE TABLE IF NOT EXISTS public.awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT,
  title_en TEXT NOT NULL,
  title_ja TEXT,
  title_vi TEXT,
  organization TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Timeline
CREATE TABLE IF NOT EXISTS public.timeline_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_number TEXT,
  title_en TEXT NOT NULL,
  title_ja TEXT,
  title_vi TEXT,
  description_en TEXT,
  description_ja TEXT,
  description_vi TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.timeline_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow_en TEXT DEFAULT 'PROCESS',
  title_en TEXT DEFAULT 'My Journey',
  eyebrow_ja TEXT,
  title_ja TEXT,
  eyebrow_vi TEXT,
  title_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_timeline_phases_updated_at') THEN
    CREATE TRIGGER trg_timeline_phases_updated_at BEFORE UPDATE ON public.timeline_phases FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_timeline_section_settings_updated_at') THEN
    CREATE TRIGGER trg_timeline_section_settings_updated_at BEFORE UPDATE ON public.timeline_section_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;
