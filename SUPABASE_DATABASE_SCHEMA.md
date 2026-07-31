# Cấu Trúc Chi Tiết Cơ Sở Dữ Liệu (Supabase/PostgreSQL)

Tài liệu này liệt kê toàn bộ các bảng, các trường dữ liệu cụ thể (kiểu dữ liệu, khóa ngoại, ràng buộc) và ý nghĩa của chúng từ file `SUPABASE_SCHEMA_CONSOLIDATED.sql`.

---

## 1. Nhóm Dự Án (Projects & Categories)

### Bảng: `public.project_categories`
* **Mô tả**: Danh mục dự án (Frontend, Marketing, v.v.).
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `slug` (TEXT, NOT NULL, UNIQUE)
  * `name` (TEXT, NOT NULL, UNIQUE)
  * `name_ja` (TEXT, Nullable)
  * `name_vi` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.projects`
* **Mô tả**: Thông tin chi tiết dự án.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `slug` (TEXT, NOT NULL, UNIQUE)
  * `title` (TEXT, NOT NULL)
  * `title_ja` (TEXT, Nullable)
  * `title_vi` (TEXT, Nullable)
  * `category_id` (UUID, REFERENCES `public.project_categories(id)` ON DELETE SET NULL)
  * `short_description` (TEXT, Nullable)
  * `short_description_ja` (TEXT, Nullable)
  * `short_description_vi` (TEXT, Nullable)
  * `description` (TEXT, Nullable)
  * `description_ja` (TEXT, Nullable)
  * `description_vi` (TEXT, Nullable)
  * `overview` (TEXT, Nullable)
  * `overview_ja` (TEXT, Nullable)
  * `overview_vi` (TEXT, Nullable)
  * `challenge` (TEXT, Nullable)
  * `challenge_ja` (TEXT, Nullable)
  * `challenge_vi` (TEXT, Nullable)
  * `solution` (TEXT, Nullable)
  * `solution_ja` (TEXT, Nullable)
  * `solution_vi` (TEXT, Nullable)
  * `client` (TEXT, Nullable)
  * `duration` (TEXT, Nullable)
  * `role` (TEXT, Nullable)
  * `year` (TEXT, Nullable)
  * `cover_image_url` (TEXT, Nullable)
  * `tall` (BOOLEAN, Default: `FALSE`)
  * `is_featured` (BOOLEAN, Default: `FALSE`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `order_index` (INTEGER, Default: `0`)
  * `seo_title` (TEXT, Nullable)
  * `seo_title_ja` (TEXT, Nullable)
  * `seo_title_vi` (TEXT, Nullable)
  * `seo_description` (TEXT, Nullable)
  * `seo_description_ja` (TEXT, Nullable)
  * `seo_description_vi` (TEXT, Nullable)
  * `og_image_url` (TEXT, Nullable)
  * `published_at` (TIMESTAMPTZ, Nullable)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.project_images`
* **Mô tả**: Bộ sưu tập ảnh của dự án.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `project_id` (UUID, NOT NULL, REFERENCES `public.projects(id)` ON DELETE CASCADE)
  * `image_url` (TEXT, NOT NULL)
  * `alt_text` (TEXT, Nullable)
  * `caption` (TEXT, Nullable)
  * `is_cover` (BOOLEAN, Default: `FALSE`)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.project_approaches`
* **Mô tả**: Hướng tiếp cận của dự án.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `project_id` (UUID, NOT NULL, REFERENCES `public.projects(id)` ON DELETE CASCADE)
  * `approach` (TEXT, NOT NULL)
  * `approach_ja` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.project_results`
* **Mô tả**: Kết quả đạt được của dự án.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `project_id` (UUID, NOT NULL, REFERENCES `public.projects(id)` ON DELETE CASCADE)
  * `label` (TEXT, NOT NULL)
  * `label_ja` (TEXT, Nullable)
  * `value` (TEXT, NOT NULL)
  * `value_ja` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.project_testimonials`
* **Mô tả**: Đánh giá phản hồi cụ thể cho từng dự án.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `project_id` (UUID, NOT NULL, REFERENCES `public.projects(id)` ON DELETE CASCADE)
  * `quote` (TEXT, NOT NULL)
  * `quote_ja` (TEXT, Nullable)
  * `name` (TEXT, NOT NULL)
  * `title` (TEXT, NOT NULL)
  * `title_ja` (TEXT, Nullable)
  * `company` (TEXT, Nullable)
  * `company_ja` (TEXT, Nullable)
  * `avatar_url` (TEXT, Nullable)
  * `video_url` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.project_tags`
