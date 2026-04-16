-- =========================================================
-- Timeline Section Settings
-- Quản lý tiêu đề và mô tả cho phần Timeline
-- =========================================================

-- Thêm table timeline_section_settings (single row)
CREATE TABLE IF NOT EXISTS public.timeline_section_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  
  -- English
  eyebrow_en TEXT DEFAULT 'JOURNEY',
  title_en TEXT NOT NULL DEFAULT 'Career Timeline',
  description_en TEXT,
  
  -- Japanese
  eyebrow_ja TEXT DEFAULT 'ジャーニー',
  title_ja TEXT NOT NULL DEFAULT 'キャリアタイムライン',
  description_ja TEXT,
  
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_timeline_section_settings_updated_at ON public.timeline_section_settings;
CREATE TRIGGER trg_timeline_section_settings_updated_at
BEFORE UPDATE ON public.timeline_section_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.timeline_section_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view timeline section settings" ON public.timeline_section_settings;
CREATE POLICY "Public can view timeline section settings"
ON public.timeline_section_settings
FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated can manage timeline section settings" ON public.timeline_section_settings;
CREATE POLICY "Authenticated can manage timeline section settings"
ON public.timeline_section_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert default values
INSERT INTO public.timeline_section_settings (
  id,
  eyebrow_en,
  title_en,
  description_en,
  eyebrow_ja,
  title_ja,
  description_ja,
  is_published
)
VALUES (
  1,
  'JOURNEY',
  'Career Timeline',
  'A comprehensive overview of my professional journey and key milestones.',
  'ジャーニー',
  'キャリアタイムライン',
  '私のキャリアの全体像と主要なマイルストーンの概要です。',
  true
)
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- Notes
-- =========================================================
-- eyebrow_en/ja: Nhỏ, uppercase (ví dụ: "JOURNEY", "ジャーニー")
-- title_en/ja: Tiêu đề lớn (ví dụ: "Career Timeline", "キャリアタイムライン")
-- description_en/ja: Mô tả ngắn dưới tiêu đề
-- is_published: Kiểm soát hiển thị section
