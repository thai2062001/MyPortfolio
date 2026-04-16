-- 1. Bảng project_tags
CREATE TABLE IF NOT EXISTS public.project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ja TEXT,
  description TEXT,
  icon_url TEXT,

  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trigger updated_at
DROP TRIGGER IF EXISTS trg_project_tags_updated_at ON public.project_tags;

CREATE TRIGGER trg_project_tags_updated_at
BEFORE UPDATE ON public.project_tags
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- 3. RLS cho project_tags
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active project tags" ON public.project_tags;
DROP POLICY IF EXISTS "Authenticated can manage project tags" ON public.project_tags;

CREATE POLICY "Public can view active project tags"
ON public.project_tags
FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Authenticated can manage project tags"
ON public.project_tags
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- 4. Index cho project_tags
CREATE INDEX IF NOT EXISTS idx_project_tags_order
ON public.project_tags(order_index);

CREATE INDEX IF NOT EXISTS idx_project_tags_active
ON public.project_tags(is_active);

CREATE INDEX IF NOT EXISTS idx_project_tags_slug
ON public.project_tags(slug);

-- 5. Bảng pivot project_tag_relations
CREATE TABLE IF NOT EXISTS public.project_tag_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  project_id UUID NOT NULL
    REFERENCES public.projects(id)
    ON DELETE CASCADE,

  tag_id UUID NOT NULL
    REFERENCES public.project_tags(id)
    ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT uq_project_tag UNIQUE (project_id, tag_id)
);

-- 6. RLS cho pivot
ALTER TABLE public.project_tag_relations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view project tag relations" ON public.project_tag_relations;
DROP POLICY IF EXISTS "Authenticated can manage project tag relations" ON public.project_tag_relations;

CREATE POLICY "Public can view project tag relations"
ON public.project_tag_relations
FOR SELECT
USING (TRUE);

CREATE POLICY "Authenticated can manage project tag relations"
ON public.project_tag_relations
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

-- 7. Index cho pivot
CREATE INDEX IF NOT EXISTS idx_project_tag_relations_project
ON public.project_tag_relations(project_id);

CREATE INDEX IF NOT EXISTS idx_project_tag_relations_tag
ON public.project_tag_relations(tag_id);

CREATE INDEX IF NOT EXISTS idx_project_tag_relations_project_tag
ON public.project_tag_relations(project_id, tag_id);

-- 8. Seed Sample Data
INSERT INTO public.project_tags (slug, name_en, name_ja, order_index, is_active)
VALUES 
('branding', 'Branding', 'ブランディング', 1, TRUE),
('marketing', 'Marketing', 'マーケティング', 2, TRUE),
('creative', 'Creative', 'クリエイティブ', 3, TRUE),
('ui-ux', 'UI/UX', 'UI/UXデザイン', 4, TRUE),
('strategy', 'Strategy', '戦略', 5, TRUE)
ON CONFLICT (slug) DO NOTHING;
