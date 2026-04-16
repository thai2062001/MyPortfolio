-- =========================================================
-- Step 11: Master Seed Data (Corrected Column Names - English Only)
-- =========================================================

-- 1. Dọn dẹp ràng buộc gây xung đột cho Page Sections
ALTER TABLE public.page_sections DROP CONSTRAINT IF EXISTS page_sections_page_type_section_name_key;
ALTER TABLE public.page_sections DROP CONSTRAINT IF EXISTS unique_page_section_key;
ALTER TABLE public.page_sections ADD CONSTRAINT unique_page_section_key UNIQUE (page_type, section_key);

DO $$ 
DECLARE
    marketing_cat_id UUID;
    creative_cat_id UUID;
    tech_cat_id UUID;
    proj_cat_marketing_id UUID;
    proj_cat_design_id UUID;
    blog_cat_id UUID;
    project_1_id UUID;
BEGIN
    -- 0. Section Initialization (Chỉ tiếng Anh)
    INSERT INTO public.page_sections (page_type, section_key, section_type, section_name, order_index, data_source)
    VALUES 
    ('home', 'home_hero', 'hero', 'Hero Section', 0, 'fixed'),
    ('home', 'home_about', 'about', 'About Section', 1, 'fixed'),
    ('home', 'home_services', 'services', 'Services Section', 2, 'table'),
    ('home', 'home_expertise', 'expertise', 'Expertise Section', 3, 'table'),
    ('home', 'home_projects', 'projects', 'Projects Section', 4, 'table'),
    ('home', 'home_testimonials', 'testimonials', 'Testimonials Section', 5, 'table'),
    ('home', 'home_blog', 'blog', 'Blog Section', 6, 'table'),
    ('home', 'home_contact', 'contact', 'Contact Section', 7, 'fixed')
    ON CONFLICT (page_type, section_key) DO UPDATE SET section_name = EXCLUDED.section_name;

    -- 1. Skill Categories & Skills (Bảng này dùng name_en)
    INSERT INTO public.skill_categories (slug, name_en, order_index)
    VALUES ('marketing', 'Digital Marketing', 0)
    ON CONFLICT (slug) DO UPDATE SET name_en = EXCLUDED.name_en
    RETURNING id INTO marketing_cat_id;

    INSERT INTO public.skill_categories (slug, name_en, order_index)
    VALUES ('creative', 'Creative Strategy', 1)
    ON CONFLICT (slug) DO UPDATE SET name_en = EXCLUDED.name_en
    RETURNING id INTO creative_cat_id;

    -- Skills (Bảng này dùng skill_name)
    INSERT INTO public.skills (category_id, skill_name, order_index)
    VALUES 
    (marketing_cat_id, 'SEO Strategy', 0), 
    (marketing_cat_id, 'Performance Marketing', 1),
    (creative_cat_id, 'Brand Guidelines', 2)
    ON CONFLICT DO NOTHING;

    -- 2. Project Categories (Bảng này dùng 'name' thay vì 'name_en' theo Step 04)
    INSERT INTO public.project_categories (slug, name, order_index)
    VALUES ('marketing-campaigns', 'Marketing Campaigns', 0)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO proj_cat_marketing_id;

    INSERT INTO public.project_categories (slug, name, order_index)
    VALUES ('branding-design', 'Branding & Design', 1)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO proj_cat_design_id;

    -- 3. Projects (Bảng này dùng 'title' và 'short_description' theo Step 04)
    INSERT INTO public.projects (slug, title, category_id, short_description, is_featured, order_index)
    VALUES (
        'eco-growth-2024', 
        'Eco-Growth Campaign', 
        proj_cat_marketing_id, 
        'A comprehensive 360 marketing campaign for sustainable brands focusing on core growth.', 
        TRUE, 0
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO project_1_id;

    -- 4. Blog Posts (Bảng này dùng 'title_en', 'content_en', 'excerpt_en' theo Step 05)
    INSERT INTO public.blog_categories (slug, name_en)
    VALUES ('industry-trends', 'Industry Trends')
    ON CONFLICT (slug) DO NOTHING
    RETURNING id INTO blog_cat_id;

    INSERT INTO public.blog_posts (slug, title_en, category_id, excerpt_en, content_en, is_published)
    VALUES (
        'future-of-ai-marketing', 
        'The Future of Marketing with AI', 
        blog_cat_id, 
        'Exploring how artificial intelligence is reshaping consumer engagement and data analytics.', 
        'In 2024, AI is no longer a luxury but a necessity for marketers globally...', 
        TRUE
    )
    ON CONFLICT (slug) DO NOTHING;

    -- 5. FAQ & Testimonials (Bảng này dùng question_en, quote_en)
    INSERT INTO public.faq_items (question_en, answer_en, order_index)
    VALUES 
    ('How long does a campaign take?', 'Usually 3 to 6 months depending on scope.', 0),
    ('Do you offer consulting?', 'Yes, for strategic brand positioning.', 1)
    ON CONFLICT DO NOTHING;

    INSERT INTO public.testimonials (author_name, author_company, quote_en, order_index)
    VALUES 
    ('Sarah Jenkins', 'EcoGlobal', 'Yen’s strategic approach completely transformed our online presence and ROI.', 0),
    ('David Chen', 'TechNode', 'Highly professional and data-driven. The results spoke for themselves within weeks.', 1)
    ON CONFLICT DO NOTHING;

END $$;
