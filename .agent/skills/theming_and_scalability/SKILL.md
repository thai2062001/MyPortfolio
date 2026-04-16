---
name: Multi-Theme & Scalability Architecture
description: Guidelines for building a decoupled portfolio platform with interchangeable themes and a fixed admin core.
---

# 🏗️ Multi-Theme & Scalability Architecture

> [!CAUTION]
> **MANDATORY PRE-REQUISITE**:
> 1. **Read this Skill**: You MUST read this documentation in its entirety BEFORE performing any tasks related to Themes or UI.
> 2. **Database Truth**: You MUST read `SUPABASE_SCHEMA_CONSOLIDATED.sql` BEFORE creating any Page, UI, or Database-related code.
> 3. **Fixed Port**: The development port is strictly **8080**. Do not use or configure any other ports.

This skill defines the methodology for scaling the portfolio project into a multi-customer platform where the frontend (Themes) is interchangeable and the backend logic (Core) remains stable.

## 1. Core Principles (VI/EN)

### 🧩 Decoupling (Tách biệt)
- **Concept**: The UI is a "skin" that consumes data. The Core is the "brain" that provides it.
- **Rule**: No theme-specific UI logic should ever be in `src/core`. If multiple themes need a specific layout/utility, it belongs in `src/components/shared`.

### 📦 Modular Themes (Theme theo Module)
- **Structure**:
  - `src/themes/[name]/pages/`: Theme-specific route handlers.
  - `src/themes/[name]/components/`: Theme-specific UI units (Hero, Grid, etc.).
  - `src/themes/[name]/styles/`: Theme-specific CSS/Tailwind overrides.

### 🔌 API Services (Dịch vụ API)
- **Rule**: All data fetching must use the shared services in `src/core/api`.
- **Naming Pattern**: `getProjectBySlug(slug: string)`, `getPortfolioData()`.
- **Benefit**: If the database schema changes, you only update the service. All 10 themes will be fixed automatically.

## 2. Multi-Customer Readiness (Multi-tenancy)

### 🆔 Client Context
- Always design data tables with a `client_id` in mind.
- Use `site_settings.theme_id` to determine which entry point to load in `App.tsx`.

### 🎨 Design Tokens
- Use CSS Variables for colors (`--primary`, `--accent`) defined in `src/core/styles/base.css`.
- The Super Admin updates these variables via the database configuration.

## 3. Strict Theme Management & Isolation (NEW)

### 🛡️ Theme Isolation Rule
- **Edit Isolation**: When modifying UI or logic within a specific theme, you **must only** modify files within that theme's directory. Do not affect other themes.
- **Immunity of Old Themes**: When creating a new theme, older themes are **strictly off-limits**. You may refer to their code for inspiration, but modifying them is forbidden under any circumstances.
- **Theme Scope Enforcement**: Because the platform manages multiple skins, maintaining distinct boundaries is mandatory for system integrity.

### 🚦 UI Confirmation Protocol
- Before any design or UI modification, the developer/AI **must explicitly confirm** which theme is being targeted.
- Execution is only allowed **after the USER confirms** the target theme and the scope of changes.

## 4. Implementation Details (Live System)

### 🔌 Live Theme Engine (As of 2026-04-13)
- **State Management**: Using `src/contexts/SiteContext.tsx` to handle global site settings.
- **Dynamic Entry**: `src/themes/ThemeEntry.tsx` uses the `useThemePages` hook to resolve pages at runtime based on `SiteContext`.
- **Database Mapping**: 
  - `public.themes`: The registry of available themes.
  - `public.site_settings.active_theme_id`: The source of truth for the active theme.
- **Theme Manager UI**: Accessible at `/admin/themes`.

## 5. Guidelines for AI & Developers

When creating a NEW THEME:
1. **Refer to `src/core/types/database.ts`** for all entity shapes.
2. **Refer to `docs/THEME_SYSTEM.md`** for the specific engine architecture.
3. **Do not create new state management** for core data; use the existing `@tanstack/react-query` patterns in `src/core/hooks`.
4. **Consistency**: Use the standardized `AdminLayout` for any parts that overlap with administrative tasks.

---

> [!IMPORTANT]
> **Vietnamese Version (Quy tắc bắt buộc)**:
> 1. **Cô lập Theme:** Khi sửa UI/Logic của theme nào, chỉ được làm việc trong folder của theme đó.
> 2. **Bảo toàn Theme cũ:** Khi tạo theme mới, tuyệt đối KO ĐƯỢC sửa bất cứ thứ gì ở theme cũ. Có thể tham khảo code nhưng cấm chỉnh sửa.
> 3. **Protocol Xác nhận:** Trước khi sửa Design/UI, phải hỏi rõ "Sửa theme nào?" và đợi User xác nhận mới được làm.
> 4. **Quản lý tập trung:** Mọi dữ liệu phải đi qua Core API (`src/core/api`), theme chỉ lo việc hiển thị.
> 5. **CSS Variables:** Sử dụng biến để quản lý màu sắc động giữa các khách hàng.
