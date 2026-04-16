-- =========================================================
-- Social Links Management Table
-- Cho phép quản lý nhiều social links với icon upload
-- =========================================================

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform_name text not null unique,
  display_name text not null,
  url text not null,
  icon_url text,
  icon_storage_path text,
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_social_links_updated_at on public.social_links;
create trigger trg_social_links_updated_at
before update on public.social_links
for each row
execute function public.set_updated_at();

alter table public.social_links enable row level security;

drop policy if exists "Public can view published social links" on public.social_links;
create policy "Public can view published social links"
on public.social_links
for select
using (is_published = true);

drop policy if exists "Authenticated can manage social links" on public.social_links;
create policy "Authenticated can manage social links"
on public.social_links
for all
to authenticated
using (true)
with check (true);

create index if not exists idx_social_links_order on public.social_links(order_index);
create index if not exists idx_social_links_published on public.social_links(is_published);


