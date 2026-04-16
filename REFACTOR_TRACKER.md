# 🔄 REFACTOR TRACKER: Multi-Theme & Core Architecture

Trạng thái hiện tại: **HOÀN TẤT TÁI CẤU TRÚC CORE & THEMES** ✅

---

## 🛠️ Giai đoạn 1: Xây dựng Bộ não (Core Extraction) - ✅ HOÀN TẤT
- [x] **1.x. Infrastructure Setup**: ✅ Đã xong cấu trúc folder.
- [x] **1.1. API Services (`src/core/api`)**: ✅ Đã hoàn thành `portfolio.ts` với đầy đủ methods.
- [x] **1.2. Shared Hooks (`src/core/hooks`)**: ✅ Đã hoàn thành `usePortfolio.ts` (usePortfolioData).
- [x] **1.3. Global Types (`src/core/types`)**: ✅ Đã hoàn thành `database.ts`.

---

## 🎨 Giai đoạn 2: Di dời Theme Radiant (Migration) - ✅ HOÀN TẤT
- [x] **2.1. Theme Components**: ✅ Đã chuyển toàn bộ components vào `themes/radiant/components`.
- [x] **2.2. Theme Pages**: ✅ Đã chuyển toàn bộ pages vào `themes/radiant/pages`.
- [x] **2.3. Path Update**: ✅ Đã cập nhật `App.tsx` và sửa `import` hàng loạt.
- [x] **2.4. Core Hook Integration**: ✅ Đã hoàn thành 100%. Toàn bộ theme không còn dùng Supabase trực tiếp.
    - [x] **Home Sections**: Hero, Expertise, Stats, Timeline, Testimonials...
    - [x] **Portfolio Sections**: Grid, Clients, FAQ.
    - [x] **Shared Components**: Footer, Navbar, SkillContactModal.
    - [x] **Data Persistence**: Moved `insert` logic for contact form to Core API.
    - [x] **Cleanup**: Removed unused legacy `MetricsSection.tsx`.

---

## 🛠️ Giai đoạn 3: Kiểm soát & Đóng gói (Standardization) - ✅ HOÀN TẤT
- [x] **3.1. Admin Persistence**: Kiểm tra toàn diện Admin Panel để đảm bảo hoạt động bình thường. (Admin vẫn ổn định)
- [x] **3.2. Entry Point Configuration**: Chuẩn hóa file config `src/core/config/theme.config.ts` và `ThemeEntry.tsx`.
- [x] **3.3. Clean up legacy files**: Đã xóa các file không dùng (`skill-queries`, `project-tags`). Các file khác giữ lại cho Admin.

---

- **Hoàn tất Dự án**: Đã hoàn thành 100% việc tách biệt Core & Themes. Project giờ đây cực kỳ sạch sẽ và dễ mở rộng.
- **Dọn dẹp**: Đã dọn dẹp các query dư thừa. Các file còn lại được giữ lại phục vụ ổn định cho Admin Panel.
- **Kiến trúc**: Đã chuẩn hóa Entry Point (`ThemeEntry.tsx`), sẵn sàng cho việc thêm nhiều Theme mới.
- **Tiến độ**: 100% project. Hệ thống đã ổn định và sẵn sàng vận hành.
