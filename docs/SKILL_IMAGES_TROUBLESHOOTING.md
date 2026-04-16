# Skill Images Upload Troubleshooting

## Error: 400 Bad Request

### Cause

Upload preset không được cấu hình đúng hoặc không tồn tại trên Cloudinary.

### Solution

1. **Kiểm tra Cloudinary Upload Preset**
   - Vào Cloudinary Dashboard
   - Settings > Upload > Upload presets
   - Tìm preset `portfolio_icons`
   - Nếu không tồn tại, tạo mới:
     - Name: `portfolio_icons`
     - Unsigned: Yes (để cho phép upload từ frontend)
     - Folder: `portfolio/skills` (optional)

2. **Kiểm tra Environment Variables**

   ```
   VITE_CLOUDINARY_CLOUD_NAME=dpdzbuiml
   ```

   - Đảm bảo cloud name đúng

3. **Kiểm tra CORS Settings**
   - Cloudinary > Settings > Security
   - Đảm bảo domain của bạn được phép upload

## Error: Upload Failed - Network Error

### Cause

Kết nối mạng bị gián đoạn hoặc file quá lớn.

### Solution

1. **Kiểm tra kích thước file**
   - Max: 5MB
   - Nếu file lớn hơn, nén ảnh trước

2. **Kiểm tra kết nối mạng**
   - Đảm bảo internet connection ổn định
   - Thử upload lại

3. **Kiểm tra browser console**
   - Mở DevTools (F12)
   - Xem Network tab để kiểm tra request

## Error: Image Not Showing After Upload

### Cause

URL không hợp lệ hoặc Cloudinary account bị disable.

### Solution

1. **Kiểm tra URL**
   - URL phải bắt đầu với `https://res.cloudinary.com/`
   - Kiểm tra URL có hợp lệ không

2. **Kiểm tra Cloudinary Account**
   - Đăng nhập vào Cloudinary Dashboard
   - Kiểm tra account status
   - Kiểm tra quota usage

3. **Kiểm tra RLS Policies**
   - Đảm bảo skill được publish
   - Kiểm tra database permissions

## Error: WebP Conversion Failed

### Cause

Browser không hỗ trợ Canvas API hoặc file bị corrupt.

### Solution

1. **Kiểm tra browser support**
   - Canvas API được hỗ trợ trên tất cả modern browsers
   - Thử trên browser khác

2. **Kiểm tra file**
   - Đảm bảo file là ảnh hợp lệ
   - Thử upload ảnh khác

3. **Kiểm tra console**
   - Mở DevTools
   - Xem error message chi tiết

## Multiple Files Upload Issues

### Issue: Chỉ một số file được upload

**Solution:**

- Kiểm tra console để xem file nào bị lỗi
- Mỗi file phải < 5MB
- Thử upload từng file một

### Issue: Upload bị hang

**Solution:**

- Đợi upload hoàn tất
- Không refresh page trong khi uploading
- Kiểm tra network speed

## Best Practices

1. **Trước khi upload**
   - Nén ảnh (< 5MB)
   - Sử dụng định dạng phổ biến (JPG, PNG)
   - Kiểm tra kích thước ảnh

2. **Trong khi upload**
   - Không đóng tab
   - Không refresh page
   - Đợi toast notification

3. **Sau khi upload**
   - Kiểm tra ảnh hiển thị đúng
   - Thêm alt text
   - Đặt cover image nếu cần

## Debug Mode

Để debug upload process:

1. Mở DevTools (F12)
2. Vào Console tab
3. Xem các log messages
4. Kiểm tra Network tab để xem request/response

## Contact Support

Nếu vấn đề vẫn không giải quyết:

- Kiểm tra Cloudinary documentation
- Liên hệ Cloudinary support
- Kiểm tra project logs
