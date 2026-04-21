-- Update about_content with CTA labels and resume_url
ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS cta_primary_label_en TEXT DEFAULT 'View Projects';
ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS cta_primary_label_ja TEXT DEFAULT 'プロジェクトを見る';
ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS cta_primary_label_vi TEXT DEFAULT 'Xem dự án';

ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS cta_secondary_label_en TEXT DEFAULT 'Download CV';
ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS cta_secondary_label_ja TEXT DEFAULT 'CVをダウンロード';
ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS cta_secondary_label_vi TEXT DEFAULT 'Tải CV';

ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS resume_url TEXT;
