-- =========================================================
-- Timeline Phases Table
-- Quản lý các giai đoạn trong dòng thời gian
-- =========================================================

create table if not exists public.timeline_phases (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  location text not null,
  title text not null,
  company text,
  description text not null,
  image_url text not null,
  tag text,
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_timeline_phases_updated_at on public.timeline_phases;
create trigger trg_timeline_phases_updated_at
before update on public.timeline_phases
for each row
execute function public.set_updated_at();

alter table public.timeline_phases enable row level security;

drop policy if exists "Public can view published timeline phases" on public.timeline_phases;
create policy "Public can view published timeline phases"
on public.timeline_phases
for select
using (is_published = true);

drop policy if exists "Authenticated can manage timeline phases" on public.timeline_phases;
create policy "Authenticated can manage timeline phases"
on public.timeline_phases
for all
to authenticated
using (true)
with check (true);

create index if not exists idx_timeline_phases_order on public.timeline_phases(order_index);

-- =========================================================
-- Insert sample timeline phases
-- =========================================================

INSERT INTO public.timeline_phases (
  period,
  location,
  title,
  company,
  description,
  image_url,
  tag,
  order_index,
  is_published
) VALUES
  (
    '2010 — 2014',
    'Osaka, Nhật Bản',
    'Những năm tháng du học',
    'Osaka University',
    'Rời Việt Nam năm 22 tuổi với một vali hành lý và vô vàn hy vọng. Osaka mùa xuân, hoa anh đào nở dọc con đường đến trường — đó là ký ức không bao giờ phai.',
    'https://via.placeholder.com/600x450?text=Project+1',
    'Du học',
    0,
    true
  ),
  (
    '2014 — 2018',
    'Tokyo, Nhật Bản',
    'Bước vào thị trường Nhật',
    'Rakuten, Inc.',
    'Bốn năm làm việc trong môi trường kỷ luật, chuyên nghiệp bậc nhất thế giới. Từ intern đến senior — mỗi ngày là một bài học về sự tỉ mỉ và tinh thần trách nhiệm.',
    'https://via.placeholder.com/600x450?text=Project+2',
    'Sự nghiệp',
    1,
    true
  ),
  (
    '2018 — 2022',
    'Hà Nội, Việt Nam',
    'Trở về quê hương',
    'FPT Software',
    'Mang theo những gì học được tại Nhật, tôi trở về xây dựng một cái gì đó có ý nghĩa hơn. Gặp gỡ đồng đội cũ, xây dựng đội ngũ mới — Hà Nội mùa thu thật khác.',
    'https://via.placeholder.com/600x450?text=Project+3',
    'Về nước',
    2,
    true
  ),
  (
    '2022 — Nay',
    'TP. Hồ Chí Minh',
    'Khởi nghiệp & Tự do',
    'Freelance & Consulting',
    'Chuyển vào Sài Gòn, thành lập studio nhỏ. Cuộc sống chậm lại, nhưng ý nghĩa hơn. Mỗi sáng cà phê nhìn ra ban công — đây mới là nơi tôi muốn gắn bó.',
    'https://via.placeholder.com/600x450?text=Project+4',
    'Hiện tại',
    3,
    true
  )
ON CONFLICT DO NOTHING;
