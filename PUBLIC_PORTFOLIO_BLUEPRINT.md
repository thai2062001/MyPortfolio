# PUBLIC PORTFOLIO BLUEPRINT

This document outlines the architecture, data flow, and optimization logic for the public-facing Portfolio application.

## 1. Technical Architecture
- **Framework**: Vite + React (TypeScript)
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **Data Fetching**: TanStack Query (React Query) v5
- **Backend/DB**: Supabase (PostgreSQL + Realtime)

## 2. Dynamic Section Rendering System
The website is built using a **Dynamic Layout Engine**. Pages are not hardcoded but rendered based on data from Supabase.

### Data Flow for Page Generation:
1. **Request**: `Index.tsx` or `Portfolio.tsx` calls `useSectionRenderer(pageType)`.
2. **Fetch**: `getSectionsByPage(pageType)` queries the `page_sections` table.
3. **Cache**: TanStack Query stores the section list (Key: `['sections', pageType]`).
4. **Mapping**: `renderSectionsByOrder` maps `section_key` (e.g., `home_hero`, `portfolio_grid`) to actual React components in `src/lib/sectionRenderer.tsx`.

## 3. Database Schema (Source of Truth)
| Table | Purpose | Used In |
|-------|---------|---------|
| `page_sections` | Defines order, visibility, and source table for every block on a page. | Home, Portfolio |
| `projects` | Portfolio items (slug, title, content, cover_url). | PortfolioGrid |
| `project_categories` | Categories for filtering projects. | PortfolioGrid |
| `skills` / `skill_categories` | Skill matrix nodes and their groupings. | SkillsSection |
| `hero_sections` / `hero_layouts` | Content and layout configuration for the Hero area. | HeroSection |
| `site_settings` | Global configuration (Favicon, Global Titles, Fonts). | App-wide |

## 4. Optimization & Performance Logic
### Caching Strategy (via TanStack Query)
- **Global StaleTime**: 5 minutes (`1000 * 60 * 5`). Data stays "fresh" in memory for 5 minutes.
- **Specific StaleTime**: Projects in `PortfolioGrid` stay fresh for 10 minutes to minimize heavy queries.
- **Window Focus**: `refetchOnWindowFocus: false` to prevent unnecessary re-fetches when switching tabs.

### Lazy Loading & Rendering
- **Component Level**: Sections are imported using `lazy(() => import(...))` to split code.
- **Viewport Trigger**: `LazySection` uses `react-intersection-observer`. Components only render when the user scrolls within 600px of them.
- **Image Optimization**: Cloudinary integration (`optimizeCloudinary`) handles responsive image sizing and format conversion.

## 5. UI/UX Principles
- **Atmosphere First**: High use of glassmorphism (`ethereal-glass`), soft blurs, and premium typography.
- **Smooth Entrances**: Every page uses an `AnimatePresence` curtain reveal.
- **Mobile First**: Hover effects are disabled on touch devices; navigation switches to full-screen modals.

---
*Note: To move a section, modify the `page_type` in `page_sections` via Admin. The FE will automatically reflect the change.*

<br/>

# BẢN THIẾT KẾ PORTFOLIO (PUBLIC)

Tài liệu này phác thảo kiến trúc, luồng dữ liệu và logic tối ưu hóa cho ứng dụng Portfolio dành cho người dùng.

## 1. Kiến trúc kỹ thuật
- **Framework**: Vite + React (TypeScript)
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **Data Fetching**: TanStack Query (React Query) v5
- **Backend/DB**: Supabase (PostgreSQL + Realtime)

## 2. Hệ thống Render Section Động
Trang web được xây dựng bằng một **Layout Engine Động**. Các trang không được viết cứng (hardcoded) mà được render dựa trên dữ liệu từ Supabase.

### Luồng dữ liệu để tạo trang:
1. **Yêu cầu (Request)**: `Index.tsx` hoặc `Portfolio.tsx` gọi hook `useSectionRenderer(pageType)`.
2. **Tải dữ liệu (Fetch)**: `getSectionsByPage(pageType)` truy vấn bảng `page_sections`.
3. **Bộ nhớ đệm (Cache)**: TanStack Query lưu danh sách các khối (Key: `['sections', pageType]`).
4. **Ánh xạ (Mapping)**: `renderSectionsByOrder` ánh xạ `section_key` (ví dụ: `home_hero`, `portfolio_grid`) thành các React component thực tế trong `src/lib/sectionRenderer.tsx`.

## 3. Cấu trúc Database (Nguồn dữ liệu gốc)
| Bảng | Mục đích | Sử dụng tại |
|-------|---------|---------|
| `page_sections` | Định nghĩa thứ tự, hiển thị và bảng nguồn cho mọi khối trên trang. | Home, Portfolio |
| `projects` | Các mục danh mục dự án (slug, title, content, cover_url). | PortfolioGrid |
| `project_categories` | Các danh mục để lọc dự án. | PortfolioGrid |
| `skills` / `skill_categories` | Các nút ma trận kỹ năng và phân nhóm của chúng. | SkillsSection |
| `hero_sections` / `hero_layouts` | Nội dung và cấu hình layout cho khu vực Hero. | HeroSection |
| `site_settings` | Cấu hình toàn cầu (Favicon, Tiêu đề chung, Fonts). | Toàn ứng dụng |

## 4. Logic Tối ưu hóa & Hiệu năng
### Chiến lược Cache (qua TanStack Query)
- **Global StaleTime**: 5 phút (`1000 * 60 * 5`). Dữ liệu được coi là "tươi" trong bộ nhớ trong 5 phút.
- **StaleTime cụ thể**: Dự án trong `PortfolioGrid` được giữ tươi trong 10 phút để giảm thiểu các truy vấn nặng.
- **Window Focus**: `refetchOnWindowFocus: false` để ngăn việc tự động tải lại dữ liệu không cần thiết khi chuyển tab.

### Lazy Loading & Rendering
- **Cấp độ Component**: Các section được nhập bằng `lazy(() => import(...))` để chia nhỏ mã nguồn (code splitting).
- **Kích hoạt theo Viewport**: `LazySection` sử dụng `react-intersection-observer`. Các component chỉ render khi người dùng cuộn đến trong khoảng 600px.
- **Tối ưu hình ảnh**: Tích hợp Cloudinary (`optimizeCloudinary`) xử lý kích thước hình ảnh phản hồi (responsive) và chuyển đổi định dạng.

## 5. Nguyên tắc UI/UX
- **Ưu tiên Không khí (Atmosphere)**: Sử dụng nhiều hiệu ứng glassmorphism (`ethereal-glass`), hiệu ứng mờ mềm mại và typography cao cấp.
- **Chuyển cảnh mượt mà**: Mỗi trang đều sử dụng hiệu ứng màn che reveal qua `AnimatePresence`.
- **Ưu tiên Di động**: Các hiệu ứng hover bị tắt trên thiết bị cảm ứng; điều hướng chuyển sang dạng modal toàn màn hình.

---
*Lưu ý: Để di chuyển một section, hãy sửa `page_type` trong bảng `page_sections` thông qua Admin. Front-end sẽ tự động cập nhật theo thay đổi.*
