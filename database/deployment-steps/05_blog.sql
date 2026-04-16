-- =========================================================
-- Step 05: Blog (Categories, Posts, Settings)
-- =========================================================

-- 1. Blog Categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  name_ja TEXT,
  name_vi TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_blog_categories_updated_at') THEN
    CREATE TRIGGER trg_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 2. Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_ja TEXT,
  title_vi TEXT,
  content_en TEXT,
  content_ja TEXT,
  content_vi TEXT,
  excerpt_en TEXT,
  excerpt_ja TEXT,
  excerpt_vi TEXT,
  cover_image_url TEXT,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  reading_time_minutes INTEGER DEFAULT 5,
  tags TEXT[],
  seo_title_en TEXT,
  seo_description_en TEXT,
  seo_title_ja TEXT,
  seo_description_ja TEXT,
  seo_title_vi TEXT,
  seo_description_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_blog_posts_updated_at') THEN
    CREATE TRIGGER trg_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 3. Section Settings for Blog
CREATE TABLE IF NOT EXISTS public.blog_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow_en TEXT DEFAULT 'INSIGHTS',
  title_en TEXT DEFAULT 'Latest Articles',
  eyebrow_ja TEXT,
  title_ja TEXT,
  eyebrow_vi TEXT,
  title_vi TEXT,
  view_all_label_en TEXT DEFAULT 'READ MORE',
  view_all_label_ja TEXT,
  view_all_label_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.blog_posts USING GIN (tags);
