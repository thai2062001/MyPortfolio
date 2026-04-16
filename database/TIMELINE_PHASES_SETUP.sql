drop table if exists public.timeline_phases cascade;

create table public.timeline_phases (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  location text not null,
  title_en text not null,
  title_ja text not null,
  company_en text,
  company_ja text,
  description_en text not null,
  description_ja text not null,
  image_url text not null,
  tag_en text,
  tag_ja text,
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

INSERT INTO public.timeline_phases (
  period,
  location,
  title_en,
  title_ja,
  company_en,
  company_ja,
  description_en,
  description_ja,
  image_url,
  tag_en,
  tag_ja,
  order_index,
  is_published
) VALUES
  (
    '2010 — 2014',
    'Osaka, Nhật Bản',
    'Study Abroad Years',
    '留学時代',
    'Osaka University',
    '大阪大学',
    'Left Vietnam at 22 with a suitcase and endless hopes. Osaka in spring, cherry blossoms blooming along the way to school — a memory that never fades.',
    'ベトナムを22歳で一つのスーツケースと無限の希望を持って出発しました。春の大阪、学校への道沿いに咲く桜 — 決して色褪せない思い出です。',
    'https://via.placeholder.com/600x450?text=Project+1',
    'Study Abroad',
    '留学',
    0,
    true
  ),
  (
    '2014 — 2018',
    'Tokyo, Nhật Bản',
    'Entering the Japanese Market',
    '日本市場への進出',
    'Rakuten, Inc.',
    '楽天株式会社',
    'Four years working in the most disciplined and professional environment in the world. From intern to senior — each day was a lesson in meticulousness and responsibility.',
    '世界で最も規律正しく、プロフェッショナルな環境で4年間働きました。インターンからシニアへ — 毎日が細心さと責任感についての教訓でした。',
    'https://via.placeholder.com/600x450?text=Project+2',
    'Career',
    'キャリア',
    1,
    true
  ),
  (
    '2018 — 2022',
    'Hà Nội, Việt Nam',
    'Returning Home',
    '帰国',
    'FPT Software',
    'FPTソフトウェア',
    'Bringing what I learned in Japan, I returned to build something more meaningful. Meeting old teammates, building new teams — Hanoi in autumn felt different.',
    '日本で学んだことを持ち帰り、より意味のあるものを構築するために戻ってきました。昔のチームメイトに会い、新しいチームを構築する — 秋の河内は違って感じました。',
    'https://via.placeholder.com/600x450?text=Project+3',
    'Homecoming',
    '帰郷',
    2,
    true
  ),
  (
    '2022 — Nay',
    'TP. Hồ Chí Minh',
    'Entrepreneurship & Freedom',
    '起業と自由',
    'Freelance & Consulting',
    'フリーランス・コンサルティング',
    'Moved to Saigon, established a small studio. Life slowed down, but became more meaningful. Every morning coffee overlooking the balcony — this is where I want to belong.',
    'サイゴンに移り、小さなスタジオを設立しました。人生は遅くなりましたが、より意味のあるものになりました。毎朝バルコニーを見下ろすコーヒー — ここが私が属したい場所です。',
    'https://via.placeholder.com/600x450?text=Project+4',
    'Present',
    '現在',
    3,
    true
  )
ON CONFLICT DO NOTHING;
