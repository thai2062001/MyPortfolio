-- =========================================================
-- Contact Messages: add purpose
-- =========================================================
ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS purpose TEXT;

-- =========================================================
-- Contact Purpose Options
-- dùng để quản lý dropdown purpose trong admin
-- =========================================================
CREATE TABLE IF NOT EXISTS public.contact_purpose_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  value TEXT NOT NULL UNIQUE,         -- ví dụ: work, freelance
  label_en TEXT NOT NULL,             -- ví dụ: Work / Hire Me
  label_ja TEXT,                      -- nếu có hỗ trợ tiếng Nhật
  description TEXT,

  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_contact_purpose_options_updated_at') THEN
        CREATE TRIGGER trg_contact_purpose_options_updated_at
        BEFORE UPDATE ON public.contact_purpose_options
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
END $$;

ALTER TABLE public.contact_purpose_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active contact purpose options" ON public.contact_purpose_options;
DROP POLICY IF EXISTS "Authenticated can manage contact purpose options" ON public.contact_purpose_options;

CREATE POLICY "Public can view active contact purpose options"
ON public.contact_purpose_options
FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Authenticated can manage contact purpose options"
ON public.contact_purpose_options
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_contact_purpose_options_order
ON public.contact_purpose_options(order_index);

-- seed data
INSERT INTO public.contact_purpose_options (value, label_en, label_ja, description, order_index, is_active)
VALUES
  ('work', 'Work / Hire Me', '仕事の相談', 'For hiring, business inquiries, or paid work', 1, TRUE),
  ('freelance', 'Freelance Project', 'フリーランス案件', 'For freelance collaboration requests', 2, TRUE),
  ('job_opportunity', 'Job Opportunity', '求人の提案', 'For job offers and recruiting opportunities', 3, TRUE),
  ('collaboration', 'Collaboration', 'コラボレーション', 'For partnerships or collaborations', 4, TRUE),
  ('question', 'General Question', '一般的な質問', 'For general inquiries or questions', 5, TRUE),
  ('other', 'Other', 'その他', 'Any other purpose', 6, TRUE)
ON CONFLICT (value) DO NOTHING;

-- =========================================================
-- Contact Section Config (single row)
-- dùng để cấu hình form contact
-- =========================================================
CREATE TABLE IF NOT EXISTS public.contact_form_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),

  is_purpose_enabled BOOLEAN DEFAULT TRUE,
  is_purpose_required BOOLEAN DEFAULT TRUE,
  purpose_placeholder_en TEXT DEFAULT 'Select a purpose',
  purpose_placeholder_ja TEXT DEFAULT '目的を選択してください',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_contact_form_settings_updated_at') THEN
        CREATE TRIGGER trg_contact_form_settings_updated_at
        BEFORE UPDATE ON public.contact_form_settings
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
END $$;

ALTER TABLE public.contact_form_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view contact form settings" ON public.contact_form_settings;
DROP POLICY IF EXISTS "Authenticated can manage contact form settings" ON public.contact_form_settings;

CREATE POLICY "Public can view contact form settings"
ON public.contact_form_settings
FOR SELECT
USING (TRUE);

CREATE POLICY "Authenticated can manage contact form settings"
ON public.contact_form_settings
FOR ALL TO authenticated
USING (TRUE)
WITH CHECK (TRUE);

INSERT INTO public.contact_form_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
