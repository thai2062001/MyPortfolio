-- Seed Skill Categories
INSERT INTO public.skill_categories (slug, name_en, name_ja, order_index, is_published)
VALUES
  ('digital-marketing', 'Digital Marketing', 'デジタルマーケティング', 1, TRUE),
  ('brand-strategy', 'Brand Strategy', 'ブランド戦略', 2, TRUE),
  ('content-creation', 'Content Creation', 'コンテンツ作成', 3, TRUE),
  ('analytics', 'Analytics & Data', 'アナリティクス＆データ', 4, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for reference
WITH categories AS (
  SELECT id, slug FROM public.skill_categories WHERE slug IN ('digital-marketing', 'brand-strategy', 'content-creation', 'analytics')
)

-- Seed Skills
INSERT INTO public.skills (
  slug, category_id, skill_name, short_description, description, overview,
  application, use_cases, difficulty_level, experience_level, estimated_time,
  key_points, order_index, is_published
)
SELECT
  'seo-optimization', c.id, 'SEO Optimization', 'Master search engine optimization techniques',
  'Comprehensive guide to improving website visibility in search results',
  'SEO is the practice of optimizing your website to rank higher in search engine results. It involves both on-page and off-page strategies.',
  'Apply SEO best practices to increase organic traffic and improve search rankings',
  'E-commerce sites, blogs, corporate websites, SaaS platforms',
  'Intermediate', 'Beginner to Intermediate', '4-6 weeks',
  ARRAY['Keyword research and analysis', 'On-page optimization', 'Technical SEO', 'Link building', 'Content strategy'],
  1, TRUE
FROM categories c WHERE c.slug = 'digital-marketing'

UNION ALL

SELECT
  'social-media-strategy', c.id, 'Social Media Strategy', 'Develop effective social media campaigns',
  'Learn how to create and execute successful social media marketing strategies',
  'Social media strategy involves planning, creating, and managing content across social platforms to achieve business goals.',
  'Build engaged communities and drive conversions through strategic social media management',
  'B2B companies, e-commerce, personal brands, nonprofits',
  'Beginner', 'Beginner', '3-4 weeks',
  ARRAY['Platform selection', 'Content calendar planning', 'Community management', 'Analytics tracking', 'Paid advertising'],
  2, TRUE
FROM categories c WHERE c.slug = 'digital-marketing'

UNION ALL

SELECT
  'brand-positioning', c.id, 'Brand Positioning', 'Define your unique market position',
  'Master the art of positioning your brand in the competitive marketplace',
  'Brand positioning is about defining how your brand is perceived relative to competitors and what unique value you offer.',
  'Create a distinctive brand identity that resonates with your target audience',
  'Startups, product launches, rebranding initiatives, market expansion',
  'Intermediate', 'Intermediate', '6-8 weeks',
  ARRAY['Market research', 'Competitor analysis', 'Value proposition', 'Brand messaging', 'Visual identity'],
  1, TRUE
FROM categories c WHERE c.slug = 'brand-strategy'

UNION ALL

SELECT
  'copywriting', c.id, 'Copywriting', 'Write persuasive and engaging copy',
  'Learn the fundamentals of writing copy that converts and engages audiences',
  'Copywriting is the art of writing words that persuade people to take action, whether buying, signing up, or engaging.',
  'Create compelling marketing messages across all channels',
  'Landing pages, email campaigns, social media, advertisements, product descriptions',
  'Beginner', 'Beginner', '4-5 weeks',
  ARRAY['Headline writing', 'Call-to-action optimization', 'Storytelling', 'Audience psychology', 'A/B testing'],
  1, TRUE
FROM categories c WHERE c.slug = 'content-creation'

UNION ALL

SELECT
  'data-analytics', c.id, 'Data Analytics', 'Extract insights from business data',
  'Master the tools and techniques for analyzing business data and making data-driven decisions',
  'Data analytics involves collecting, processing, and analyzing data to uncover patterns and insights that drive business decisions.',
  'Use data to optimize marketing campaigns, improve customer experience, and increase ROI',
  'Marketing optimization, customer behavior analysis, sales forecasting, performance tracking',
  'Intermediate', 'Intermediate', '8-10 weeks',
  ARRAY['Data collection', 'Statistical analysis', 'Visualization', 'Tool proficiency', 'Reporting'],
  1, TRUE
FROM categories c WHERE c.slug = 'analytics'

ON CONFLICT (slug) DO NOTHING;

-- Seed Skill Highlights
WITH skills AS (
  SELECT id, slug FROM public.skills WHERE slug IN ('seo-optimization', 'social-media-strategy', 'brand-positioning', 'copywriting', 'data-analytics')
)
INSERT INTO public.skill_highlights (skill_id, title, description, order_index)
SELECT
  s.id,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Proven Results'
    WHEN 'social-media-strategy' THEN 'Community Growth'
    WHEN 'brand-positioning' THEN 'Market Differentiation'
    WHEN 'copywriting' THEN 'Conversion Focused'
    WHEN 'data-analytics' THEN 'Data-Driven Insights'
  END,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Increase organic traffic by 150-300% within 6 months'
    WHEN 'social-media-strategy' THEN 'Build engaged communities with 10x faster growth'
    WHEN 'brand-positioning' THEN 'Stand out in crowded markets with unique positioning'
    WHEN 'copywriting' THEN 'Increase conversion rates by 40-60% with persuasive copy'
    WHEN 'data-analytics' THEN 'Make informed decisions backed by solid data'
  END,
  1
FROM skills s

UNION ALL

SELECT
  s.id,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Technical Excellence'
    WHEN 'social-media-strategy' THEN 'Strategic Planning'
    WHEN 'brand-positioning' THEN 'Competitive Advantage'
    WHEN 'copywriting' THEN 'Audience Connection'
    WHEN 'data-analytics' THEN 'Actionable Metrics'
  END,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Master technical SEO, site speed, and mobile optimization'
    WHEN 'social-media-strategy' THEN 'Develop comprehensive strategies for all major platforms'
    WHEN 'brand-positioning' THEN 'Create lasting impressions in customer minds'
    WHEN 'copywriting' THEN 'Write copy that speaks directly to customer needs'
    WHEN 'data-analytics' THEN 'Transform raw data into actionable business insights'
  END,
  2
FROM skills s

ON CONFLICT DO NOTHING;

-- Seed Skill Applications
WITH skills AS (
  SELECT id, slug FROM public.skills WHERE slug IN ('seo-optimization', 'social-media-strategy', 'brand-positioning', 'copywriting', 'data-analytics')
)
INSERT INTO public.skill_applications (skill_id, title, description, order_index)
SELECT
  s.id,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'E-commerce Optimization'
    WHEN 'social-media-strategy' THEN 'B2B Lead Generation'
    WHEN 'brand-positioning' THEN 'Product Launch Strategy'
    WHEN 'copywriting' THEN 'Email Marketing Campaigns'
    WHEN 'data-analytics' THEN 'Campaign Performance Analysis'
  END,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Optimize product pages and category pages for search visibility'
    WHEN 'social-media-strategy' THEN 'Generate qualified leads through LinkedIn and industry platforms'
    WHEN 'brand-positioning' THEN 'Launch new products with clear market positioning'
    WHEN 'copywriting' THEN 'Write email sequences that drive engagement and sales'
    WHEN 'data-analytics' THEN 'Track and optimize marketing campaign performance'
  END,
  1
FROM skills s

UNION ALL

SELECT
  s.id,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Local SEO'
    WHEN 'social-media-strategy' THEN 'Influencer Partnerships'
    WHEN 'brand-positioning' THEN 'Rebranding Initiatives'
    WHEN 'copywriting' THEN 'Landing Page Optimization'
    WHEN 'data-analytics' THEN 'Customer Behavior Analysis'
  END,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Improve local search rankings for multi-location businesses'
    WHEN 'social-media-strategy' THEN 'Collaborate with influencers to expand reach'
    WHEN 'brand-positioning' THEN 'Refresh brand identity while maintaining customer loyalty'
    WHEN 'copywriting' THEN 'Create high-converting landing pages'
    WHEN 'data-analytics' THEN 'Understand customer journey and optimize touchpoints'
  END,
  2
FROM skills s

ON CONFLICT DO NOTHING;

-- Seed Skill Tools
WITH skills AS (
  SELECT id, slug FROM public.skills WHERE slug IN ('seo-optimization', 'social-media-strategy', 'brand-positioning', 'copywriting', 'data-analytics')
)
INSERT INTO public.skill_tools (skill_id, tool_name, description, order_index)
SELECT
  s.id,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Google Search Console'
    WHEN 'social-media-strategy' THEN 'Hootsuite'
    WHEN 'brand-positioning' THEN 'Figma'
    WHEN 'copywriting' THEN 'Grammarly'
    WHEN 'data-analytics' THEN 'Google Analytics'
  END,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Monitor search performance and indexing issues'
    WHEN 'social-media-strategy' THEN 'Schedule and manage social media posts'
    WHEN 'brand-positioning' THEN 'Design brand identity and visual elements'
    WHEN 'copywriting' THEN 'Check grammar and improve writing quality'
    WHEN 'data-analytics' THEN 'Track website traffic and user behavior'
  END,
  1
FROM skills s

UNION ALL

SELECT
  s.id,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'SEMrush'
    WHEN 'social-media-strategy' THEN 'Buffer'
    WHEN 'brand-positioning' THEN 'Adobe XD'
    WHEN 'copywriting' THEN 'Hemingway Editor'
    WHEN 'data-analytics' THEN 'Tableau'
  END,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Comprehensive SEO analysis and competitor research'
    WHEN 'social-media-strategy' THEN 'Social media scheduling and analytics'
    WHEN 'brand-positioning' THEN 'Prototyping and design collaboration'
    WHEN 'copywriting' THEN 'Simplify and improve writing clarity'
    WHEN 'data-analytics' THEN 'Create interactive data visualizations'
  END,
  2
FROM skills s

ON CONFLICT DO NOTHING;

-- Seed Skill Steps
WITH skills AS (
  SELECT id, slug FROM public.skills WHERE slug IN ('seo-optimization', 'social-media-strategy', 'brand-positioning', 'copywriting', 'data-analytics')
)
INSERT INTO public.skill_steps (skill_id, step_title, step_description, order_index)
SELECT
  s.id,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Keyword Research'
    WHEN 'social-media-strategy' THEN 'Define Goals'
    WHEN 'brand-positioning' THEN 'Market Research'
    WHEN 'copywriting' THEN 'Understand Your Audience'
    WHEN 'data-analytics' THEN 'Define KPIs'
  END,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Identify high-volume, low-competition keywords relevant to your business'
    WHEN 'social-media-strategy' THEN 'Set clear, measurable goals for your social media presence'
    WHEN 'brand-positioning' THEN 'Analyze market trends, competitors, and customer needs'
    WHEN 'copywriting' THEN 'Research your target audience and their pain points'
    WHEN 'data-analytics' THEN 'Identify key performance indicators aligned with business goals'
  END,
  1
FROM skills s

UNION ALL

SELECT
  s.id,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'On-Page Optimization'
    WHEN 'social-media-strategy' THEN 'Content Planning'
    WHEN 'brand-positioning' THEN 'Define Positioning'
    WHEN 'copywriting' THEN 'Craft Your Message'
    WHEN 'data-analytics' THEN 'Collect Data'
  END,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Optimize title tags, meta descriptions, and content for target keywords'
    WHEN 'social-media-strategy' THEN 'Create a content calendar aligned with your goals'
    WHEN 'brand-positioning' THEN 'Define your unique value proposition and brand personality'
    WHEN 'copywriting' THEN 'Write compelling headlines and body copy'
    WHEN 'data-analytics' THEN 'Set up tracking and data collection systems'
  END,
  2
FROM skills s

UNION ALL

SELECT
  s.id,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Technical SEO'
    WHEN 'social-media-strategy' THEN 'Community Engagement'
    WHEN 'brand-positioning' THEN 'Communicate Positioning'
    WHEN 'copywriting' THEN 'Test and Optimize'
    WHEN 'data-analytics' THEN 'Analyze Results'
  END,
  CASE s.slug
    WHEN 'seo-optimization' THEN 'Improve site speed, mobile responsiveness, and crawlability'
    WHEN 'social-media-strategy' THEN 'Engage with your audience and build community'
    WHEN 'brand-positioning' THEN 'Communicate your positioning across all touchpoints'
    WHEN 'copywriting' THEN 'A/B test different versions and optimize based on results'
    WHEN 'data-analytics' THEN 'Analyze data to identify trends and opportunities'
  END,
  3
FROM skills s

ON CONFLICT DO NOTHING;
