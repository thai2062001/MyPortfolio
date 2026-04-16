-- =========================================================
-- Step 02: Core Infrastructure (Personal Info, Settings, Fonts)
-- =========================================================

-- 1. Personal Info (Single Row)
CREATE TABLE IF NOT EXISTS public.personal_info (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  full_name TEXT,
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_personal_info_updated_at') THEN
    CREATE TRIGGER trg_personal_info_updated_at BEFORE UPDATE ON public.personal_info
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 2. Site Settings
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_site_settings_updated_at') THEN
    CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 3. Site Meta (SEO)
CREATE TABLE IF NOT EXISTS public.site_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  meta_title_en TEXT,
  meta_description_en TEXT,
  meta_title_ja TEXT,
  meta_description_ja TEXT,
  meta_title_vi TEXT,
  meta_description_vi TEXT,
  og_image_url TEXT,
  favicon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_site_meta_updated_at') THEN
    CREATE TRIGGER trg_site_meta_updated_at BEFORE UPDATE ON public.site_meta
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 4. Fonts Management
CREATE TABLE IF NOT EXISTS public.fonts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  family TEXT NOT NULL,
  import_url TEXT,
  import_css TEXT,
  fallback TEXT DEFAULT 'sans-serif',
  is_active BOOLEAN DEFAULT TRUE,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_fonts_updated_at') THEN
    CREATE TRIGGER trg_fonts_updated_at BEFORE UPDATE ON public.fonts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 5. Navigation & Social
CREATE TABLE IF NOT EXISTS public.navbar_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_en TEXT NOT NULL,
  label_ja TEXT,
  label_vi TEXT,
  href TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for Nav and Social
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_navbar_items_updated_at') THEN
    CREATE TRIGGER trg_navbar_items_updated_at BEFORE UPDATE ON public.navbar_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_social_links_updated_at') THEN
    CREATE TRIGGER trg_social_links_updated_at BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;
