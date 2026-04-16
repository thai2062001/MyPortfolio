-- =========================================================
-- Step 10: Master Seed Data (Settings, Sections, Samples)
-- =========================================================

-- 1. Base Settings
INSERT INTO public.site_settings (id, site_name, default_language)
VALUES (1, 'Pham Thi Hai Yen', 'vi')
ON CONFLICT (id) DO UPDATE SET site_name = EXCLUDED.site_name;

INSERT INTO public.personal_info (id, full_name, email)
VALUES (1, 'Pham Thi Hai Yen', 'contact@haiyen.me')
ON CONFLICT (id) DO NOTHING;

-- 2. Page Sections Layout (Home Page)
INSERT INTO public.page_sections (page_type, section_type, section_name, order_index, data_source)
VALUES 
('home', 'hero', 'Hero Section', 0, 'fixed'),
('home', 'about', 'About Section', 1, 'fixed'),
('home', 'services', 'Services Section', 2, 'table'),
('home', 'expertise', 'Expertise Section', 3, 'table'),
('home', 'projects', 'Projects Section', 4, 'table'),
('home', 'testimonials', 'Testimonials Section', 5, 'table'),
('home', 'blog', 'Blog Section', 6, 'table'),
('home', 'contact', 'Contact Section', 7, 'fixed')
ON CONFLICT (page_type, section_name) DO NOTHING;

-- 3. About Section Tags & Content
INSERT INTO public.about_tags (label_en, order_index)
VALUES 
('STRATEGY', 0),
('GROWTH', 1),
('CREATIVE', 2),
('ANALYTICS', 3)
ON CONFLICT (label_en) DO NOTHING;

INSERT INTO public.about_content (section_key, title_en, content_en, title_vi, content_vi)
VALUES (
    'main_bio', 
    'Crafting Digital Excellence', 
    'Specialized in building high-growth brands through data and creative strategy.',
    'Kiến Tạo Sự Xuất Sắc',
    'Chuyên gia xây dựng thương hiệu tăng trưởng mạnh mẽ thông qua dữ liệu và chiến lược sáng tạo.'
)
ON CONFLICT (section_key) DO UPDATE SET
    title_vi = EXCLUDED.title_vi,
    content_vi = EXCLUDED.content_vi;

-- 4. Site Stats
INSERT INTO public.site_stats (value, label_en, order_index)
VALUES 
('10K+', 'Active Users', 0),
('500+', 'Projects Managed', 1),
('15+', 'Global Awards', 2),
('99%', 'Success Rate', 3)
ON CONFLICT (label_en) DO NOTHING;

-- 5. Contact Purpose Options
INSERT INTO public.contact_purpose_options (label_en, label_vi, order_index)
VALUES 
('Project Inquiry', 'Yêu cầu dự án', 0),
('Partnership', 'Hợp tác làm việc', 1),
('Speaking/Mentoring', 'Diễn giả / Cố vấn', 2),
('General Message', 'Tin nhắn khác', 3)
ON CONFLICT (label_en) DO NOTHING;

-- 6. Sample Experience (Idempotent)
INSERT INTO public.experience_items (role, company, period, description, order_index)
SELECT 'Senior Marketing Lead', 'Tech Innovations', '2021 - Present', 'Giám đốc tiếp thị kĩ thuật số cho các dự án quy mô lớn.', 0
WHERE NOT EXISTS (SELECT 1 FROM public.experience_items);

-- 7. Sample Services
INSERT INTO public.services (title_en, title_vi, icon_name, order_index)
VALUES 
('Brand Strategy', 'Chiến lược thương hiệu', 'Zap', 0),
('Digital Marketing', 'Marketing kĩ thuật số', 'Target', 1),
('Content Creation', 'Sáng tạo nội dung', 'PenTool', 2)
ON CONFLICT (title_en) DO NOTHING;

-- 8. Vault Secrets Placeholder (Using our custom helper)
SELECT public.upsert_secret('project_url', 'https://portfolio.example.com', 'The main portfolio deployment URL');

-- 9. Initialize Section Settings
INSERT INTO public.projects_section_settings (id, eyebrow_en, title_en) VALUES (1, 'PORTFOLIO', 'Selected Works') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_section_settings (id, eyebrow_en, title_en) VALUES (1, 'INSIGHTS', 'Latest Articles') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.about_section_settings (id, eyebrow_en, title_en) VALUES (1, 'STORY', 'About Me') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.services_section_settings (id, eyebrow_en, title_en) VALUES (1, 'SERVICES', 'What I Do') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.testimonial_section_settings (id, eyebrow_en, title_en) VALUES (1, 'TESTIMONIALS', 'Client Feedback') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.site_stats_section_settings (id, eyebrow_en, title_en) VALUES (1, 'IMPACT', 'My Results') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.timeline_section_settings (id, eyebrow_en, title_en) VALUES (1, 'PROCESS', 'My Journey') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.contact_form_settings (id, eyebrow_en, title_en) VALUES (1, 'CONTACT', 'Get in Touch') ON CONFLICT (id) DO NOTHING;

-- 10. Sample Skill Categories
INSERT INTO public.skill_categories (slug, name_en, order_index)
VALUES 
('marketing', 'Digital Marketing', 0),
('creative', 'Creative Strategy', 1),
('technical', 'Technical Skills', 2)
ON CONFLICT (slug) DO NOTHING;
