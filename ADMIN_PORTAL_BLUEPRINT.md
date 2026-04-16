# ADMIN PORTAL BLUEPRINT

This document outlines the architecture and management logic for the Admin Control Center.

## 1. Governance & Security
- **Authentication**: Powered by **Supabase Auth**.
- **Access Control**: Handled by `AuthProvider` and `ProtectedRoute` component.
- **Route Guarding**: Admin routes are wrapped in `ProtectedRoute`, which checks for a valid session before rendering.

## 2. Data Management Strategy
Unlike the public site, the Admin Portal prioritizes **Integrity and Recency** over speed.

### Real-time Sync Patterns:
- **No Global Cache**: Data is fetched using direct `supabase` client calls within `useEffect`. This ensures every visit shows the current database state.
- **Silent Refetching**: After a mutation (Create/Update/Delete), the UI triggers a background re-fetch (`fetchData(true)`) to stay in sync without full-page reloads.
- **Optimistic UI**: Simple toggles (Visibility, Featured) update local state immediately for instant feedback, while the API call runs in the background.

## 3. Infrastructure & Shared Components
- **ResponsiveDataTable**: A high-level abstraction for listing items. Supports:
  - Drag & Drop reordering (via `order_index`).
  - Search & Filter logic within the client.
  - Mobile card-view vs Desktop table-view.
- **MediaInput**: Centralized Cloudinary upload widget used across all forms.
- **Form Layouts**: Standardized using `ResponsiveFormLayout` to handle complex nested fields (like project results or milestones).

## 4. Specific Management Modules
### Hero Atmosphere Architect
- Supports **Multiple Layouts**: Admin can switch the entire Hero look by changing a `layout_key`.
- **JSON Config**: Layout-specific parameters (alignment, spacing, opacity) are stored as JSON in the `layout_config` column.
- **Live Preview**: Real-time rendering of changes before clicking Save.

### Expertise & Tech Matrix
- **Category Grouping**: Skills are linked to Clusters.
- **Icon Management**: Supports both URL-based icons and Cloudinary assets.

### Automated Localization (i18n)
- **Magic Auto-Sync**: Integration with an AI-translation utility (`translateFields`) to automatically generate Japanese (JA) content from English (EN) input.

## 5. Operations Checklist for new Developers
- **Environment**: Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Database Rules (RLS)**: Ensure `page_sections`, `projects`, etc., have `AUTHENTICATED` role permissions for INSERT/UPDATE/DELETE.
- **Deployment**: Any changes in the Admin UI should be validated against the `PageSection` type to avoid breaking the Public dynamic renderer.

---
*Goal: The Admin Portal is the "Engine Room" where the brand narrative is constructed and deployed.*

<br/>

# BẢN THIẾT KẾ ADMIN PORTAL

Tài liệu này phác thảo kiến trúc và logic quản trị cho Trung tâm Điều khiển Admin.

## 1. Quản trị & Bảo mật
- **Xác thực (Authentication)**: Sử dụng **Supabase Auth**.
- **Kiểm soát truy cập**: Được xử lý bởi `AuthProvider` và component `ProtectedRoute`.
- **Bảo vệ Route**: Các route admin được bọc trong `ProtectedRoute`, kiểm tra session hợp lệ trước khi render.

## 2. Chiến lược Quản lý Dữ liệu
Khác với trang public, Admin Portal ưu tiên **Tính Toàn vẹn và Độ mới (Recency)** hơn là tốc độ.

### Các mẫu Sync thời gian thực:
- **Không sử dụng Cache toàn cầu**: Dữ liệu được tải bằng cách gọi trực tiếp client `supabase` trong `useEffect`. Điều này đảm bảo mỗi lần truy cập đều hiển thị trạng thái hiện tại của database.
- **Tải lại ngầm (Silent Refetching)**: Sau một hành động thay đổi (Tạo/Sửa/Xóa), UI sẽ kích hoạt tải lại ngầm (`fetchData(true)`) để đồng bộ mà không cần tải lại toàn bộ trang.
- **Optimistic UI**: Các nút gạt đơn giản (Hiển thị, Featured) cập nhật state cục bộ ngay lập tức để phản hồi nhanh, trong khi API call chạy ngầm.

## 3. Hạ tầng & Các Component dùng chung
- **ResponsiveDataTable**: Một lớp trừu tượng cao cấp để liệt kê các mục. Hỗ trợ:
  - Thay đổi thứ tự bằng Kéo & Thả (qua `order_index`).
  - Logic Tìm kiếm & Lọc phía client.
  - Chế độ xem thẻ (card-view) trên di động vs bảng (table-view) trên máy tính.
- **MediaInput**: Widget tải ảnh Cloudinary tập trung được sử dụng trên tất cả các form.
- **Form Layouts**: Được tiêu chuẩn hóa bằng `ResponsiveFormLayout` để xử lý các trường lồng nhau phức tạp (như kết quả dự án hoặc các cột mốc).

## 4. Các Module Quản lý Cụ thể
### Kiến trúc sư Không khí Hero (Hero Atmosphere Architect)
- Hỗ trợ **Nhiều Layout**: Admin có thể thay đổi toàn bộ diện mạo Hero bằng cách đổi `layout_key`.
- **Cấu hình JSON**: Các tham số riêng biệt của layout (căn lề, khoảng cách, độ mờ) được lưu dưới dạng JSON trong cột `layout_config`.
- **Xem trước Trực tiếp (Live Preview)**: Render thời gian thực các thay đổi trước khi nhấn Lưu.

### Ma trận Kỹ năng & Công nghệ
- **Phân nhóm Danh mục**: Các kỹ năng được liên kết với các Cụm (Clusters).
- **Quản lý Icon**: Hỗ trợ cả icon dạng URL và tài sản từ Cloudinary.

### Bản địa hóa Tự động (i18n)
- **Magic Auto-Sync**: Tích hợp với tiện ích dịch thuật AI (`translateFields`) để tự động tạo nội dung tiếng Nhật (JA) từ đầu vào tiếng Anh (EN).

## 5. Danh sách kiểm tra cho Developer mới
- **Môi trường**: Cần `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Quy tắc cơ sở dữ liệu (RLS)**: Đảm bảo các bảng `page_sections`, `projects`, v.v., có quyền INSERT/UPDATE/DELETE cho role `AUTHENTICATED`.
- **Triển khai (Deployment)**: Bất kỳ thay đổi nào trong Admin UI cũng nên được kiểm tra chéo với kiểu dữ liệu `PageSection` để tránh làm hỏng trình render động phía Public.

---
*Mục tiêu: Admin Portal là "Phòng Động Cơ" nơi câu chuyện thương hiệu được xây dựng và triển khai.*
