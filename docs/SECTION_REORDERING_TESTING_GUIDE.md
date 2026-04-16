# Section Reordering - PHASE 3: Testing Guide

---

## 🧪 Tổng Quan

Hướng dẫn test tính năng Section Reordering với 4 test cases chính.

---

## ✅ Pre-Testing Checklist

- [ ] Database: SQL final đã chạy trên Supabase
- [ ] Frontend: Tất cả files PHASE 2 đã tạo
- [ ] Dependencies: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [ ] Build: `npm run build` thành công
- [ ] Dev server: `npm run dev` chạy
- [ ] Admin role: User đã set role = 'admin' trong profiles table
- [ ] URL: Có thể truy cập `/admin/sections`

---

## 🧪 TEST 1: Drag & Drop (Reorder)

### Mục Đích

Kiểm tra drag & drop hoạt động đúng, order cập nhật, UI responsive.

### Steps

1. **Mở page**
   - Vào `http://localhost:3000/admin/sections`
   - Chọn tab **Home Page**
   - Verify: Thấy 8 sections (Hero, About, Metrics, Services, Skills, Testimonials, Timeline, Contact)

2. **Drag section**
   - Kéo **About Section** (vị trí 1) lên trên **Hero Section** (vị trí 0)
   - Verify: UI cập nhật ngay, About ở vị trí 0, Hero ở vị trí 1

3. **Check Network**
   - Mở DevTools → Network tab
   - Kéo section khác
   - Verify: Thấy 1 RPC call `reorder_page_sections`
   - Response: `{"success": true, "message": "Sections reordered successfully"}`

4. **Verify Database**
   - Chạy SQL:

   ```sql
   select section_name, order_index
   from public.page_sections
   where page_type = 'home'
   order by order_index;
   ```

   - Verify: Order khớp với UI

5. **Refresh Page**
   - F5 refresh
   - Verify: Order vẫn giữ nguyên (không reset)

### Expected Result

✅ Drag & drop hoạt động, order cập nhật, database sync

---

## 🧪 TEST 2: Move Section (Between Pages)

### Mục Đích

Kiểm tra move section từ Home → Portfolio, cả 2 page cập nhật đúng.

### Steps

1. **Mở Home page**
   - Tab **Home Page**
   - Verify: 8 sections

2. **Click Move button**
   - Tìm **Metrics Section** (vị trí 2)
   - Click arrow button (Move to Portfolio)
   - Verify: Metrics biến mất từ Home, toast "Section moved successfully"

3. **Check Home page**
   - Verify: Còn 7 sections
   - Verify: Order tự động điều chỉnh [0, 1, 2, 3, 4, 5, 6]
   - Verify: Không có gap

4. **Check Portfolio page**
   - Click tab **Portfolio Page**
   - Verify: Metrics xuất hiện ở cuối (vị trí 5)
   - Verify: Có 6 sections (5 cũ + 1 mới)

5. **Check Network**
   - DevTools → Network
   - Thấy 3 requests:
     - 1 RPC: `move_section_to_page`
     - 2 SELECT: `getSectionsByPage('home')` + `getSectionsByPage('portfolio')`

6. **Verify Database**

   ```sql
   -- Home page
   select count(*) from public.page_sections where page_type = 'home';
   -- Kết quả: 7

   -- Portfolio page
   select count(*) from public.page_sections where page_type = 'portfolio';
   -- Kết quả: 6

   -- Metrics location
   select section_name, page_type, order_index
   from public.page_sections
   where section_key = 'home_metrics';
   -- Kết quả: Metrics, portfolio, 5
   ```

7. **Move back**
   - Tab Portfolio
   - Click arrow trên Metrics
   - Verify: Metrics quay lại Home ở cuối

### Expected Result

✅ Move hoạt động, cả 2 page sync, order tự động điều chỉnh

---

## 🧪 TEST 3: Fixed Section (Cannot Move/Reorder)

### Mục Đích

Kiểm tra fixed section không thể move page khác, không thể đổi vị trí.

### Steps

1. **Identify Fixed Sections**
   - Home: **Hero Section** (is_fixed = true)
   - Portfolio: **Portfolio Grid** (is_fixed = true)

2. **Try to Drag Hero**
   - Tab Home
   - Thử kéo Hero section
   - Verify: Không thể kéo (drag disabled)
   - Verify: Drag handle ẩn
   - Verify: "Fixed" badge hiển thị

3. **Try to Move Hero**
   - Click arrow button trên Hero
   - Verify: Không có button (ẩn)

4. **Try to Reorder with Hero**
   - Kéo About lên trên Hero
   - Verify: Toast error "Cannot change position of fixed sections"
   - Verify: About quay lại vị trí cũ
   - Verify: Hero vẫn ở vị trí 0

5. **Check Database**
   ```sql
   select section_name, is_fixed, order_index
   from public.page_sections
   where page_type = 'home'
   order by order_index;
   ```

   - Verify: Hero vẫn is_fixed = true, order_index = 0

### Expected Result

✅ Fixed section không thể move/reorder, UI feedback rõ ràng

