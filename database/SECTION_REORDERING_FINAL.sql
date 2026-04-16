-- =========================================
-- SECTION REORDERING FEATURE - FINAL SQL
-- For Supabase SQL Editor (Safe Version)
-- =========================================

-- =========================================
-- 1. CREATE ENUMS (Safe way)
-- =========================================

do $$ begin
  create type public.section_type_enum as enum (
    'hero',
    'about',
    'metrics',
    'services',
    'skills',
    'testimonials',
    'contact',
    'timeline',
    'portfolio_grid',
    'project_categories',
    'featured_projects',
    'clients',
    'case_studies'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.page_type_enum as enum ('home', 'portfolio');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.section_data_source_enum as enum (
    'hero_sections',
    'about_content',
    'metrics',
    'skills',
    'testimonials',
    'work_experiences',
    'timeline_phases',
    'projects',
    'project_categories',
    'clients',
    'expertise_sections',
    'expertise_strategic_skills',
    'expertise_tool_items',
    'contact_messages',
    'custom'
  );
exception when duplicate_object then null;
end $$;

-- =========================================
-- 2. CREATE HELPER FUNCTION: set_updated_at()
-- =========================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================
-- 3. CREATE TABLE page_sections
-- =========================================

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  
  -- Basic info
  section_key text not null,
  section_name text not null,
  section_type public.section_type_enum not null,
  
  -- Position
  page_type public.page_type_enum not null,
  order_index integer not null default 0,
  
  -- Status
  is_published boolean not null default true,
  is_visible boolean not null default true,
  is_fixed boolean not null default false,
  
  -- Data mapping
  data_source public.section_data_source_enum not null default 'custom',
  source_table text,
  
  -- Metadata
  description text,
  icon_name text,
  
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Constraints
  constraint unique_section_per_page unique (section_key, page_type),
  constraint unique_order_per_page unique (page_type, order_index),
  constraint valid_order_index check (order_index >= 0),
  constraint valid_source_table check (
    (data_source = 'custom' and source_table is not null) or
    (data_source != 'custom' and source_table is null)
  )
);

-- =========================================
-- 4. CREATE INDEXES
-- =========================================

create index if not exists idx_page_sections_page_order 
  on public.page_sections(page_type, order_index);

create index if not exists idx_page_sections_key 
  on public.page_sections(section_key);

create index if not exists idx_page_sections_published 
  on public.page_sections(is_published, is_visible);

create index if not exists idx_page_sections_data_source 
  on public.page_sections(data_source);

-- =========================================
-- 5. ENABLE RLS
-- =========================================

alter table public.page_sections enable row level security;

-- =========================================
-- 6. CREATE TRIGGER for updated_at
-- =========================================

drop trigger if exists trg_page_sections_updated_at on public.page_sections;
create trigger trg_page_sections_updated_at
before update on public.page_sections
for each row
execute function public.set_updated_at();

-- =========================================
-- 7. RLS POLICIES
-- =========================================

-- Policy 1: Public select (published + visible only)
drop policy if exists "Public can view published sections" on public.page_sections;
create policy "Public can view published sections"
on public.page_sections
for select
using (is_published = true and is_visible = true);

-- Policy 2: Admin select all
drop policy if exists "Admin can select all sections" on public.page_sections;
create policy "Admin can select all sections"
on public.page_sections
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- Policy 3: Admin insert
drop policy if exists "Admin can insert sections" on public.page_sections;
create policy "Admin can insert sections"
on public.page_sections
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- Policy 4: Admin update
drop policy if exists "Admin can update sections" on public.page_sections;
create policy "Admin can update sections"
on public.page_sections
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- Policy 5: Admin delete
drop policy if exists "Admin can delete sections" on public.page_sections;
create policy "Admin can delete sections"
on public.page_sections
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- =========================================
-- 8. HELPER FUNCTION: is_admin()
-- =========================================

drop function if exists public.is_admin();
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- =========================================
-- 9. RPC: reorder_page_sections()
-- =========================================

