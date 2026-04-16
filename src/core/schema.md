# 🧠 Portfolio Core Schema (AI & Developer Guide)

This document provides a condensed overview of the database schema and architecture for the **Radiant Growth Portfolio Platform**. Use this to ensure consistent data handling across Theme 1, 2, and 3.

## 📂 Architecture Overview
- **Core (`src/core/`)**: Shared Logic, Types, and API calls. **Bất biến (Fixed)**.
- **Admin (`src/components/admin/`)**: Dashboard UI. **Bất biến (Fixed)**.
- **Themes (`src/themes/[name]/`)**: Look and Feel. **Tùy biến (Customizable)**.

## 📊 Core Data Entities

### 1. Personal & Identity
- `personal_info`: Social links (Facebook, LinkedIn, GitHub) and contact details (Email, Phone).
- `social_links`: Customizable row of social icons with order.

### 2. Work Portfolio
- `projects`: Main project data (Title, Slug, Descriptions, SEO).
- `project_images`: Gallery (linked to `project_id`).
- `project_categories`: Groups (e.g., Marketing, Content, Strategy).

### 3. Expertise & Proficiencies
- `expertise_strategic_skills`: High-level skills with icons (Hero section).
- `expertise_tool_items`: Technical tools (Figma, Google Analytics).
- `skill_categories` & `skills`: Detailed breakdown of proficiencies.

### 4. Experience & Proof
- `timeline_phases`: Professional career milestones.
- `testimonials`: Client quotes and feedback.
- `clients`: Logos of companies worked with.

## 🛠️ Implementation Rules
1. **Always use Types**: Import from `@/core/types/database`.
2. **Fetch via Core Hooks**: Do not write raw Supabase queries in theme components. Use `src/core/api` (TBD).
3. **Responsive first**: All themes must be high-end and mobile-responsive.
4. **Multitenancy**: Always check for `site_settings.theme_id` to load the correct style.

## 📝 SQL Reference (Condensed)
Refer to `SUPABASE_SCHEMA_CONSOLIDATED.sql` for the full DDL, but focus on the `public` schema tables listed above.
