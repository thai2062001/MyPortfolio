-- =========================================================
-- Seed default social links
-- Chạy file này SAU khi đã chạy CREATE_SOCIAL_LINKS_TABLE.sql
-- =========================================================

insert into public.social_links (
  platform_name,
  display_name,
  url,
  order_index,
  is_published
)
values
  ('linkedin', 'LinkedIn', '', 0, true),
  ('twitter', 'Twitter', '', 1, true),
  ('facebook', 'Facebook', '', 2, true),
  ('github', 'GitHub', '', 3, true),
  ('email', 'Email', '', 4, true)
on conflict (platform_name) do nothing;
