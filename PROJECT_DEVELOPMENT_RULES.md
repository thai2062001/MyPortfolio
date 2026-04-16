# PROJECT DEVELOPMENT RULES & GUIDELINES

This document contains the mandatory rules for every development task in this project (Frontend & Backend).

## 1. Responsive Excellence (Frontend)
- **Rule**: Every piece of code must be fully responsive across **PC, Laptop, Tablet, and Mobile** from the moment it is written.
- **Implementation**: Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) and flexible layouts (Flexbox/Grid). Always test for "touch vs mouse" interactions.

## 2. Visual Consistency
- **Rule**: UI must strictly adhere to the system's **Core Color Palette**.
- **Implementation**: Use predefined theme colors (e.g., `sage`, `vibe-pink`, `heading`, `background`) defined in `tailwind.config.ts`. Avoid ad-hoc color codes.

## 3. Code Integrity & Cleanliness
- **Rule**: Maintain **Clean Code** and refactor immediately. Avoid "code debt" or "trash code".
- **Implementation**: Follow TypeScript best practices, remove unused imports, and keep functions small and focused.

## 4. Database Schema Alignment
- **Rule**: All data operations must strictly follow the schema defined in `SUPABASE_SCHEMA_CONSOLIDATED.sql`.
- **Implementation**: Do not guess table names or columns. Always refer to the consolidated SQL file for truth.

## 5. Component Reusability
- **Rule**: Automatically extract frequently used UI patterns into **Reusable Components**.
- **Implementation**: Before creating a new UI element, check if a similar one exists. If it's a pattern used more than twice, move it to `@/components/shared/` or `@/components/ui/`.

## 6. Development Port
- **Rule**: The development server MUST always run on **port 8080**.
- **Implementation**: Ensure all browser interactions and local previews use `http://localhost:8080`.

---

# QUY TẮC PHÁT TRIỂN DỰ ÁN

Tài liệu này chứa các quy tắc bắt buộc cho mọi nhiệm vụ phát triển trong dự án này (Frontend & Backend).

## 1. Tối ưu Hiển thị (Frontend)
- **Quy tắc**: Mọi đoạn code phải đảm bảo **Responsive** hoàn toàn cho **PC, Laptop, Tablet và Mobile** ngay từ khi viết.
- **Thực hiện**: Sử dụng các tiền tố responsive của Tailwind (`sm:`, `md:`, `lg:`, `xl:`) và layout linh hoạt (Flex/Grid). Luôn kiểm tra tương tác giữa thiết bị cảm ứng và chuột.

## 2. Nhất quán về Hình ảnh
- **Quy tắc**: UI phải bám sát tuyệt đối vào **Bảng màu chủ đạo** của hệ thống.
- **Thực hiện**: Sử dụng các màu đã định nghĩa trong theme (ví dụ: `sage`, `vibe-pink`, `heading`, `background`) trong `tailwind.config.ts`. Tránh dùng các mã màu lẻ tẻ.

## 3. Độ sạch và Chất lượng Code
- **Quy tắc**: Luôn giữ **Clean Code**, refactor ngay lập tức để tránh code rác.
- **Thực hiện**: Tuân thủ best practices của TypeScript, xóa import không dùng, và giữ các function nhỏ gọn, tập trung vào một nhiệm vụ.

## 4. Tuân thủ Cấu trúc Database
- **Quy tắc**: Mọi thao tác dữ liệu phải bám sát cấu trúc được lưu trong file `SUPABASE_SCHEMA_CONSOLIDATED.sql`.
- **Thực hiện**: Không đoán tên bảng hay tên cột. Luôn tham chiếu tới file SQL tổng hợp để đảm bảo tính chính xác.

## 5. Tái sử dụng Component
- **Quy tắc**: Tự động tách các mẫu UI dùng nhiều lần thành **Component tái sử dụng**.
- **Thực hiện**: Trước khi tạo element mới, kiểm tra xem có element tương tự không. Nếu một mẫu UI dùng quá 2 lần, hãy đưa vào thư mục `@/components/shared/` hoặc `@/components/ui/`.

