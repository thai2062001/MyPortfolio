-- =========================================================
-- Step 03: Skills & Expertise (Categories, Items, Detailed Data)
-- =========================================================

-- 1. Skill Categories
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  name_ja TEXT,
  name_vi TEXT,
  description TEXT,
  icon_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_skill_categories_updated_at') THEN
    CREATE TRIGGER trg_skill_categories_updated_at BEFORE UPDATE ON public.skill_categories
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 2. Skills (The Main Table)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT, -- Legacy column
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE,
  skill_name TEXT NOT NULL,
  skill_name_ja TEXT,
  skill_name_vi TEXT,
  short_description TEXT,
  description TEXT,
  overview TEXT,
  application TEXT,
  use_cases TEXT,
  icon_url TEXT,
  cover_image_url TEXT,
  difficulty_level TEXT,
  experience_level TEXT,
  estimated_time TEXT,
  tool_stack TEXT[],
  key_points TEXT[],
  related_skill_ids UUID[],
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_skills_updated_at') THEN
    CREATE TRIGGER trg_skills_updated_at BEFORE UPDATE ON public.skills
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 3. Skill Detail Tables
CREATE TABLE IF NOT EXISTS public.skill_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skill_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.skill_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  step_title TEXT NOT NULL,
  step_description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for Skill Details
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_skill_highlights_updated_at') THEN
    CREATE TRIGGER trg_skill_highlights_updated_at BEFORE UPDATE ON public.skill_highlights FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_skill_applications_updated_at') THEN
    CREATE TRIGGER trg_skill_applications_updated_at BEFORE UPDATE ON public.skill_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_skill_tools_updated_at') THEN
    CREATE TRIGGER trg_skill_tools_updated_at BEFORE UPDATE ON public.skill_tools FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_skill_steps_updated_at') THEN
    CREATE TRIGGER trg_skill_steps_updated_at BEFORE UPDATE ON public.skill_steps FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 4. Expertise Section
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
  strategic_description TEXT,
  tools_title TEXT DEFAULT 'Technical Tools',
  tools_title_ja TEXT,
  tools_title_vi TEXT,
  tools_helper_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_expertise_sections_updated_at') THEN
    CREATE TRIGGER trg_expertise_sections_updated_at BEFORE UPDATE ON public.expertise_sections
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 5. Strategic Skills & Tool Items (Expertise Section grid items)
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_expertise_strategic_skills_updated_at') THEN
    CREATE TRIGGER trg_expertise_strategic_skills_updated_at BEFORE UPDATE ON public.expertise_strategic_skills FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_expertise_tool_items_updated_at') THEN
    CREATE TRIGGER trg_expertise_tool_items_updated_at BEFORE UPDATE ON public.expertise_tool_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;
