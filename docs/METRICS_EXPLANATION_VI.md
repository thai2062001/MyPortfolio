# Trang Quản Lý Chỉ Số Thống Kê (Metrics)

## 📊 Trang này dùng để quản lý cái gì?

Trang **Chỉ số thống kê** dùng để quản lý các con số, thống kê hiển thị trên phần **"Results That Speak"** (Kết quả nói lên tất cả) ở trang chủ.

### Ví dụ các chỉ số:

- **150%** - Average Revenue Increase (Tăng doanh thu trung bình)
- **45M+** - Marketing Revenue Generated (Doanh thu marketing tạo ra)
- **4.2x** - Average Campaign ROAS (ROAS trung bình của chiến dịch)
- **280%** - Organic Traffic Growth (Tăng trưởng traffic organic)

## 🎯 Chức năng chính

### 1. **Thêm chỉ số mới**

- Nhấn nút "Thêm mới"
- Điền các thông tin:
  - **Giá trị**: Con số hiển thị (ví dụ: 150%, 45M+, 4.2x)
  - **Nhãn (Tiếng Anh)**: Mô tả bằng tiếng Anh
  - **Nhãn (Tiếng Nhật)**: Mô tả bằng tiếng Nhật
  - **Màu sắc**: Chọn màu để làm nổi bật (sage, blue, green, purple, red, yellow, pink, indigo)
  - **Thứ tự hiển thị**: Số thứ tự (0, 1, 2, 3...)
  - **Công khai**: Tích để hiển thị trên trang chủ

### 2. **Sửa chỉ số**

- Nhấn nút "Sửa" trên card chỉ số
- Thay đổi thông tin cần thiết
- Nhấn "Lưu"

### 3. **Xóa chỉ số**

- Nhấn nút thùng rác (🗑️) trên card chỉ số
- Xác nhận xóa

### 4. **Bật/Tắt công khai**

- Nhấn nút "Công khai" hoặc "Nháp" trên card
- Nếu là "Công khai" → hiển thị trên trang chủ
- Nếu là "Nháp" → ẩn khỏi trang chủ

### 5. **Sắp xếp thứ tự**

- Dùng trường "Thứ tự hiển thị" để sắp xếp
- Số nhỏ hơn sẽ hiển thị trước

## 🎨 Cách chọn màu sắc

Các màu có sẵn:

- **text-sage** - Xanh lá (mặc định)
- **text-blue-600** - Xanh dương
- **text-green-600** - Xanh lá cây
- **text-purple-600** - Tím
- **text-red-600** - Đỏ
- **text-yellow-600** - Vàng
- **text-pink-600** - Hồng
- **text-indigo-600** - Chàm

## 📱 Cách hiển thị trên trang chủ

Các chỉ số sẽ hiển thị:

- **Desktop**: 4 cột (150%, 45M+, 4.2x, 280%)
- **Mobile**: 2 cột

Chỉ những chỉ số có trạng thái "Công khai" mới hiển thị.

## 💾 Dữ liệu mẫu

Đã có 4 chỉ số mẫu sẵn:

1. 150% - Average Revenue Increase (text-sage)
2. 45M+ - Marketing Revenue Generated (text-gold)
3. 4.2x - Average Campaign ROAS (text-sage)
4. 280% - Organic Traffic Growth (text-gold)

Bạn có thể:

- Chỉnh sửa các chỉ số này
- Thêm chỉ số mới
- Xóa chỉ số không cần

## 🔄 Quy trình sử dụng

1. **Thêm chỉ số mới** → Nhấn "Thêm mới"
2. **Điền thông tin** → Giá trị, nhãn EN, nhãn JA, màu, thứ tự
3. **Lưu** → Nhấn "Lưu"
4. **Kiểm tra trang chủ** → Chỉ số sẽ hiển thị ngay

## ⚠️ Lưu ý

- Tất cả các trường đều bắt buộc phải điền
- Giá trị nên ngắn gọn (ví dụ: 150%, 45M+, 4.2x)
- Nhãn nên mô tả rõ ràng ý nghĩa của chỉ số
- Thứ tự hiển thị ảnh hưởng đến vị trí trên trang chủ
- Chỉ những chỉ số "Công khai" mới hiển thị cho khách

## 🐛 Lỗi layout đã fix

✅ Form input giờ hiển thị đúng trên mobile
✅ Nút "Thêm mới" không bị lệch
✅ Card chỉ số hiển thị cân đối
✅ Nút Sửa/Xóa không bị tràn
✅ Text tiếng Việt đầy đủ