## 6. Port Môi trường Phát triển
- **Quy tắc**: Server phát triển PHẢI luôn chạy ở **port 8080**.
- **Thực hiện**: Đảm bảo mọi tương tác trình duyệt và xem trước local sử dụng `http://localhost:8080`.

---
*Yêu cầu: AI phải đọc và tuân thủ các quy tắc này trước khi thực hiện bất kỳ yêu cầu nào từ người dùng.*

---

## 7. Admin Panel — Critical Rules (EN/VI)

> These rules were derived from real bugs found and fixed. Violating them WILL cause regressions.

### 7.1 — One AdminLayout Per Route
- **Rule**: Never nest `<AdminLayout>` inside another `<AdminLayout>`.
- **Pattern**: If a Management component is the direct route target in `App.tsx`, it owns the `<AdminLayout>`. Intermediate Page wrapper files should be eliminated.

### 7.2 — useAdminCRUD Auto-Fetches
- **Rule**: Do NOT call `fetchData()` manually in a `useEffect` inside pages that use `useAdminCRUD`.
- **Why**: The hook already calls `fetchData()` on mount internally. Manual calls cause double network requests.
- **Exception**: Multi-table pages (like `SkillsAdmin`, `Projects`) that don't use the hook may call their own fetch.

### 7.3 — Flex Scroll Requires min-h-0
- **Rule**: Any scrollable flex child MUST have `min-h-0` in addition to `overflow-y-auto`.
- **Pattern**: `<div className="flex-1 overflow-y-auto min-h-0">` — without `min-h-0`, the div grows with content and never scrolls.

### 7.4 — AdminStatusToggle Props
- **Rule**: Use `isPublished` + `onToggle`, NOT `isActive` + `onChange`.
- **Correct**: `<AdminStatusToggle isPublished={bool} onToggle={(val) => ...} />`

### 7.5 — Form Component Padding
- **Rule**: Form components (`ClientForm`, `ToolItemForm`, etc.) must NOT have outer padding.
- **Why**: `AdminDialogForm` adds `p-6 md:p-10` to the scroll area. Inner padding causes double spacing.
- **Correct outer wrapper**: `<div className="space-y-10 text-left">` — no `p-` classes.

### 7.6 — Table Names Must Match Schema
- **Rule**: Always verify table names against `SUPABASE_SCHEMA_CONSOLIDATED.sql` before writing `tableName` in `useAdminCRUD`.
- **Known pitfall**: `expertise_strategic_skills` (NOT `strategic_skills`).

### 7.7 — Type Field Names Are i18n
- **Rule**: Many entity types use `name_en`/`name_ja` instead of `name`. Always check `src/types/admin.ts`.
- **Pattern for renders**:
  ```tsx
  {lang === 'ja' ? (item.name_ja || item.name_en) : item.name_en}
  ```

### 7.8 — AdminDialogForm Valid Props Only
- **Rule**: Do NOT pass undeclared props to `AdminDialogForm`. It will silently ignore them.
- **Valid props**: `open`, `onOpenChange`, `title`, `description`, `tabs`, `activeTab`, `onTabChange`, `onSave`, `saving`, `children`, `sidebarTitle`, `sidebarSubtitle`, `sidebarIcon`, `saveLabel`.
- **Invalid (removed)**: `footerMetadata`.

### 7.9 — Plain English UI Wording
- **Rule**: Use standard, simple, and common English wording for all UI elements (buttons, labels, descriptions, placeholders) in the Admin Panel.
- **Pattern**: Avoid "sci-fi" or "matrix-themed" terminology. Use "Save Changes" instead of "Synchronize Data", "Edit" instead of "Refinement", "Settings" instead of "Protocol", "Loading" instead of "Syncing Grid".

---

### 7. Bảng Admin — Quy tắc Critical (VI)

> Các quy tắc này được rút ra từ bug thực tế đã phát hiện và fix. Vi phạm SẼ gây regression.

