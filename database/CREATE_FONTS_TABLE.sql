-- =========================================================
-- Fonts Management Table
-- Quản lý các font được import vào hệ thống
-- =========================================================

create table if not exists public.fonts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  font_family text not null,
  import_url text not null,
  import_css text not null,
  fallback text not null default 'sans-serif',
  font_type text not null default 'sans', -- 'sans', 'serif', 'mono', 'display'
  weights text[] not null default ARRAY['400'], -- array of weights like ['300', '400', '700']
  is_active boolean not null default true,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_fonts_updated_at on public.fonts;
create trigger trg_fonts_updated_at
before update on public.fonts
for each row
execute function public.set_updated_at();

alter table public.fonts enable row level security;

drop policy if exists "Public can view active fonts" on public.fonts;
create policy "Public can view active fonts"
on public.fonts
for select
using (is_active = true);

drop policy if exists "Authenticated can manage fonts" on public.fonts;
create policy "Authenticated can manage fonts"
on public.fonts
for all
to authenticated
using (true)
with check (true);

create index if not exists idx_fonts_active on public.fonts(is_active);
create index if not exists idx_fonts_order on public.fonts(order_index);

-- =========================================================
-- Insert default fonts
-- =========================================================

INSERT INTO public.fonts (
  name,
  font_family,
  import_url,
  import_css,
  fallback,
  font_type,
  weights,
  is_active,
  order_index
)
VALUES
  (
    'Lato',
    'Lato',
    'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
    '@import url(''https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap'');',
    '-apple-system, sans-serif',
    'sans',
    ARRAY['300', '400', '700'],
    true,
    0
  ),
  (
    'Lora',
    'Lora',
    'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap',
    '@import url(''https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap'');',
    'Georgia, serif',
    'serif',
    ARRAY['400', '500', '600', '700'],
    true,
    1
  )
ON CONFLICT (name) DO UPDATE SET
  font_family = EXCLUDED.font_family,
  import_url = EXCLUDED.import_url,
  import_css = EXCLUDED.import_css,
  fallback = EXCLUDED.fallback,
  font_type = EXCLUDED.font_type,
  weights = EXCLUDED.weights,
  is_active = EXCLUDED.is_active,
  order_index = EXCLUDED.order_index,
  updated_at = now();

-- =========================================================
-- Update site_settings to reference fonts
-- =========================================================

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS body_font_id uuid references public.fonts(id) on delete set null,
ADD COLUMN IF NOT EXISTS heading_font_id uuid references public.fonts(id) on delete set null;

-- Set default fonts (Lato for body, Lora for headings)
UPDATE public.site_settings 
SET 
  body_font_id = (SELECT id FROM public.fonts WHERE name = 'Lato' LIMIT 1),
  heading_font_id = (SELECT id FROM public.fonts WHERE name = 'Lora' LIMIT 1)
WHERE id = 1;
