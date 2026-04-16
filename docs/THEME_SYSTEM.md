# Hệ Thống Multi-Theme Portfolio (Theme Engine)

Tài liệu này ghi lại cấu trúc và tiến độ triển khai hệ thống đa giao diện của dự án Radiant Portfolio.

## 1. Trạng thái hiện tại (Updated: 2026-04-13)
- [x] **Database Schema**: Đã triển khai bảng `themes` (registry) và tích hợp vào `site_settings`.
- [x] **SiteContext**: Hoàn tất bộ quản lý cấu hình tập trung, hỗ trợ Dynamic Theme, Maintenance Mode, và Custom CSS.
- [x] **Dynamic Theme Resolver**: Refactor `ThemeEntry.tsx` sang cơ chế Hook (`useThemePages`) để tải giao diện theo Database.
- [x] **Theme Management UI**: Tạo trang quản lý giao diện trong Admin (`/admin/themes`) để kích hoạt theme bằng UI.

## 2. Cấu trúc Database (Supabase)
### Bảng `public.themes`
- `id` (PK): Mã định danh (ví dụ: `radiant`, `minimal`).
- `name`: Tên hiển thị của giao diện.
- `preview_image_url`: Ảnh demo.
- `is_active`: Trạng thái cho phép sử dụng.

### Bảng `public.site_settings`
- `active_theme_id`: Liên kết (FK) tới bảng `themes` để xác định theme đang chạy.

## 3. Quy trình thêm Theme mới (Dành cho AI/Developer)
Để thêm một giao diện mới (ví dụ: `galaxy`):
1. **Database**: Thêm một dòng vào bảng `public.themes` với id là `galaxy`.
2. **Files**: Tạo thư mục mới tại `src/themes/galaxy/pages/` và copy các file Page mẫu từ `src/themes/radiant/pages/`.
3. **Register**: Mở `src/themes/ThemeEntry.tsx`, thêm `galaxy` vào `themesRegistry` và import các Page tương ứng.
4. **Custom**: Chỉnh sửa CSS/Layout trong thư mục `src/themes/galaxy/` để tạo phong cách riêng.

## 4. Các lưu ý quan trọng
- **Fallback**: Nếu một theme chưa được code hoàn thiện, hệ thống sẽ tự động dùng theme `radiant` làm nền tảng để tránh lỗi.
- **Performance**: Sử dụng `React.lazy` đảm bảo người dùng chỉ tải code của theme đang hoạt động.
- **Scalability**: Hệ thống này cho phép mở rộng không giới hạn số lượng giao diện mà không làm nặng ứng dụng chính.

## 5. Các bước tiếp theo (Next Steps)
1. Triển khai Layout thực tế cho theme **Minimalist** (Focus: B&W, Typography cao cấp).
2. Triển khai Layout cho theme **Editorial** (Focus: High-end Magazine, Serif Font).
3. Thêm tính năng "Preview" (Xem trước giao diện chưa cần kích hoạt) trong trang Admin.
