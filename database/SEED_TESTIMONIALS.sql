-- Insert Testimonials data into Supabase
INSERT INTO testimonials (name, role_en, role_ja, quote_en, quote_ja, portrait_url, order_index, is_published, created_at, updated_at) VALUES
(
  'Sophia Laurent',
  'Founder, Verdant Health',
  '創業者、Verdant Health',
  'Hai Yen''s ability to distill complex market data into actionable, creative strategies is unmatched. She elevated our entire brand presence.',
  'ハイ・イェンの複雑な市場データを実行可能でクリエイティブな戦略に落とし込む能力は比類がありません。ブランド全体のプレゼンスを向上させてくれました。',
  'https://res.cloudinary.com/dpdzbuiml/image/upload/v1728743877/testimonial-1.jpg',
  0,
  true,
  NOW(),
  NOW()
),
(
  'Marcus Chen',
  'Director of Operations, Riverview Studios',
  '運営ディレクター、Riverview Studios',
  'Working with Hai Yen was transformative. She brought clarity, energy, and measurable results to every initiative she touched.',
  'ハイ・イェンとの協業は変革的でした。彼女が携わるすべてのイニシアチブに明確さ、エネルギー、そして測定可能な成果をもたらしてくれました。',
  'https://res.cloudinary.com/dpdzbuiml/image/upload/v1728743877/testimonial-2.jpg',
  1,
  true,
  NOW(),
  NOW()
),
(
  'Amara Okafor',
  'VP of Growth, Nextera Labs',
  'グロースVP、Nextera Labs',
  'Her strategic vision and hands-on leadership turned our stagnant digital channels into our primary growth engine within a single quarter.',
  '彼女の戦略的ビジョンと実践的なリーダーシップにより、停滞していたデジタルチャネルがわずか1四半期で主要な成長エンジンに変わりました。',
  'https://res.cloudinary.com/dpdzbuiml/image/upload/v1728743877/testimonial-3.jpg',
  2,
  true,
  NOW(),
  NOW()
);
