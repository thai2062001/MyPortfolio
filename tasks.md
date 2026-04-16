# 🛡️ Development & Refinement Task List

This document tracks the ongoing evolution of the **Radiant Growth Portfolio**. Use this to queue new requests or monitor current progress.

## 🏁 Completed Milestones

### 🏗️ Admin Infrastructure
- [x] **Centralized Media Library**: Standardized asset management via `MediaPickerModal`.
- [x] **Global Delete Confirmation**: Unified `DeleteConfirmDialog` with high-priority z-index handling.
- [x] **Premium UI Standardization**: Applied "Daylight Ethereal" aesthetics (border-sage/20, bg-white/70) across Hero, Projects, and Timeline management.

### 👤 Personal Info Dashboard
- [x] **Social Links Redesign**: Implemented a compact, horizontal row layout.
- [x] **Dual Upload Workflow**: Integrated both direct device upload and Media Library access for icons.
- [x] **Social Gateway Dialog**: Unified Add/Edit interface with high-priority overlay.
- [x] **Visibility Controls**: Implemented cinematic Eye/EyeOff toggles for link publishing status.

---

## 🚀 Active Objectives (Current Phase)

### 🛠️ Technical Fixes & Optimizations
- [x] **Newline Preservation (Project Details)**: Fix rendering of 'Solution' text in `/project/[id]` to respect database newlines (whitespace-pre-wrap).
- [x] **Gallery Performance**: Increase the slide transition speed for the Project Detail gallery navigation.
- [x] **Home: About Me Animation**: Restrict section animations to a single entrance event (reset only on F5), removing continuous loops.

### 🎨 UI/UX Refinements
- [ ] **Mobile Sidebar Optimization**: Ensure the admin navigation remains fluid on small touch targets.
- [ ] **Feedback Animations**: Add micro-interactions when saving successful changes (subtle glow/check).
- [ ] **Typography Audit**: Ensure 'Newsreader' and 'Inter' are consistently applied to all dashboard headings.

### ⚙️ Feature Enhancements
- [ ] **Drag & Drop Reordering**: Implement drag-to-sort for Social Links and Timeline items.
- [ ] **Real-time Preview**: Add a 'Live View' button to see changes on the public site instantly.
- [ ] **Bulk Actions**: Enable multi-delete for gallery items in Project Management.

---

## 📂 Backlog (Next Up)

- [ ] **Auth Session Persistence**: Ensure admin session remains stable across browser restarts.
- [ ] **Dynamic SEO Metadata**: Add a section in Personal Info to manage site-wide SEO keywords and descriptions.
- [ ] **Analytics Dashboard Integration**: Connect Supabase Edge Functions to track visitor counts per social link.

---

## 🏢 Scalability & Multi-Theme Architecture / Kiến trúc Đa Theme & Khả năng Mở rộng (Future Phase)

- [ ] **Core Logic Separation / Tách biệt Logic cốt lõi**:
    - Move Supabase hooks, types, and client logic to a centralized `src/core/` directory.
    - Di chuyển các hooks Supabase, định nghĩa types và logic client vào thư mục `src/core/` tập trung.
- [ ] **Theme Folder Restructuring / Cấu trúc lại thư mục Theme**:
    - Relocate all public-facing pages and components to `src/themes/radiant/` to prepare for Theme 2/3.
    - Di chuyển tất cả các trang và component phía người dùng vào `src/themes/radiant/` để chuẩn bị cho các Theme tiếp theo.
- [ ] **Dynamic Theme Loading / Tải Theme động**:
    - Implement a routing mechanism in `App.tsx` that switches themes based on database configuration (`site_settings.theme_id`).
    - Triển khai cơ chế điều hướng trong `App.tsx` để chuyển đổi theme dựa trên cấu hình database.
- [ ] **Multitenancy Foundation / Nền tảng Đa người dùng**:
    - Add `client_id` or `user_id` columns to core tables to support multiple customers on a single backend.
    - Thêm cột `client_id` hoặc `user_id` vào các bảng cốt lõi để hỗ trợ nhiều khách hàng trên cùng một backend.

---

> [!TIP]
> **Priority Note**: Always specify if a task is "Critical" for mobile responsiveness.
