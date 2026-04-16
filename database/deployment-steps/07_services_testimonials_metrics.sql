-- =========================================================
-- Step 07: Services, Testimonials & Site Stats
-- =========================================================

-- 1. Services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL UNIQUE,
  title_ja TEXT,
  title_vi TEXT,
  description_en TEXT,
  description_ja TEXT,
  description_vi TEXT,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow_en TEXT DEFAULT 'SERVICES',
  title_en TEXT DEFAULT 'What I Do',
  eyebrow_ja TEXT,
  title_ja TEXT,
  eyebrow_vi TEXT,
  title_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_services_updated_at') THEN
    CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_services_section_settings_updated_at') THEN
    CREATE TRIGGER trg_services_section_settings_updated_at BEFORE UPDATE ON public.services_section_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 2. Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_en TEXT NOT NULL,
  quote_ja TEXT,
  quote_vi TEXT,
  author_name TEXT NOT NULL,
  author_title_en TEXT,
  author_title_ja TEXT,
  author_title_vi TEXT,
  author_avatar_url TEXT,
  author_company TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonial_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow_en TEXT DEFAULT 'TESTIMONIALS',
  title_en TEXT DEFAULT 'Client Feedback',
  eyebrow_ja TEXT,
  title_ja TEXT,
  eyebrow_vi TEXT,
  title_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_testimonials_updated_at') THEN
    CREATE TRIGGER trg_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_testimonial_section_settings_updated_at') THEN
    CREATE TRIGGER trg_testimonial_section_settings_updated_at BEFORE UPDATE ON public.testimonial_section_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 3. Site Stats (Counters)
CREATE TABLE IF NOT EXISTS public.site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL, -- e.g. "10K+"
  label_en TEXT NOT NULL UNIQUE,
  label_ja TEXT,
  label_vi TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_stats_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow_en TEXT DEFAULT 'IMPACT',
  title_en TEXT DEFAULT 'My Results',
  eyebrow_ja TEXT,
  title_ja TEXT,
  eyebrow_vi TEXT,
  title_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_site_stats_section_settings_updated_at') THEN
    CREATE TRIGGER trg_site_stats_section_settings_updated_at BEFORE UPDATE ON public.site_stats_section_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 4. General Metrics (Project specific or global)
CREATE TABLE IF NOT EXISTS public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_en TEXT NOT NULL,
  value TEXT NOT NULL,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
