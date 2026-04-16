-- =========================================================
-- SEED DATA HIGH-FIDELITY (THE CONTENT RECOVERY)
-- Created: 2026-04-16
-- Populates your database with professional, multilingual content.
-- Use AFTER running Master Sync.
-- =========================================================

-- [1] SITE CORE CONFIG
INSERT INTO public.site_settings (id, site_name, default_language, theme_color)
VALUES (1, 'Radiant Portfolio', 'en', '#000000')
ON CONFLICT (id) DO UPDATE SET site_name = EXCLUDED.site_name;

-- [2] HERO SECTION HIFI DATA
INSERT INTO public.hero_sections (
    id, is_published, badge, 
    title_line_1_en, title_line_2_en, 
    title_line_1_ja, title_line_2_ja,
    title_line_1_vi, title_line_2_vi,
    description_en, description_ja, description_vi,
    primary_button_label_en, primary_button_label_ja, primary_button_label_vi,
    primary_button_url
) VALUES (
    1, TRUE, 'OPEN FOR PROJECTS',
    'Creating Digital', 'Masterpieces',
    'デジタルの', '傑作を創る',
    'Tạo ra những', 'Tuyệt tác số',
    'I build high-performance, pixel-perfect web applications with cutting-edge technology.',
    '最先端の技術を駆使して、高性能でピクセルパーフェクトなウェブアプリケーションを構築します。',
    'Tôi xây dựng các ứng dụng web hiệu suất cao, chuẩn pixel với công nghệ tiên tiến nhất.',
    'View My Work', '実績を見る', 'Xem dự án của tôi',
    '/projects'
) ON CONFLICT (id) DO NOTHING;

-- [3] PAGE SECTIONS REGISTRY (Ensures Admin visibility)
INSERT INTO public.page_sections (section_key, section_name, section_type, page_type, order_index, is_published, is_visible, data_source, source_table)
VALUES 
    ('hero', 'Hero Section', 'hero', 'home', 1, TRUE, TRUE, 'custom', 'hero_sections'),
    ('about', 'About Me', 'about', 'home', 2, TRUE, TRUE, 'custom', 'about_content'),
    ('skills', 'My Expertise', 'skills', 'home', 3, TRUE, TRUE, 'custom', 'skills'),
    ('projects', 'Featured Works', 'projects', 'home', 4, TRUE, TRUE, 'custom', 'projects'),
    ('testimonials', 'Client Love', 'testimonials', 'home', 5, TRUE, TRUE, 'custom', 'testimonials'),
    ('faq', 'General FAQs', 'faq', 'home', 6, TRUE, TRUE, 'custom', 'faqs')
ON CONFLICT (section_key) DO NOTHING;

-- [4] FAQ SEED DATA (High Fidelity)
INSERT INTO public.faqs (question_en, question_ja, question_vi, answer_en, answer_ja, answer_vi, order_index)
VALUES 
    (
        'What tech stack do you use?', 
        'どのような技術スタックを使用していますか？', 
        'Bạn sử dụng bộ công nghệ (Tech Stack) nào?', 
        'I specialize in Next.js, React, and Supabase for clean, scalable, and high-performance applications.',
        'クリーンでスケーラブルな高性能アプリケーションのために、Next.js、React、Supabaseを専門としています。',
        'Tôi chuyên sử dụng Next.js, React và Supabase để tạo ra các ứng dụng sạch, dễ mở rộng và hiệu suất cao.',
        1
    ),
    (
        'Are you available for freelance?', 
        'フリーランスの仕事は受けていますか？', 
        'Bạn có nhận làm Freelance không?', 
        'Yes, I am open to interesting projects and collaborations. Feel free to contact me!',
        'はい、興味深いプロジェクトやコラボレーションを受け付けています。お気軽にお問い合わせください！',
        'Có, tôi luôn sẵn sàng cho các dự án và sự hợp tác thú vị. Đừng ngần ngại liên hệ với tôi!',
        2
    )
ON CONFLICT DO NOTHING;

-- [SEED] EXPERTISE STRATEGIC SKILLS
INSERT INTO public.expertise_strategic_skills (slug, skill_name, skill_name_en, icon_name, description, description_en, order_index)
VALUES 
('branding', 'Branding', 'Branding', 'branding', 'Brand strategy and identity design.', 'Brand strategy and identity design.', 1),
('marketing', 'Marketing', 'Marketing', 'marketing', 'Marketing and campaign planning.', 'Marketing and campaign planning.', 2),
('creative', 'Creative', 'Creative', 'creative', 'Creative direction and visual ideas.', 'Creative direction and visual ideas.', 3)
ON CONFLICT (slug) DO NOTHING;

-- [SEED] EXPERTISE TOOL ITEMS
INSERT INTO public.expertise_tool_items (tool_name, tool_name_en, description, description_en, tool_url, order_index)
VALUES 
('Figma', 'Figma', 'Design and prototyping tool.', 'Design and prototyping tool.', 'https://figma.com', 1),
('Adobe CC', 'Adobe CC', 'Creative cloud suite.', 'Creative cloud suite.', 'https://adobe.com', 2),
('Webflow', 'Webflow', 'No-code web builder.', 'No-code web builder.', 'https://webflow.com', 3)
ON CONFLICT DO NOTHING;

-- [5] METRICS (Site Stats)
INSERT INTO public.site_stats (stat_key, value_text, label_en, label_ja, label_vi, order_index)
VALUES 
    ('experience', '5+', 'Years Experience', '年の経験', 'Năm kinh nghiệm', 1),
    ('projects', '50+', 'Completed Projects', '完了したプロジェクト', 'Dự án hoàn thành', 2),
    ('clients', '30+', 'Happy Clients', 'ハッピーなお客様', 'Khách hàng hài lòng', 3)
ON CONFLICT (stat_key) DO NOTHING;

-- [6] HERO LAYOUTS (The UI Templates)
INSERT INTO public.hero_layouts (layout_key, name, description, thumbnail_url, order_index, is_active) 
VALUES 
    ('default', 'Standard Radiant', 'The classic Radiant hero style with badge and dual buttons.', '/images/layouts/hero-default.jpg', 1, TRUE),
    ('minimal', 'Minimalist Clean', 'A focused, centered hero with minimal text.', '/images/layouts/hero-minimal.jpg', 2, TRUE),
    ('creative', 'Asymmetric Creative', 'A bold, asymmetric layout for high-impact portfolios.', '/images/layouts/hero-creative.jpg', 3, TRUE)
ON CONFLICT (layout_key) DO NOTHING;
