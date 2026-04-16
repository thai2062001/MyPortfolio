-- Check if page_sections table exists and has data
SELECT 'Table exists' as status, COUNT(*) as total_sections
FROM public.page_sections;

-- Check sections by page type
SELECT 
  page_type,
  COUNT(*) as count,
  STRING_AGG(section_name, ', ') as sections
FROM public.page_sections
GROUP BY page_type;

-- Check all sections with details
SELECT 
  id,
  section_key,
  section_name,
  page_type,
  order_index,
  is_fixed,
  is_visible,
  is_published
FROM public.page_sections
ORDER BY page_type, order_index;

-- Check if RPC functions exist
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%section%'
ORDER BY routine_name;

-- Check RLS policies
SELECT 
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'page_sections'
ORDER BY policyname;



