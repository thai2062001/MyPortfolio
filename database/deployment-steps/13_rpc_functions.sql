-- =========================================================
-- Step 13: RPC Functions for Admin Logic
-- =========================================================

-- 1. Hàm bật/tắt hiển thị Section
CREATE OR REPLACE FUNCTION public.toggle_section_visibility(
  p_section_id uuid,
  p_is_visible boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_section record;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  UPDATE public.page_sections
  SET is_visible = p_is_visible
  WHERE id = p_section_id
  RETURNING * INTO v_section;

  IF v_section IS NULL THEN
    RAISE EXCEPTION 'Section not found';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'section', jsonb_build_object(
      'id', v_section.id,
      'section_key', v_section.section_key,
      'is_visible', v_section.is_visible
    )
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', sqlerrm
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_section_visibility(uuid, boolean) TO authenticated;

-- 2. Hàm bật/tắt trạng thái Published
CREATE OR REPLACE FUNCTION public.toggle_section_published(
  p_section_id uuid,
  p_is_published boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_section record;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  UPDATE public.page_sections
  SET is_published = p_is_published
  WHERE id = p_section_id
  RETURNING * INTO v_section;

  IF v_section IS NULL THEN
    RAISE EXCEPTION 'Section not found';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'section', jsonb_build_object(
      'id', v_section.id,
      'section_key', v_section.section_key,
      'is_published', v_section.is_published
    )
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', sqlerrm
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_section_published(uuid, boolean) TO authenticated;

-- 3. Hàm sắp xếp thứ tự Section (Reorder)
CREATE OR REPLACE FUNCTION public.reorder_page_sections(
  p_page_type public.page_type_enum,
  p_sections jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_section jsonb;
  v_section_id uuid;
  v_order_index integer;
  v_result jsonb := '[]'::jsonb;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  FOR v_section IN SELECT * FROM jsonb_array_elements(p_sections)
  LOOP
    v_section_id := (v_section->>'id')::uuid;
    v_order_index := (v_section->>'order_index')::integer;

    UPDATE public.page_sections
    SET order_index = v_order_index
    WHERE id = v_section_id AND page_type = p_page_type;

    v_result := v_result || jsonb_build_object(
      'id', v_section_id,
      'order_index', v_order_index
    );
  END loop;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Sections reordered successfully',
    'updated_sections', v_result
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.reorder_page_sections(public.page_type_enum, jsonb) TO authenticated;

-- 4. Hàm di chuyển Section sang trang khác
CREATE OR REPLACE FUNCTION public.move_section_to_page(
  p_section_id uuid,
  p_to_page_type public.page_type_enum
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_section record;
  v_new_order_index integer;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT coalesce(max(order_index), -1) + 1 INTO v_new_order_index
  FROM public.page_sections
  WHERE page_type = p_to_page_type;

  UPDATE public.page_sections
  SET 
    page_type = p_to_page_type,
    order_index = v_new_order_index
  WHERE id = p_section_id
  RETURNING * INTO v_section;

  IF v_section IS NULL THEN
    RAISE EXCEPTION 'Section not found';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'section', jsonb_build_object(
      'id', v_section.id,
      'page_type', v_section.page_type,
      'order_index', v_section.order_index
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.move_section_to_page(uuid, public.page_type_enum) TO authenticated;

-- 5. Hàm chuẩn hóa thứ tự Section (Dọn dẹp khoảng trống index)
CREATE OR REPLACE FUNCTION public.normalize_section_order(
  p_page_type public.page_type_enum
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  WITH reindexed AS (
    SELECT id, row_number() OVER (ORDER BY order_index) - 1 AS new_order
    FROM public.page_sections
    WHERE page_type = p_page_type
  )
  UPDATE public.page_sections ps
  SET order_index = r.new_order
  FROM reindexed r
  WHERE ps.id = r.id;

  SELECT count(*) INTO v_count
  FROM public.page_sections
  WHERE page_type = p_page_type;

  RETURN jsonb_build_object(
    'success', true,
    'message', format('Normalized %s sections', v_count)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.normalize_section_order(public.page_type_enum) TO authenticated;