drop function if exists public.reorder_page_sections(public.page_type_enum, jsonb);
create or replace function public.reorder_page_sections(
  p_page_type public.page_type_enum,
  p_sections jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_section jsonb;
  v_section_id uuid;
  v_order_index integer;
  v_result jsonb := '[]'::jsonb;
  v_current_count integer;
  v_payload_count integer;
  v_lock_key bigint;
  v_is_sequential boolean;
begin
  -- VALIDATION
  
  if not public.is_admin() then
    raise exception 'Unauthorized: admin role required';
  end if;

  if p_page_type is null then
    raise exception 'Invalid input: page_type cannot be null';
  end if;

  if jsonb_typeof(p_sections) != 'array' then
    raise exception 'Invalid input: sections must be array';
  end if;

  if jsonb_array_length(p_sections) = 0 then
    raise exception 'Invalid input: sections array cannot be empty';
  end if;

  if (
    select count(*) 
    from jsonb_to_recordset(p_sections) as x(id uuid)
  ) != (
    select count(distinct (x->>'id')::uuid)
    from jsonb_array_elements(p_sections) x
  ) then
    raise exception 'Invalid input: duplicate section IDs in payload';
  end if;

  if (
    select count(*) 
    from jsonb_to_recordset(p_sections) as x(order_index integer)
  ) != (
    select count(distinct (x->>'order_index')::integer)
    from jsonb_array_elements(p_sections) x
  ) then
    raise exception 'Invalid input: duplicate order_index in payload';
  end if;

  -- Check if order_index is sequential (0, 1, 2, ...)
  with ordered as (
    select
      (x->>'order_index')::integer as order_index,
      row_number() over (order by (x->>'order_index')::integer) - 1 as expected_index
    from jsonb_array_elements(p_sections) x
  )
  select bool_and(order_index = expected_index) into v_is_sequential
  from ordered;

  if not v_is_sequential then
    raise exception 'Invalid input: order_index must be sequential starting from 0';
  end if;

  select count(*) into v_current_count
  from public.page_sections
  where page_type = p_page_type;

  v_payload_count := jsonb_array_length(p_sections);

  if v_current_count != v_payload_count then
    raise exception 'Invalid input: payload count (%) does not match current sections (%)',
      v_payload_count, v_current_count;
  end if;

  if exists (
    select 1 from jsonb_to_recordset(p_sections) as x(id uuid)
    where not exists (
      select 1 from public.page_sections ps
      where ps.id = x.id and ps.page_type = p_page_type
    )
  ) then
    raise exception 'Invalid: all sections must belong to page %', p_page_type;
  end if;

  -- Check if any fixed section changed position
  if exists (
    select 1
    from public.page_sections ps
    where ps.page_type = p_page_type
      and ps.is_fixed = true
      and ps.order_index != (
        select (x->>'order_index')::integer
        from jsonb_array_elements(p_sections) x
        where (x->>'id')::uuid = ps.id
      )
  ) then
    raise exception 'Invalid: cannot change position of fixed sections';
  end if;

  -- LOCK & UPDATE
  
  v_lock_key := case 
    when p_page_type = 'home' then 1001
    when p_page_type = 'portfolio' then 1002
    else 1000
  end;

  perform pg_advisory_xact_lock(v_lock_key);

  -- Phase 1: Move all to safe zone (offset by 10000)
  update public.page_sections
  set order_index = order_index + 10000
  where page_type = p_page_type;

  -- Phase 2: Apply final order from payload
  for v_section in select * from jsonb_array_elements(p_sections)
  loop
    v_section_id := (v_section->>'id')::uuid;
    v_order_index := (v_section->>'order_index')::integer;

    update public.page_sections
    set order_index = v_order_index
    where id = v_section_id and page_type = p_page_type;

    v_result := v_result || jsonb_build_object(
      'id', v_section_id,
      'order_index', v_order_index
    );
  end loop;

  return jsonb_build_object(
    'success', true,
    'message', 'Sections reordered successfully',
    'updated_sections', v_result
  );

exception when others then
  return jsonb_build_object(
    'success', false,
    'error', sqlerrm,
    'error_code', sqlstate
  );
end;
$$;

-- =========================================
-- 10. RPC: move_section_to_page()
-- =========================================

drop function if exists public.move_section_to_page(uuid, public.page_type_enum);
create or replace function public.move_section_to_page(
  p_section_id uuid,
  p_to_page_type public.page_type_enum
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_section record;
  v_from_page public.page_type_enum;
  v_new_order_index integer;
  v_lock_key_from bigint;
  v_lock_key_to bigint;
begin
  -- VALIDATION

  if not public.is_admin() then
    raise exception 'Unauthorized: admin role required';
  end if;

  if p_section_id is null or p_to_page_type is null then
    raise exception 'Invalid input: section_id and to_page_type required';
  end if;

  select * into v_section from public.page_sections
  where id = p_section_id;

  if v_section is null then
    raise exception 'Section not found';
  end if;

  if v_section.is_fixed then
    raise exception 'Cannot move fixed section to another page';
  end if;

  v_from_page := v_section.page_type;

  if v_from_page = p_to_page_type then
    raise exception 'Section already on target page';
  end if;

  -- LOCK & UPDATE

  v_lock_key_from := case 
    when v_from_page = 'home' then 1001
    when v_from_page = 'portfolio' then 1002
    else 1000
  end;

  v_lock_key_to := case 
    when p_to_page_type = 'home' then 1001
    when p_to_page_type = 'portfolio' then 1002
    else 1000
  end;

  -- Acquire locks in consistent order to avoid deadlock
  if v_lock_key_from < v_lock_key_to then
    perform pg_advisory_xact_lock(v_lock_key_from);
    perform pg_advisory_xact_lock(v_lock_key_to);
  else
    perform pg_advisory_xact_lock(v_lock_key_to);
    perform pg_advisory_xact_lock(v_lock_key_from);
  end if;

  -- Get max order on target page
  select coalesce(max(order_index), -1) + 1 into v_new_order_index
  from public.page_sections
  where page_type = p_to_page_type;

  -- Move section to target page
  update public.page_sections
  set 
    page_type = p_to_page_type,
    order_index = v_new_order_index
  where id = p_section_id;

  -- Reindex source page (2-phase to avoid unique constraint conflict)
  -- Phase 1: Move all to safe zone
  update public.page_sections
  set order_index = order_index + 1000
  where page_type = v_from_page;

  -- Phase 2: Apply final order
  with reindexed as (
    select id, row_number() over (order by order_index) - 1 as new_order
    from public.page_sections
    where page_type = v_from_page
  )
  update public.page_sections ps
  set order_index = r.new_order
  from reindexed r
  where ps.id = r.id;

  return jsonb_build_object(
    'success', true,
    'message', format('Section moved from %s to %s', v_from_page, p_to_page_type),
    'section', jsonb_build_object(
      'id', v_section.id,
      'section_key', v_section.section_key,
      'page_type', p_to_page_type,
      'order_index', v_new_order_index
    )
  );

exception when others then
  return jsonb_build_object(
    'success', false,
    'error', sqlerrm,
    'error_code', sqlstate
  );
end;
$$;

-- =========================================
-- 11. RPC: toggle_section_visibility()
-- =========================================

drop function if exists public.toggle_section_visibility(uuid, boolean);
create or replace function public.toggle_section_visibility(
  p_section_id uuid,
  p_is_visible boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_section record;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized: admin role required';
  end if;

  if p_section_id is null then
    raise exception 'Invalid input: section_id required';
  end if;

  update public.page_sections
  set is_visible = p_is_visible
  where id = p_section_id
  returning * into v_section;

  if v_section is null then
    raise exception 'Section not found';
  end if;

  return jsonb_build_object(
    'success', true,
    'section', jsonb_build_object(
      'id', v_section.id,
      'section_key', v_section.section_key,
      'is_visible', v_section.is_visible
    )
  );

exception when others then
  return jsonb_build_object(
    'success', false,
    'error', sqlerrm
  );
end;
$$;

-- =========================================
-- 12. RPC: toggle_section_published()
-- =========================================

drop function if exists public.toggle_section_published(uuid, boolean);
create or replace function public.toggle_section_published(
  p_section_id uuid,
  p_is_published boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_section record;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized: admin role required';
  end if;

  if p_section_id is null then
    raise exception 'Invalid input: section_id required';
  end if;

  update public.page_sections
  set is_published = p_is_published
  where id = p_section_id
  returning * into v_section;

  if v_section is null then
    raise exception 'Section not found';
  end if;

  return jsonb_build_object(
    'success', true,
    'section', jsonb_build_object(
      'id', v_section.id,
      'section_key', v_section.section_key,
      'is_published', v_section.is_published
    )
  );

exception when others then
  return jsonb_build_object(
    'success', false,
    'error', sqlerrm
  );
end;
$$;

-- =========================================
-- 13. RPC: normalize_section_order()
-- =========================================

drop function if exists public.normalize_section_order(public.page_type_enum);
create or replace function public.normalize_section_order(
  p_page_type public.page_type_enum
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_lock_key bigint;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized: admin role required';
  end if;

  if p_page_type is null then
    raise exception 'Invalid input: page_type required';
  end if;

  v_lock_key := case 
    when p_page_type = 'home' then 1001
    when p_page_type = 'portfolio' then 1002
    else 1000
  end;

  perform pg_advisory_xact_lock(v_lock_key);

  -- Phase 1: Move all to safe zone (offset by 1000)
  update public.page_sections
  set order_index = order_index + 1000
  where page_type = p_page_type;

  -- Phase 2: Apply final order
  with reindexed as (
    select id, row_number() over (order by order_index) - 1 as new_order
    from public.page_sections
    where page_type = p_page_type
  )
  update public.page_sections ps
  set order_index = r.new_order
  from reindexed r
  where ps.id = r.id;

  select count(*) into v_count
  from public.page_sections
  where page_type = p_page_type;

  return jsonb_build_object(
    'success', true,
    'message', format('Normalized %s sections on page %s', v_count, p_page_type),
    'total_sections', v_count
  );

exception when others then
  return jsonb_build_object(
    'success', false,
    'error', sqlerrm
  );
end;
$$;

-- =========================================
-- 14. FUNCTION PERMISSIONS
-- =========================================

revoke all on function public.reorder_page_sections(public.page_type_enum, jsonb) from public;
revoke all on function public.move_section_to_page(uuid, public.page_type_enum) from public;
revoke all on function public.toggle_section_visibility(uuid, boolean) from public;
revoke all on function public.toggle_section_published(uuid, boolean) from public;
revoke all on function public.normalize_section_order(public.page_type_enum) from public;
revoke all on function public.is_admin() from public;

grant execute on function public.reorder_page_sections(public.page_type_enum, jsonb) to authenticated;
grant execute on function public.move_section_to_page(uuid, public.page_type_enum) to authenticated;
grant execute on function public.toggle_section_visibility(uuid, boolean) to authenticated;
grant execute on function public.toggle_section_published(uuid, boolean) to authenticated;
grant execute on function public.normalize_section_order(public.page_type_enum) to authenticated;
grant execute on function public.is_admin() to authenticated;

-- =========================================
-- 15. SEED DATA (Safe - Insert or Update)
-- =========================================

-- HOME PAGE sections
insert into public.page_sections (
  section_key, section_name, section_type, page_type, order_index,
  is_published, is_visible, is_fixed, data_source, source_table,
  description, icon_name
) values
('home_hero', 'Hero Section', 'hero'::public.section_type_enum, 'home'::public.page_type_enum, 0,
  true, true, true, 'hero_sections'::public.section_data_source_enum, null,
  'Main hero banner with introduction', 'zap'),

('home_about', 'About Section', 'about'::public.section_type_enum, 'home'::public.page_type_enum, 1,
  true, true, false, 'about_content'::public.section_data_source_enum, null,
  'About me and background', 'user'),

('home_metrics', 'Metrics Section', 'metrics'::public.section_type_enum, 'home'::public.page_type_enum, 2,
  true, true, false, 'metrics'::public.section_data_source_enum, null,
  'Key metrics and achievements', 'bar-chart-3'),

('home_services', 'Services Section', 'services'::public.section_type_enum, 'home'::public.page_type_enum, 3,
  true, true, false, 'custom'::public.section_data_source_enum, 'services_config',
  'Services offered', 'briefcase'),

('home_skills', 'Skills Section', 'skills'::public.section_type_enum, 'home'::public.page_type_enum, 4,
  true, true, false, 'expertise_sections'::public.section_data_source_enum, null,
  'Technical and strategic skills', 'code'),

('home_testimonials', 'Testimonials Section', 'testimonials'::public.section_type_enum, 'home'::public.page_type_enum, 5,
  true, true, false, 'testimonials'::public.section_data_source_enum, null,
  'Client testimonials', 'quote'),

('home_timeline', 'Timeline Section', 'timeline'::public.section_type_enum, 'home'::public.page_type_enum, 6,
  true, true, false, 'timeline_phases'::public.section_data_source_enum, null,
  'Career timeline and journey', 'calendar'),

('home_contact', 'Contact Section', 'contact'::public.section_type_enum, 'home'::public.page_type_enum, 7,
  true, true, false, 'contact_messages'::public.section_data_source_enum, null,
  'Contact form and information', 'mail')
on conflict (section_key, page_type) do update set
  section_name = excluded.section_name,
  section_type = excluded.section_type,
  is_published = excluded.is_published,
  is_visible = excluded.is_visible,
  is_fixed = excluded.is_fixed,
  data_source = excluded.data_source,
  source_table = excluded.source_table,
  description = excluded.description,
  icon_name = excluded.icon_name;

-- PORTFOLIO PAGE sections
insert into public.page_sections (
  section_key, section_name, section_type, page_type, order_index,
  is_published, is_visible, is_fixed, data_source, source_table,
  description, icon_name
) values
('portfolio_grid', 'Portfolio Grid', 'portfolio_grid'::public.section_type_enum, 'portfolio'::public.page_type_enum, 0,
  true, true, true, 'projects'::public.section_data_source_enum, null,
  'Main portfolio grid display', 'grid'),

('portfolio_categories', 'Project Categories', 'project_categories'::public.section_type_enum, 'portfolio'::public.page_type_enum, 1,
  true, true, false, 'project_categories'::public.section_data_source_enum, null,
  'Project category filters', 'folder'),

('portfolio_featured', 'Featured Projects', 'featured_projects'::public.section_type_enum, 'portfolio'::public.page_type_enum, 2,
  true, true, false, 'projects'::public.section_data_source_enum, null,
  'Highlighted featured projects', 'star'),

('portfolio_clients', 'Clients Section', 'clients'::public.section_type_enum, 'portfolio'::public.page_type_enum, 3,
  true, true, false, 'clients'::public.section_data_source_enum, null,
  'Client logos and information', 'users'),

('portfolio_case_studies', 'Case Studies', 'case_studies'::public.section_type_enum, 'portfolio'::public.page_type_enum, 4,
  true, true, false, 'projects'::public.section_data_source_enum, null,
  'Detailed case study sections', 'book')
on conflict (section_key, page_type) do update set
  section_name = excluded.section_name,
  section_type = excluded.section_type,
  is_published = excluded.is_published,
  is_visible = excluded.is_visible,
  is_fixed = excluded.is_fixed,
  data_source = excluded.data_source,
  source_table = excluded.source_table,
  description = excluded.description,
  icon_name = excluded.icon_name;

-- =========================================
-- END OF SECTION REORDERING SETUP
-- =========================================


-- =========================================
-- DEPLOYMENT CHECKLIST
-- =========================================

-- WHERE TO RUN:
-- 1. Go to Supabase Dashboard
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Create new query
-- 5. Copy & paste this entire file
-- 6. Click "Run"

-- BEFORE RUNNING:
-- ✓ Backup your database (optional but recommended)
-- ✓ Make sure you're in the correct project
-- ✓ This script is safe - uses insert ... on conflict do update
-- ✓ Existing data will NOT be deleted

-- AFTER RUNNING:
-- ✓ Check page_sections table exists
-- ✓ Verify sections created (13 total: 8 home + 5 portfolio)
-- ✓ Check all functions exist: reorder_page_sections, move_section_to_page, etc.

-- VERIFY SETUP:
-- Run these queries to verify:
-- select count(*) from public.page_sections; -- Should be 13
-- select * from public.page_sections where page_type = 'home' order by order_index; -- Should be 8
-- select * from public.page_sections where page_type = 'portfolio' order by order_index; -- Should be 5

-- FRONTEND UPDATES NEEDED:
-- 1. Update lib/supabase/queries/sections.ts
--    - Import types from lib/types/sections.ts
--    - Functions: getSectionsByPage, reorderSections, moveSection, etc.
--
-- 2. Update hooks/useSectionReorder.ts
--    - handleReorder: call reorderSections RPC
--    - handleMove: call moveSection RPC
--    - handleToggleVisibility: call toggleSectionVisibility RPC
--
-- 3. Update app/admin/sections/page.tsx
--    - Add handleMoveSection function (refetch both pages)
--    - Pass handleMoveSection to PageSectionsList
--
-- 4. Update app/admin/sections/components/PageSectionsList.tsx
--    - Add fixed section check in handleDragEnd
--    - Prevent drag if fixed section position changes
--
-- 5. Update app/admin/sections/components/SectionCard.tsx
--    - Hide drag handle if is_fixed = true
--    - Hide move button if is_fixed = true
--
-- 6. Update app/admin/sections/components/SortableItem.tsx
--    - Add disabled: section.is_fixed to useSortable
--    - Conditionally apply listeners based on is_fixed
