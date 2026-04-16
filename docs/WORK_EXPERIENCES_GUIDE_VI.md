# Hướng dẫn Quản lý Kinh nghiệm làm việc (Work Experiences)

## 📋 Trang này dùng để quản lý cái gì?

Trang **Kinh nghiệm làm việc** dùng để quản lý các vị trí công việc và thành tích hiển thị trên phần **"Experience Highlights"** (Kinh nghiệm nổi bật) ở trang chủ.

### Ví dụ các kinh nghiệm:

- **GMO Nikko Vietnam** (2023 - Hiện tại)
  - Quản lý các chiến dịch quảng cáo cho các khách hàng lớn
  - Công việc chính: Internal Communication, Ad Campaign Execution, Reporting and Automation, Work Efficiency Optimization

- **Nha Sach Service Joint Stock Company** (2022 - 2023)
  - Phát triển chiến lược viết web SEO
  - Công việc chính: SEO Web Writing Strategy, Topic Research, Podcast Development, Content Promotion, Storytelling

## 🎯 Chức năng chính

### 1. **Thêm kinh nghiệm mới**

- Nhấn nút "Thêm mới"
- Điền các thông tin:
  - **Tên công ty**: Tên công ty làm việc
  - **Thời gian làm việc**: Ví dụ: 2023 - Hiện tại
  - **Mô tả (Tiếng Anh)**: Mô tả chi tiết về vị trí và thành tích
  - **Mô tả (Tiếng Nhật)**: Mô tả bằng tiếng Nhật
  - **Thứ tự hiển thị**: Số thứ tự (0, 1, 2...)
  - **Công khai**: Tích để hiển thị trên trang chủ

### 2. **Thêm công việc chính (Tasks)**

- Sau khi lưu kinh nghiệm, bạn có thể thêm các công việc chính
- Mỗi công việc có:
  - **Công việc (Tiếng Anh)**: Tên công việc bằng tiếng Anh
  - **Công việc (Tiếng Nhật)**: Tên công việc bằng tiếng Nhật
- Có thể sắp xếp thứ tự công việc bằng nút mũi tên lên/xuống
- Có thể xóa công việc bằng nút thùng rác

### 3. **Sửa kinh nghiệm**

- Nhấn nút "Sửa" trên card kinh nghiệm
- Thay đổi thông tin cần thiết
- Nhấn "Lưu"

### 4. **Xóa kinh nghiệm**

- Nhấn nút thùng rác (🗑️) trên card kinh nghiệm
- Xác nhận xóa

### 5. **Bật/Tắt công khai**

- Nhấn nút "Công khai" hoặc "Nháp" trên card
- Nếu là "Công khai" → hiển thị trên trang chủ
- Nếu là "Nháp" → ẩn khỏi trang chủ

### 6. **Xem chi tiết**

- Nhấn nút "Xem chi tiết" để xem mô tả đầy đủ
- Nhấn "Ẩn chi tiết" để ẩn

## 📱 Cách hiển thị trên trang chủ

Các kinh nghiệm sẽ hiển thị:

- **Timeline layout**: Xen kẽ trái phải (alternating)
- **Desktop**: Hiển thị đầy đủ với timeline
- **Mobile**: Hiển thị dạng danh sách

Chỉ những kinh nghiệm có trạng thái "Công khai" mới hiển thị.

## 💾 Dữ liệu mẫu

Đã có 2 kinh nghiệm mẫu sẵn:

### 1. GMO Nikko Vietnam (2023 - Hiện tại)

- Mô tả: Quản lý các chiến dịch quảng cáo cho Ajinomoto, Don Quijote, Airtrip
- Công việc chính:
  - Internal Communication
  - Ad Campaign Execution
  - Reporting and Automation
  - Work Efficiency Optimization

### 2. Nha Sach Service Joint Stock Company (2022 - 2023)

- Mô tả: Phát triển chiến lược viết web SEO
- Công việc chính:
  - SEO Web Writing Strategy
  - Planning Topic Research and Style Guide Development
  - Internal PR Podcast Development
  - Content Promotion
  - Storytelling

Bạn có thể:

- Chỉnh sửa các kinh nghiệm này
- Thêm kinh nghiệm mới
- Xóa kinh nghiệm không cần

## 🔄 Quy trình sử dụng

1. **Thêm kinh nghiệm mới** → Nhấn "Thêm mới"
2. **Điền thông tin** → Tên công ty, thời gian, mô tả EN, mô tả JA, thứ tự
3. **Lưu** → Nhấn "Lưu"
4. **Thêm công việc chính** → Nhấn "Sửa" → Thêm công việc
5. **Kiểm tra trang chủ** → Kinh nghiệm sẽ hiển thị ngay

## ⚠️ Lưu ý

- Tất cả các trường đều bắt buộc phải điền
- Mô tả nên chi tiết và rõ ràng
- Công việc chính nên liệt kê các nhiệm vụ chính
- Thứ tự hiển thị ảnh hưởng đến vị trí trên trang chủ
- Chỉ những kinh nghiệm "Công khai" mới hiển thị cho khách

## 🐛 Lỗi layout đã fix

✅ Form input giờ hiển thị đúng trên mobile
✅ Nút "Thêm mới" không bị lệch
✅ Card kinh nghiệm hiển thị cân đối
✅ Nút Sửa/Xóa không bị tràn
✅ Text tiếng Việt đầy đủ
✅ Công việc chính hiển thị gọn gàng
✅ Nút "Xem chi tiết" để xem mô tả đầy đủ

## 📊 Cấu trúc dữ liệu

### Bảng work_experiences

- `id`: UUID
- `company_name`: Tên công ty
- `duration`: Thời gian làm việc
- `description_en`: Mô tả tiếng Anh
- `description_ja`: Mô tả tiếng Nhật
- `order_index`: Thứ tự hiển thị
- `is_published`: Công khai hay nháp

### Bảng work_experience_tasks

- `id`: UUID
- `experience_id`: ID của kinh nghiệm
- `task_en`: Công việc tiếng Anh
- `task_ja`: Công việc tiếng Nhật
- `order_index`: Thứ tự công việc

## 🔗 Liên kết

- Admin page: `/admin/work-experiences`
- Frontend: Hiển thị trên trang chủ phần "Experience Highlights"
- Seed data: `SEED_WORK_EXPERIENCES.sql`
