-- =========================================================
-- Step 04: Projects (Categories, Projects, Media, Results)
-- =========================================================

-- 1. Categories
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_project_categories_updated_at') THEN
    CREATE TRIGGER trg_project_categories_updated_at BEFORE UPDATE ON public.project_categories
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 2. Projects
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
  project_url TEXT,
  order_index INTEGER DEFAULT 0,
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_projects_updated_at') THEN
    CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 3. Project Media & Details
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

CREATE TABLE IF NOT EXISTS public.project_approaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  approach TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Triggers for Project Details
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_project_images_updated_at') THEN
    CREATE TRIGGER trg_project_images_updated_at BEFORE UPDATE ON public.project_images FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_project_approaches_updated_at') THEN
    CREATE TRIGGER trg_project_approaches_updated_at BEFORE UPDATE ON public.project_approaches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_project_results_updated_at') THEN
    CREATE TRIGGER trg_project_results_updated_at BEFORE UPDATE ON public.project_results FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_project_testimonials_updated_at') THEN
    CREATE TRIGGER trg_project_testimonials_updated_at BEFORE UPDATE ON public.project_testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 4. Section Settings for Projects
CREATE TABLE IF NOT EXISTS public.projects_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow_en TEXT DEFAULT 'PORTFOLIO',
  title_en TEXT DEFAULT 'Selected Works',
  eyebrow_ja TEXT,
  title_ja TEXT,
  eyebrow_vi TEXT,
  title_vi TEXT,
  view_all_label_en TEXT DEFAULT 'VIEW ALL WORKS',
  view_all_label_ja TEXT,
  view_all_label_vi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON public.project_images(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_project_results_project ON public.project_results(project_id, order_index);

-- Column Safety Check (If table existed before refactor)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'order_index') THEN
    ALTER TABLE public.projects ADD COLUMN order_index INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'project_url') THEN
    ALTER TABLE public.projects ADD COLUMN project_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'role') THEN
    ALTER TABLE public.projects ADD COLUMN role TEXT;
  END IF;
END $$;
