-- =========================================================
-- Fix: Frontend Schema Mismatch
-- =========================================================

-- 1. Update ENUMs
DO $$ 
BEGIN
    ALTER TYPE page_type_enum ADD VALUE IF NOT EXISTS 'portfolio';
    ALTER TYPE page_type_enum ADD VALUE IF NOT EXISTS 'blog';
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 1.1 Update page_sections (missing columns)
ALTER TABLE public.page_sections ADD COLUMN IF NOT EXISTS section_key TEXT;
ALTER TABLE public.page_sections ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;
ALTER TABLE public.page_sections ADD COLUMN IF NOT EXISTS is_fixed BOOLEAN DEFAULT FALSE;

-- Cập nhật dữ liệu mặc định cho section_key nếu bị null
UPDATE public.page_sections SET section_key = LOWER(REPLACE(section_name, ' ', '_')) WHERE section_key IS NULL;

-- 2. Update site_settings (missing columns)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'active_theme_id') THEN
        ALTER TABLE public.site_settings ADD COLUMN active_theme_id TEXT DEFAULT 'radiant';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'maintenance_mode') THEN
        ALTER TABLE public.site_settings ADD COLUMN maintenance_mode BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 3. Create hero_sections (Frontend expects this table)
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

-- 4. Update portfolio_visit_events (missing columns)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolio_visit_events' AND column_name = 'session_id') THEN
        ALTER TABLE public.portfolio_visit_events ADD COLUMN session_id TEXT;
        ALTER TABLE public.portfolio_visit_events ADD COLUMN page_key TEXT;
        ALTER TABLE public.portfolio_visit_events ADD COLUMN traffic_source TEXT;
        ALTER TABLE public.portfolio_visit_events ADD COLUMN device_type TEXT;
        ALTER TABLE public.portfolio_visit_events ADD COLUMN screen_width INTEGER;
        ALTER TABLE public.portfolio_visit_events ADD COLUMN screen_height INTEGER;
        ALTER TABLE public.portfolio_visit_events ADD COLUMN time_on_page_seconds INTEGER DEFAULT 0;
        ALTER TABLE public.portfolio_visit_events ADD COLUMN max_scroll_percent INTEGER DEFAULT 0;
    END IF;
END $$;

-- 5. Seed missing data
INSERT INTO public.hero_sections (id, is_published, badge, title_line_1_en, title_line_2_en, description_en, primary_button_label_en, primary_button_url)
VALUES (1, TRUE, 'SENIOR MARKETING EXECUTIVE', 'Pham Thi', 'Hai Yen.', 'Bright Strategies for Brand Acceleration.', 'VIEW WORK', '/projects')
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS and Policies for new columns/tables
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published hero section" ON public.hero_sections;
CREATE POLICY "Public can view published hero section" ON public.hero_sections FOR SELECT USING (is_published = TRUE);
DROP POLICY IF EXISTS "Admins can manage hero sections" ON public.hero_sections;
CREATE POLICY "Admins can manage hero sections" ON public.hero_sections FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. Sửa bảng Contact Messages (Đổi tên full_name -> name để khớp code Frontend)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_messages' AND column_name = 'full_name') THEN
        ALTER TABLE public.contact_messages RENAME COLUMN full_name TO name;
    END IF;
END $$;

-- 7. Khôi phục hệ thống Media Library (Bảng media_folders và media_assets)
CREATE TABLE IF NOT EXISTS public.media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.media_folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES public.media_folders(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  original_file_name TEXT,
  file_extension TEXT,
  mime_type TEXT,
  asset_type TEXT NOT NULL DEFAULT 'image',
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

-- 8. Phân quyền Media Library cho Admin và Public
ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view folders" ON public.media_folders;
CREATE POLICY "Public view folders" ON public.media_folders FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Admin manage folders" ON public.media_folders;
CREATE POLICY "Admin manage folders" ON public.media_folders FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public view assets" ON public.media_assets;
CREATE POLICY "Public view assets" ON public.media_assets FOR SELECT USING (is_active = TRUE);
DROP POLICY IF EXISTS "Admin manage assets" ON public.media_assets;
CREATE POLICY "Admin manage assets" ON public.media_assets FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 9. Tạo thư mục hệ thống mặc định
INSERT INTO public.media_folders (name, slug, description, is_system)
VALUES ('Chung', 'common', 'Thư mục chứa ảnh dùng chung', TRUE)
ON CONFLICT (slug) DO NOTHING;