---

## 🧪 TEST 4: Visibility Toggle

### Mục Đích

Kiểm tra toggle visibility (show/hide section).

### Steps

1. **Mở Home page**
   - Tab Home

2. **Toggle Visibility**
   - Tìm **About Section**
   - Click eye icon
   - Verify: Icon đổi thành "eye-off"
   - Verify: Toast "Section hidden"

3. **Check Database**

   ```sql
   select section_name, is_visible
   from public.page_sections
   where section_key = 'home_about';
   ```

   - Verify: is_visible = false

4. **Check Public View**
   - Logout hoặc mở incognito
   - Vào trang home (public)
   - Verify: About section không hiển thị

5. **Toggle Back**
   - Login lại
   - Vào `/admin/sections`
   - Click eye icon trên About
   - Verify: Icon đổi thành "eye"
   - Verify: Toast "Section shown"

6. **Check Public View Again**
   - Refresh public page
   - Verify: About section hiển thị lại

### Expected Result

✅ Visibility toggle hoạt động, public view sync

---

## 🧪 TEST 5: Error Handling

### Mục Đích

Kiểm tra error handling khi có lỗi.

### Steps

1. **Simulate Network Error**
   - DevTools → Network → Offline
   - Thử drag & drop
   - Verify: Toast error "Failed to reorder sections"
   - Verify: UI rollback về state cũ

2. **Simulate Unauthorized**
   - Logout
   - Thử truy cập `/admin/sections`
   - Verify: Redirect hoặc error (tùy setup)

3. **Simulate Invalid Data**
   - DevTools → Console
   - Chạy:
   ```javascript
   // Thử gọi RPC với data sai
   const { data, error } = await supabase.rpc("reorder_page_sections", {
     p_page_type: "home",
     p_sections: [{ id: "invalid-uuid", order_index: 0 }],
   });
   console.log(error);
   ```

   - Verify: Error message rõ ràng

### Expected Result

✅ Error handling hoạt động, UI rollback, toast message

---

## 🧪 TEST 6: Concurrent Operations

### Mục Đích

Kiểm tra khi có 2 admin drag & drop cùng lúc.

### Steps

1. **Setup 2 Browsers**
   - Browser 1: `http://localhost:3000/admin/sections` (Home tab)
   - Browser 2: `http://localhost:3000/admin/sections` (Home tab)

2. **Drag on Browser 1**
   - Kéo About lên trên Hero
   - Verify: Browser 1 cập nhật

3. **Drag on Browser 2 (cùng lúc)**
   - Kéo Metrics lên trên About
   - Verify: Browser 2 cập nhật

4. **Refresh Both**
   - F5 trên cả 2 browser
   - Verify: Cả 2 hiển thị order cuối cùng (không conflict)

5. **Check Database**
   ```sql
   select section_name, order_index
   from public.page_sections
   where page_type = 'home'
   order by order_index;
   ```

   - Verify: Order sequential [0, 1, 2, 3, 4, 5, 6, 7]
   - Verify: Không có duplicate order_index

### Expected Result

✅ Concurrent operations không conflict, order ổn định

---

## 📊 Test Results Summary

| Test                      | Status | Notes |
| ------------------------- | ------ | ----- |
| Test 1: Drag & Drop       | ✅/❌  |       |
| Test 2: Move Section      | ✅/❌  |       |
| Test 3: Fixed Section     | ✅/❌  |       |
| Test 4: Visibility Toggle | ✅/❌  |       |
| Test 5: Error Handling    | ✅/❌  |       |
| Test 6: Concurrent Ops    | ✅/❌  |       |

---

## 🐛 Troubleshooting

### Issue: Drag & drop không hoạt động

**Cause**: @dnd-kit packages chưa install
**Fix**:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm run dev
```

### Issue: RPC returns "Unauthorized"

**Cause**: User không có role = 'admin'
**Fix**:

```sql
update public.profiles
set role = 'admin'
where id = 'your-user-id';
```

### Issue: Move section fails

**Cause**: Section có is_fixed = true
**Fix**: Chỉ non-fixed sections mới có thể move

### Issue: Order bị lệch sau move

**Cause**: Reindex không chạy đúng
**Fix**: Chạy normalize function:

```sql
select public.normalize_section_order('home'::public.page_type_enum);
```

### Issue: UI không sync sau move

**Cause**: Callback không được gọi
**Fix**: Check `handleMoveSection` được pass đúng vào `onMove`

---

## ✅ Final Checklist

- [ ] Test 1: Drag & Drop ✅
- [ ] Test 2: Move Section ✅
- [ ] Test 3: Fixed Section ✅
- [ ] Test 4: Visibility Toggle ✅
- [ ] Test 5: Error Handling ✅
- [ ] Test 6: Concurrent Operations ✅
- [ ] Database: Order ổn định
- [ ] UI: Responsive, no lag
- [ ] Network: RPC calls correct
- [ ] Error messages: Clear

---

## 🚀 Ready for PHASE 4: Deployment

Nếu tất cả tests pass, bạn đã sẵn sàng deploy! 🎉
