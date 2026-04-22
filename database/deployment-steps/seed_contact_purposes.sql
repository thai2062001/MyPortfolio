-- =========================================================
-- Patch: Seed Default Contact Purposes
-- =========================================================

INSERT INTO public.contact_purpose_options (value, label_en, label_ja, label_vi, order_index, is_active)
VALUES 
  ('project_inquiry', 'Project Inquiry', 'プロジェクトのご相談', 'Yêu cầu dự án', 0, TRUE),
  ('partnership', 'Partnership', 'パートナーシップ', 'Hợp tác', 1, TRUE),
  ('recruitment', 'Recruitment', '採用・お仕事の依頼', 'Tuyển dụng', 2, TRUE),
  ('other', 'Other', 'その他', 'Khác', 3, TRUE)
ON CONFLICT (value) DO UPDATE SET
  label_en = EXCLUDED.label_en,
  label_ja = EXCLUDED.label_ja,
  label_vi = EXCLUDED.label_vi,
  is_active = TRUE;