- **7.1 — Một AdminLayout mỗi route**: Không bao giờ lồng `<AdminLayout>` vào nhau.
- **7.2 — useAdminCRUD tự fetch**: Không gọi `fetchData()` thủ công trong page dùng hook này.
- **7.3 — Flex scroll cần min-h-0**: Scrollable flex child phải có `min-h-0` cùng `overflow-y-auto`.
- **7.4 — AdminStatusToggle props**: Dùng `isPublished` + `onToggle`, không phải `isActive` + `onChange`.
- **7.5 — Form component không có outer padding**: `AdminDialogForm` đã xử lý padding.
- **7.6 — Tên bảng phải khớp schema**: Kiểm tra `SUPABASE_SCHEMA_CONSOLIDATED.sql` trước khi viết `tableName`.
- **7.7 — Field i18n dùng name_en/name_ja**: Không dùng `.name` cho entity đa ngôn ngữ.
- **7.8 — Props AdminDialogForm phải valid**: Không truyền prop ngoài interface.
- **7.9 — Từ vựng UI phổ thông (Plain English)**: Bắt buộc dùng tiếng Anh phổ thông, chuẩn mực của UI/UX (vd: "Save Changes", "Edit", "Settings"). Tuyệt đối không dùng từ ngữ khoa học viễn tưởng hay ma trận (như "Synchronize Data", "Protocol", "Atmosphere", "Refinement").

---

## 8. Multi-Theme Architecture: Core & Themes (EN/VI)

### 8.1 — Source of Truth (Core)
- **Rule**: All business logic, database types, and Supabase service calls MUST reside in `src/core/`.
- **Implementation**: Do not write raw Supabase queries inside Theme components. Use shared hooks/APIs from `@/core/`.
- **Quy tắc**: Mọi business logic, database types, và hàm gọi Supabase PHẢI nằm trong `src/core/`. Không viết query Supabase trực tiếp trong component của Theme.

### 8.2 — Theme Isolation
- **Rule**: Each theme must be self-contained within `src/themes/[theme-name]/`. 
- **Implementation**: Themes can have their own specialized components and pages, but must rely on `src/core/` for data.
- **Quy tắc**: Mỗi theme phải nằm gọn trong folder riêng `src/themes/[tên-theme]/`. Theme có thể có component riêng nhưng phải dùng dữ liệu từ `src/core/`.

### 8.3 — Type Safety
- **Rule**: Always import entity types (Project, Skill, etc.) from `src/core/types/database.ts`.
- **Quy tắc**: Luôn sử dụng định nghĩa kiểu dữ liệu (Project, Skill...) từ `src/core/types/database.ts` để đảm bảo đồng bộ.

---

### 8. Kiến trúc Đa Theme: Core & Themes (VI)

- **8.1 — Nguồn dữ liệu tập trung (Core)**: Mọi logic xử lý dữ liệu và định nghĩa kiểu (Types) phải nằm trong `src/core/`. Theme chỉ lo việc hiển thị.
- **8.2 — Cô lập Theme**: Mỗi giao diện mới phải được tạo trong folder `src/themes/`. Không trộn lẫn code của các Theme khác nhau.
- **8.3 — An toàn Kiểu dữ liệu**: Tuyệt đối sử dụng Types từ Core để tránh sai sót tên biến giữa các Theme.

---

## 9. AI Agent Communication Standard (EN/VI)

- **Rule**: The AI Agent MUST communicate with the USER exclusively in **Vietnamese** for all chat interactions, explanations, and summaries, unless the USER explicitly permits or requests English.
- **Rule**: Technical terms and code snippets should remain in English (or their original language/Plain English standard), but all surrounding explanations must be in Vietnamese.
- **Quy tắc**: AI Agent PHẢI trao đổi với NGƯỜI DÙNG hoàn toàn bằng **tiếng Việt** trong mọi cuộc hội thoại, giải thích và báo cáo, trừ khi NGƯỜI DÙNG cho phép hoặc yêu cầu sử dụng tiếng Anh.
- **Quy tắc**: Các thuật ngữ kỹ thuật và đoạn mã (code snippets) giữ nguyên tiếng Anh (hoặc ngôn ngữ gốc/chuẩn Plain English), nhưng tất cả các phần giải thích xung quanh phải bằng tiếng Việt.
