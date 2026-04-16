-- Verify sections are properly ordered in database
SELECT 
  id,
  section_key,
  section_name,
  page_type,
  order_index,
  is_visible,
  is_published
FROM public.page_sections
ORDER BY page_type, order_index;

-- Count sections by page
SELECT 
  page_type,
  COUNT(*) as total,
  SUM(CASE WHEN is_visible THEN 1 ELSE 0 END) as visible,
  SUM(CASE WHEN is_published THEN 1 ELSE 0 END) as published
FROM public.page_sections
GROUP BY page_type;
