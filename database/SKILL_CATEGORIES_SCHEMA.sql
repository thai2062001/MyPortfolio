-- =========================================================
-- Skill Categories Table
-- Quản lý các category của Skills
-- =========================================================

create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name_en text not null unique,
  name_ja text not null unique,
  slug text not null unique,
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_skill_categories_updated_at on public.skill_categories;
create trigger trg_skill_categories_updated_at
before update on public.skill_categories
for each row
execute function public.set_updated_at();

alter table public.skill_categories enable row level security;

drop policy if exists "Public can view published skill categories" on public.skill_categories;
create policy "Public can view published skill categories"
on public.skill_categories
for select
using (is_published = true);

drop policy if exists "Authenticated can manage skill categories" on public.skill_categories;
create policy "Authenticated can manage skill categories"
on public.skill_categories
for all
to authenticated
using (true)
with check (true);

create index if not exists idx_skill_categories_order on public.skill_categories(order_index);
create index if not exists idx_skill_categories_published on public.skill_categories(is_published);

-- =========================================================
-- Update Skills table to reference skill_categories
-- =========================================================

alter table public.skills 
add column if not exists category_id uuid references public.skill_categories(id) on delete set null;

-- Seed default categories
insert into public.skill_categories (name_en, name_ja, slug, order_index, is_published)
values
  ('Data Management', 'データ管理', 'data-management', 0, true),
  ('Automation Tools', '自動化ツール', 'automation-tools', 1, true),
  ('Languages', '言語', 'languages', 2, true)
on conflict (slug) do nothing;


