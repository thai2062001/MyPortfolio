-- Insert Approach & Philosophy section into about_content
INSERT INTO public.about_content (
  section_key, 
  title_en, 
  title_ja, 
  content_en, 
  content_ja, 
  image_url,
  order_index, 
  is_published
) VALUES (
  'approachPhilosophy',
  'My Approach & Philosophy',
  'アプローチと哲学',
  'I believe that the most powerful marketing sits at the intersection of empathy and evidence. By deeply understanding consumer behaviour and pairing it with bold creative execution, I help brands build lasting connections that drive sustainable growth.',
  '私は、最も強力なマーケティングは共感と証拠の交差点にあると信じています。消費者行動を深く理解し、大胆な創造的実行と組み合わせることで、持続可能な成長を促進する永続的なつながりを構築するのに役立ちます。',
  '',
  4,
  true
)
ON CONFLICT (section_key) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ja = EXCLUDED.title_ja,
  content_en = EXCLUDED.content_en,
  content_ja = EXCLUDED.content_ja,
  image_url = EXCLUDED.image_url,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = now();