* **Mô tả**: Danh sách các thẻ (tags) của dự án.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `slug` (TEXT, NOT NULL, UNIQUE)
  * `name_en` (TEXT, NOT NULL)
  * `name_ja` (TEXT, Nullable)
  * `name_vi` (TEXT, Nullable)
  * `description` (TEXT, Nullable)
  * `icon_url` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `is_active` (BOOLEAN, Default: `TRUE`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.project_tag_relations`
* **Mô tả**: Bảng liên kết Many-to-Many giữa dự án và tags.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `project_id` (UUID, NOT NULL, REFERENCES `public.projects(id)` ON DELETE CASCADE)
  * `tag_id` (UUID, NOT NULL, REFERENCES `public.project_tags(id)` ON DELETE CASCADE)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * *Constraint*: `uq_project_tag` (UNIQUE `project_id`, `tag_id`)

---

## 2. Kỹ Năng & Công Cụ (Skills & Expertise)

### Bảng: `public.skill_categories`
* **Mô tả**: Danh mục nhóm kỹ năng.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `slug` (TEXT, NOT NULL, UNIQUE)
  * `name_en` (TEXT, NOT NULL, UNIQUE)
  * `name_ja` (TEXT, NOT NULL, UNIQUE)
  * `name_vi` (TEXT, Nullable)
  * `description` (TEXT, Nullable)
  * `icon_url` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.skills`
* **Mô tả**: Thông tin kỹ năng chi tiết.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `category` (TEXT, NOT NULL) -- Dùng cho liên kết cũ/dữ liệu cũ
  * `category_id` (UUID, REFERENCES `public.skill_categories(id)` ON DELETE SET NULL)
  * `slug` (TEXT, Nullable)
  * `skill_name` (TEXT, NOT NULL)
  * `skill_name_ja` (TEXT, Nullable)
  * `skill_name_vi` (TEXT, Nullable)
  * `short_description` (TEXT, Nullable)
  * `short_description_ja` (TEXT, Nullable)
  * `description` (TEXT, Nullable)
  * `description_ja` (TEXT, Nullable)
  * `overview` (TEXT, Nullable)
  * `overview_ja` (TEXT, Nullable)
  * `application` (TEXT, Nullable)
  * `application_ja` (TEXT, Nullable)
  * `use_cases` (TEXT, Nullable)
  * `use_cases_ja` (TEXT, Nullable)
  * `icon_url` (TEXT, Nullable)
  * `cover_image_url` (TEXT, Nullable)
  * `difficulty_level` (TEXT, Nullable)
  * `difficulty_level_ja` (TEXT, Nullable)
  * `experience_level` (TEXT, Nullable)
  * `experience_level_ja` (TEXT, Nullable)
  * `estimated_time` (TEXT, Nullable)
  * `estimated_time_ja` (TEXT, Nullable)
  * `tool_stack` (TEXT[], Nullable)
  * `key_points` (TEXT[], Nullable)
  * `related_skill_ids` (UUID[], Nullable)
  * `show_highlights` (BOOLEAN, Default: `TRUE`)
  * `show_applications` (BOOLEAN, Default: `TRUE`)
  * `show_tools` (BOOLEAN, Default: `TRUE`)
  * `show_steps` (BOOLEAN, Default: `TRUE`)
  * `order_index` (INTEGER, Default: `0`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `seo_title` (TEXT, Nullable)
  * `seo_title_ja` (TEXT, Nullable)
  * `seo_description` (TEXT, Nullable)
  * `seo_description_ja` (TEXT, Nullable)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.skill_highlights`
* **Mô tả**: Điểm nổi bật chính của kỹ năng.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `skill_id` (UUID, NOT NULL, REFERENCES `public.skills(id)` ON DELETE CASCADE)
  * `title` (TEXT, NOT NULL)
  * `description` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.skill_highlight_images`
* **Mô tả**: Gallery hình ảnh của điểm nổi bật kỹ năng.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `highlight_id` (UUID, NOT NULL, REFERENCES `public.skill_highlights(id)` ON DELETE CASCADE)
  * `image_url` (TEXT, NOT NULL)
  * `alt_text` (TEXT, Nullable)
  * `caption` (TEXT, Nullable)
  * `is_cover` (BOOLEAN, Default: `FALSE`)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.skill_applications`
* **Mô tả**: Ứng dụng thực tế của kỹ năng.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `skill_id` (UUID, NOT NULL, REFERENCES `public.skills(id)` ON DELETE CASCADE)
  * `title` (TEXT, NOT NULL)
  * `description` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.skill_tools`
* **Mô tả**: Các tool bổ trợ cho kỹ năng.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `skill_id` (UUID, NOT NULL, REFERENCES `public.skills(id)` ON DELETE CASCADE)
  * `tool_name` (TEXT, NOT NULL)
  * `description` (TEXT, Nullable)
  * `icon_url` (TEXT, Nullable)
  * `tool_url` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.skill_steps`
* **Mô tả**: Các bước/Quy trình thực hiện kỹ năng.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `skill_id` (UUID, NOT NULL, REFERENCES `public.skills(id)` ON DELETE CASCADE)
  * `step_title` (TEXT, NOT NULL)
  * `step_description` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.skill_images`
* **Mô tả**: Gallery hình ảnh của kỹ năng.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `skill_id` (UUID, NOT NULL, REFERENCES `public.skills(id)` ON DELETE CASCADE)
  * `image_url` (TEXT, NOT NULL)
  * `alt_text` (TEXT, Nullable)
  * `caption` (TEXT, Nullable)
  * `is_cover` (BOOLEAN, Default: `FALSE`)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

## 3. Nội dung & Cài đặt trang (Content & Settings)

### Bảng: `public.about_content`
* **Mô tả**: Thông tin giới thiệu (About Me).
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY, Default: `gen_random_uuid()`)
  * `section_key` (TEXT, NOT NULL, UNIQUE)
  * `title_en` (TEXT, NOT NULL)
  * `title_ja` (TEXT, NOT NULL)
  * `title_vi` (TEXT, Nullable)
  * `content_en` (TEXT, NOT NULL)
  * `content_ja` (TEXT, NOT NULL)
  * `content_vi` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.about_images`
* **Mô tả**: Bộ sưu tập ảnh phần giới thiệu.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `about_id` (UUID, NOT NULL, REFERENCES `public.about_content(id)` ON DELETE CASCADE)
  * `image_url` (TEXT, NOT NULL)
  * `alt_text` (TEXT, Nullable)
  * `caption` (TEXT, Nullable)
  * `is_cover` (BOOLEAN, Default: `FALSE`)
  * `order_index` (INTEGER, Default: `0`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.about_tags`
* **Mô tả**: Các tag/nhãn thông tin của About Me.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `slug` (TEXT, NOT NULL, UNIQUE)
  * `name_en` (TEXT, NOT NULL)
  * `name_ja` (TEXT, Nullable)
  * `name_vi` (TEXT, Nullable)
  * `description` (TEXT, Nullable)
  * `icon_url` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `is_active` (BOOLEAN, Default: `TRUE`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.about_content_tags`
* **Mô tả**: Liên kết Many-to-Many giữa `about_content` và `about_tags`.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `about_id` (UUID, NOT NULL, REFERENCES `public.about_content(id)` ON DELETE CASCADE)
  * `tag_id` (UUID, NOT NULL, REFERENCES `public.about_tags(id)` ON DELETE CASCADE)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * *Constraint*: `uq_about_content_tags` (UNIQUE `about_id`, `tag_id`)

---

### Bảng: `public.site_settings`
* **Mô tả**: Cấu hình chung cho website.
* **Các trường dữ liệu**:
  * `id` (INTEGER, PRIMARY KEY, CHECK `id = 1`)
  * `site_name` (TEXT, Nullable)
  * `default_language` (TEXT, Default: `'en'`)
  * `global_font_family` (TEXT, Nullable)
  * `global_font_import_url` (TEXT, Nullable)
  * `global_font_import_css` (TEXT, Nullable)
  * `global_font_fallback` (TEXT, Default: `'sans-serif'`)
  * `global_custom_css` (TEXT, Nullable)
  * `body_font_id` (UUID, Nullable)
  * `heading_font_id` (UUID, Nullable)
  * `active_theme_id` (TEXT, REFERENCES `public.themes(id)` ON DELETE SET NULL)
  * `maintenance_mode` (BOOLEAN, Default: `FALSE`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.themes`
* **Mô tả**: Danh sách theme của website.
* **Các trường dữ liệu**:
  * `id` (TEXT, PRIMARY KEY) -- Ví dụ: 'radiant', 'minimal', 'editorial'
  * `name` (TEXT, NOT NULL)
  * `description` (TEXT, Nullable)
  * `preview_image_url` (TEXT, Nullable)
  * `is_active` (BOOLEAN, Default: `TRUE`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.hero_sections`
* **Mô tả**: Nội dung phần Hero banner đầu trang.
* **Các trường dữ liệu**:
  * `id` (INTEGER, PRIMARY KEY, CHECK `id = 1`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `badge` (TEXT, Nullable)
  * `badge_ja` (TEXT, Nullable)
  * `badge_vi` (TEXT, Nullable)
  * `title_line_1_en` (TEXT, Default: `''`)
  * `title_line_1_ja` (TEXT, Default: `''`)
  * `title_line_1_vi` (TEXT, Default: `''`)
  * `title_line_2_en` (TEXT, Nullable)
  * `title_line_2_ja` (TEXT, Nullable)
  * `title_line_2_vi` (TEXT, Nullable)
  * `title_line_2_html` (TEXT, Nullable)
  * `description_en` (TEXT, Nullable)
  * `description_ja` (TEXT, Nullable)
  * `description_vi` (TEXT, Nullable)
  * `primary_button_label_en` (TEXT, Nullable)
  * `primary_button_label_ja` (TEXT, Nullable)
  * `primary_button_label_vi` (TEXT, Nullable)
  * `primary_button_url` (TEXT, Nullable)
  * `secondary_button_label_en` (TEXT, Nullable)
  * `secondary_button_label_ja` (TEXT, Nullable)
  * `secondary_button_label_vi` (TEXT, Nullable)
  * `secondary_button_url` (TEXT, Nullable)
  * `hero_image_url` (TEXT, Nullable)
  * `hero_image_alt_en` (TEXT, Nullable)
  * `hero_image_alt_ja` (TEXT, Nullable)
  * `hero_image_alt_vi` (TEXT, Nullable)
  * `hero_image_storage_path` (TEXT, Nullable)
  * `selected_layout_key` (TEXT, Nullable) -- Liên kết `hero_layouts.layout_key`
  * `layout_config` (JSONB, Default: `'{}'`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.hero_layouts`
* **Mô tả**: Đăng ký các mẫu Layout khác nhau cho phần Hero banner.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `layout_key` (TEXT, UNIQUE, NOT NULL)
  * `layout_name` (TEXT, NOT NULL)
  * `description` (TEXT, Nullable)
  * `preview_image_url` (TEXT, Nullable)
  * `default_config` (JSONB, Default: `'{}'`)
  * `supported_fields` (JSONB, Default: `'{}'`)
  * `order_index` (INTEGER, Default: `0`)
  * `is_active` (BOOLEAN, Default: `TRUE`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.expertise_sections`
* **Mô tả**: Thiết lập tiêu đề/nội dung phần Expertise & Tools.
* **Các trường dữ liệu**:
  * `id` (INTEGER, PRIMARY KEY, CHECK `id = 1`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `eyebrow` (TEXT, Default: `'PROFICIENCIES'`)
  * `eyebrow_ja` (TEXT, Nullable)
  * `eyebrow_vi` (TEXT, Nullable)
  * `title` (TEXT, Default: `'Expertise & Tools'`)
  * `title_ja` (TEXT, Nullable)
  * `title_vi` (TEXT, Nullable)
  * `strategic_title` (TEXT, Default: `'Strategic Skills'`)
  * `strategic_title_ja` (TEXT, Nullable)
  * `strategic_title_vi` (TEXT, Nullable)
  * `strategic_helper_text` (TEXT, Nullable)
  * `strategic_helper_text_ja` (TEXT, Nullable)
  * `strategic_helper_text_vi` (TEXT, Nullable)
  * `strategic_description` (TEXT, Nullable)
  * `strategic_description_ja` (TEXT, Nullable)
  * `strategic_description_vi` (TEXT, Nullable)
  * `tools_title` (TEXT, Default: `'Technical Tools'`)
  * `tools_title_ja` (TEXT, Nullable)
  * `tools_title_vi` (TEXT, Nullable)
  * `tools_helper_text` (TEXT, Nullable)
  * `tools_helper_text_ja` (TEXT, Nullable)
  * `tools_helper_text_vi` (TEXT, Nullable)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.expertise_strategic_skills`
* **Mô tả**: Danh sách các kỹ năng chiến lược cốt lõi.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `skill_name` (TEXT, NOT NULL)
  * `skill_name_ja` (TEXT, Nullable)
  * `skill_name_vi` (TEXT, Nullable)
  * `icon_name` (TEXT, NOT NULL)
  * `icon_url` (TEXT, Nullable)
  * `description` (TEXT, Nullable)
  * `description_ja` (TEXT, Nullable)
  * `description_vi` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.expertise_tool_items`
* **Mô tả**: Danh sách các công cụ bổ trợ chuyên nghiệp.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `tool_name` (TEXT, NOT NULL)
  * `tool_name_ja` (TEXT, Nullable)
  * `tool_name_vi` (TEXT, Nullable)
  * `description` (TEXT, Nullable)
  * `description_ja` (TEXT, Nullable)
  * `description_vi` (TEXT, Nullable)
  * `tool_url` (TEXT, Nullable)
  * `icon_url` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `created_at` (TIMESTAMPTZ, Default: `NOW()`)
  * `updated_at` (TIMESTAMPTZ, Default: `NOW()`)

---

### Bảng: `public.timeline_section_settings`
* **Mô tả**: Cấu hình tiêu đề của dòng thời gian (học vấn & kinh nghiệm).
* **Các trường dữ liệu**:
  * `id` (INTEGER, PRIMARY KEY, CHECK `id = 1`)
  * `eyebrow_en` / `eyebrow_ja` / `eyebrow_vi` (TEXT)
  * `title_en` / `title_ja` / `title_vi` (TEXT)
  * `description_en` / `description_ja` / `description_vi` (TEXT)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `created_at` (TIMESTAMPTZ)
  * `updated_at` (TIMESTAMPTZ)

---

### Bảng: `public.timeline_phases`
* **Mô tả**: Các cột mốc dòng thời gian chi tiết.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `period` (TEXT, NOT NULL) -- ví dụ: "2020 - 2022"
  * `location` / `location_ja` / `location_vi` (TEXT)
  * `title_en` (TEXT, NOT NULL)
  * `title_ja` (TEXT, NOT NULL)
  * `title_vi` (TEXT, Nullable)
  * `company_en` / `company_ja` / `company_vi` (TEXT)
  * `description_en` (TEXT, NOT NULL)
  * `description_ja` (TEXT, NOT NULL)
  * `description_vi` (TEXT, Nullable)
  * `image_url` (TEXT, Nullable)
  * `tag_en` / `tag_ja` / `tag_vi` (TEXT)
  * `default_image_orientation` (TEXT, Default: `'landscape'`)
  * `order_index` (INTEGER, Default: `0`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `created_at` / `updated_at` (TIMESTAMPTZ)

---

### Bảng: `public.timeline_phase_images`
* **Mô tả**: Các ảnh chi tiết kèm theo mốc thời gian.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `phase_id` (UUID, REFERENCES `public.timeline_phases(id)` ON DELETE CASCADE)
  * `image_url` (TEXT, NOT NULL)
  * `alt_text` / `caption` (TEXT)
  * `is_cover` (BOOLEAN, Default: `FALSE`)
  * `image_orientation` (TEXT, Default: `'landscape'`)
  * `order_index` (INTEGER, Default: `0`)

---

### Bảng: `public.page_sections`
* **Mô tả**: Quản lý vị trí hiển thị của từng phần trên trang.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `section_key` (TEXT, NOT NULL)
  * `section_name` (TEXT, NOT NULL)
  * `section_type` (TEXT, NOT NULL)
  * `page_type` (TEXT, NOT NULL)
  * `order_index` (INTEGER, Default: `0`)
  * `is_published` (BOOLEAN, Default: `TRUE`)
  * `is_visible` (BOOLEAN, Default: `TRUE`)
  * `is_fixed` (BOOLEAN, Default: `FALSE`)
  * `data_source` (TEXT, Nullable)
  * `source_table` (TEXT, Nullable)
  * `description` (TEXT, Nullable)
  * `icon_name` (TEXT, Nullable)
  * `created_at` / `updated_at` (TIMESTAMPTZ)

---

### Bảng: `public.social_links`
* **Mô tả**: Đường dẫn liên kết mạng xã hội cá nhân.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `platform` (TEXT, NOT NULL)
  * `url` (TEXT, NOT NULL)
  * `icon_url` (TEXT, Nullable)
  * `order_index` (INTEGER, Default: `0`)
  * `is_published` (BOOLEAN, Default: `TRUE`)

---

## 4. Khách hàng & Liên hệ (Clients & Contacts)

### Bảng: `public.clients`
* **Mô tả**: Đối tác đã hợp tác.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `name` (TEXT, NOT NULL)
  * `logo_url` (TEXT, NOT NULL)
  * `website_url` (TEXT, Nullable)
  * `order_index` (INTEGER)
  * `is_published` (BOOLEAN)

---

### Bảng: `public.testimonials`
* **Mô tả**: Lời nhận xét đánh giá chung.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `name` (TEXT, NOT NULL)
  * `role_en` / `role_ja` / `role_vi` (TEXT)
  * `quote_en` / `quote_ja` / `quote_vi` (TEXT)
  * `portrait_url` (TEXT, Nullable)
  * `video_url` (TEXT, Nullable)
  * `order_index` (INTEGER)
  * `is_published` (BOOLEAN)

---

### Bảng: `public.contact_messages`
* **Mô tả**: Khách gửi lời nhắn/yêu cầu công việc.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `name` (TEXT, NOT NULL)
  * `email` (TEXT, NOT NULL)
  * `phone` (TEXT, Nullable)
  * `company` (TEXT, Nullable)
  * `purpose` (TEXT, Nullable)
  * `subject` (TEXT, Nullable)
  * `message` (TEXT, NOT NULL)
  * `is_read` (BOOLEAN, Default: `FALSE`)
  * `is_replied` (BOOLEAN, Default: `FALSE`)
  * `created_at` / `updated_at` (TIMESTAMPTZ)

---

### Bảng: `public.contact_purpose_options`
* **Mô tả**: Lựa chọn loại công việc cần liên hệ.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `value` (TEXT, UNIQUE, NOT NULL)
  * `label_en` / `label_ja` / `label_vi` (TEXT)
  * `order_index` (INTEGER)
  * `is_active` (BOOLEAN, Default: `TRUE`)

---

### Bảng: `public.contact_form_settings`
* **Mô tả**: Điều chỉnh hiển thị của form liên hệ.
* **Các trường dữ liệu**:
  * `id` (INTEGER, PRIMARY KEY, CHECK `id = 1`)
  * `is_purpose_enabled` (BOOLEAN)
  * `is_purpose_required` (BOOLEAN)
  * `purpose_placeholder_en` / `purpose_placeholder_ja` / `purpose_placeholder_vi` (TEXT)

---

### Bảng: `public.contact_sections`
* **Mô tả**: Tiêu đề và giao diện phần CTA / Contact.
* **Các trường dữ liệu**:
  * `id` (INTEGER, PRIMARY KEY, CHECK `id = 1`)
  * `is_published` (BOOLEAN)
  * `eyebrow` / `eyebrow_ja` / `eyebrow_vi` (TEXT)
  * `title_line_1_en` / `title_line_1_ja` / `title_line_1_vi` (TEXT)
  * `title_line_2_en` / `title_line_2_ja` / `title_line_2_vi` (TEXT)
  * `title_line_2_html` (TEXT)
  * `description_en` / `description_ja` / `description_vi` (TEXT)
  * `primary_button_label_en` / `primary_button_label_ja` / `primary_button_label_vi` (TEXT)
  * `primary_button_url` (TEXT)
  * `background_image_url` (TEXT)
  * `overlay_opacity` (FLOAT, Default: `0.3`)

---

## 5. Blog & Tiện ích khác

### Bảng: `public.blog_categories`
* **Mô tả**: Phân loại bài viết blog.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `slug` (TEXT, UNIQUE)
  * `name_en` / `name_ja` / `name_vi` (TEXT)
  * `description` (TEXT)
  * `order_index` (INTEGER)
  * `is_active` (BOOLEAN, Default: `TRUE`)

---

### Bảng: `public.blog_tags`
* **Mô tả**: Tag đính kèm cho blog.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `slug` (TEXT, UNIQUE)
  * `name_en` / `name_ja` / `name_vi` (TEXT)
  * `description` (TEXT)
  * `order_index` (INTEGER)
  * `is_active` (BOOLEAN)

---

### Bảng: `public.blog_posts`
* **Mô tả**: Nội dung bài viết chi tiết.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `slug` (TEXT, UNIQUE)
  * `category_id` (UUID, REFERENCES `public.blog_categories(id)`)
  * `title_en` / `title_ja` / `title_vi` (TEXT)
  * `excerpt_en` / `excerpt_ja` / `excerpt_vi` (TEXT)
  * `content_en` / `content_ja` / `content_vi` (TEXT)
  * `cover_image_url` (TEXT)
  * `status` (TEXT, CHECK `status IN ('draft', 'published', 'scheduled', 'archived')`)
  * `is_featured` (BOOLEAN)
  * `reading_time` (INTEGER)
  * `seo_title_en` / `seo_title_ja` / `seo_title_vi` (TEXT)
  * `seo_description_en` / `seo_description_ja` / `seo_description_vi` (TEXT)
  * `og_image_url` (TEXT)
  * `canonical_url` (TEXT)
  * `noindex` (BOOLEAN, Default: `FALSE`)
  * `order_index` (INTEGER)
  * `published_at` (TIMESTAMPTZ)
  * `last_draft_saved_at` (TIMESTAMPTZ)

---

### Bảng: `public.blog_post_tags`
* **Mô tả**: Liên kết Many-to-Many giữa `blog_posts` và `blog_tags`.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `post_id` (UUID, REFERENCES `public.blog_posts(id)` ON DELETE CASCADE)
  * `tag_id` (UUID, REFERENCES `public.blog_tags(id)` ON DELETE CASCADE)
  * *Constraint*: `uq_blog_post_tag` (UNIQUE `post_id`, `tag_id`)

---

### Bảng: `public.media_folders` & `public.media_assets`
* **Mô tả**: Quản lý hình ảnh/video tải lên.
* **Các trường trong `media_assets`**:
  * `id` (UUID, PRIMARY KEY)
  * `folder_id` (UUID, REFERENCES `public.media_folders(id)`)
  * `file_name` (TEXT)
  * `original_file_name` (TEXT)
  * `file_extension` (TEXT)
  * `mime_type` (TEXT)
  * `asset_type` (TEXT, CHECK `asset_type IN ('image', 'icon', 'svg', 'video', 'other')`)
  * `provider` (TEXT, Default: `'cloudinary'`)
  * `public_id` (TEXT, UNIQUE)
  * `url` / `secure_url` (TEXT)
  * `width` / `height` (INTEGER)
  * `file_size` (BIGINT)
  * `alt_text` / `title` / `caption` (TEXT)
  * `tags` (TEXT[])
  * `is_svg` / `is_icon` / `is_active` (BOOLEAN)

---

### Bảng: `public.site_stats`
* **Mô tả**: Chỉ số thống kê của Portfolio (Site statistics).
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `stat_key` (TEXT, UNIQUE)
  * `value_text` (TEXT)
  * `label_en` / `label_ja` / `label_vi` (TEXT)
  * `description_en` / `description_ja` / `description_vi` (TEXT)
  * `icon_url` (TEXT)
  * `order_index` (INTEGER)
  * `is_published` (BOOLEAN)

---

### Bảng: `public.faqs`
* **Mô tả**: Câu hỏi thường gặp.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `question_en` / `question_ja` / `question_vi` (TEXT)
  * `answer_en` / `answer_ja` / `answer_vi` (TEXT)
  * `category` (TEXT)
  * `order_index` (INTEGER)
  * `is_published` (BOOLEAN)

---

### Bảng: `public.portfolio_visit_events`
* **Mô tả**: Nhật ký phân tích lượt truy cập của khách hàng.
* **Các trường dữ liệu**:
  * `id` (UUID, PRIMARY KEY)
  * `visitor_id` (TEXT)
  * `session_id` (TEXT)
  * `page_key` (TEXT)
  * `page_url` (TEXT)
  * `referrer` (TEXT)
  * `traffic_source` (TEXT)
  * `device_type` (TEXT)
  * `screen_width` / `screen_height` (INTEGER)
  * `user_agent` (TEXT)
  * `time_on_page_seconds` (INTEGER)
  * `max_scroll_percent` (INTEGER)
  * `created_at` (TIMESTAMPTZ)
