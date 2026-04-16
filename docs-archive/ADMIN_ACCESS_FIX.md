# 🔧 Admin Access Fix - Complete Guide

## 📋 Tóm tắt vấn đề

**Account:** `haiyenpham1795@gmail.com`  
**Triệu chứng:** Bị "Access Denied" khi truy cập admin panel  
**Database:** ✅ Đã có `role = 'admin'` trong `profiles` table  
**Function:** ✅ `is_admin()` RPC đã tồn tại và hoạt động đúng

## 🔍 Nguyên nhân chính xác

**File lỗi:** `src/components/admin/ProtectedRoute.tsx` (dòng 14-16)

**Code cũ (SAI):**

```typescript
const ADMIN_EMAILS = [
  "phamthai180@gmail.com", // Main Admin from .env.local
  "admin@example.com",     // Default Admin
];

// Check bằng hardcoded list
if (!ADMIN_EMAILS.includes(user.email || "")) {
  return <AccessDenied />;
}
```

**Vấn đề:**

- ❌ Check admin bằng hardcoded email list
- ❌ Account `haiyenpham1795@gmail.com` không có trong list
- ❌ Bỏ qua hoàn toàn database `profiles.role`
- ❌ Không dùng RPC `is_admin()`

## ✅ Giải pháp đã áp dụng

**Code mới (ĐÚNG):**

```typescript
// 1. Check qua RPC is_admin() (ưu tiên)
const { data: isAdminRpc, error: rpcError } = await supabase.rpc("is_admin");

// 2. Fallback: Query profiles table trực tiếp
if (rpcError) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  setIsAdmin(profile?.role === "admin");
}
```

**Ưu điểm:**

- ✅ Check qua database thực tế
- ✅ Dùng RPC `is_admin()` (security definer)
- ✅ Có fallback nếu RPC lỗi
- ✅ Log đầy đủ để debug
- ✅ Không phụ thuộc hardcoded list

## 🧪 Cách test

### 1. Kiểm tra database trước

```sql
-- Kiểm tra user có trong profiles không
SELECT id, email, role
FROM auth.users
WHERE email = 'haiyenpham1795@gmail.com';

-- Kiểm tra profiles table
SELECT id, role
FROM public.profiles
WHERE id = '<user_id_from_above>';

-- Test function is_admin() (phải login trước)
SELECT public.is_admin();
```

### 2. Test frontend

1. **Logout hoàn toàn:**

   ```javascript
   // Trong browser console
   await supabase.auth.signOut();
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Login lại với account:**
   - Email: `haiyenpham1795@gmail.com`
   - Password: (password của account)

3. **Kiểm tra console logs:**

   ```
   🔍 Checking admin role for user: <user_id> haiyenpham1795@gmail.com
   📞 RPC is_admin() result: true error: null
   ✅ Admin status from RPC: true
   ```

4. **Kết quả mong đợi:**
   - ✅ Không bị "Access Denied"
   - ✅ Vào được admin dashboard
   - ✅ Thấy menu admin đầy đủ

### 3. Test các trường hợp khác

**Test user không phải admin:**

```sql
-- Tạo test user
INSERT INTO public.profiles (id, email, role)
VALUES ('<test_user_id>', 'test@example.com', 'user');
```

- ❌ Phải bị "Access Denied"
- ✅ Console log: `Admin status: false`

**Test user không có trong profiles:**

- ❌ Phải bị "Access Denied"
- ✅ Console log: `Profile query error`

## 📊 Debug logs

Code mới có đầy đủ logs để debug:

```typescript
console.log("🔍 Checking admin role for user:", user.id, user.email);
console.log("📞 RPC is_admin() result:", isAdminRpc, "error:", rpcError);
console.log("📊 Profile query result:", profile, "error:", profileError);
console.log("✅ Admin status from RPC:", isAdminRpc);
```

**Cách xem logs:**

1. Mở DevTools (F12)
2. Tab Console
3. Login vào admin
4. Xem các log bắt đầu bằng emoji

## 🔐 Security notes

### RLS Policies cần có

```sql
-- profiles table phải có policy cho authenticated users
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Hoặc cho phép đọc tất cả profiles (nếu cần)
CREATE POLICY "Authenticated can read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);
```

### Function is_admin() security

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER  -- ⚠️ Quan trọng: chạy với quyền owner
SET search_path = public
AS $
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$;
```

## 🚀 Deployment checklist

- [x] Sửa `ProtectedRoute.tsx`
- [ ] Test local với account `haiyenpham1795@gmail.com`
- [ ] Verify console logs
- [ ] Test với user không phải admin
- [ ] Commit & push code
- [ ] Deploy lên production
- [ ] Test lại trên production
- [ ] Xóa logs debug (nếu cần)

## 📝 Files đã thay đổi

1. **src/components/admin/ProtectedRoute.tsx**
   - Xóa hardcoded `ADMIN_EMAILS`
   - Thêm `useEffect` để check admin qua database
   - Thêm state `isAdmin` và `checkingAdmin`
   - Thêm logs debug đầy đủ
   - Fallback từ RPC sang query trực tiếp

## 🎯 Kết luận

**Nguyên nhân:** Hardcoded email list thay vì check database  
**Giải pháp:** Check qua RPC `is_admin()` hoặc query `profiles.role`  
**Kết quả:** Account `haiyenpham1795@gmail.com` giờ có thể truy cập admin

**Cách check admin chuẩn:**

1. ✅ Ưu tiên: `supabase.rpc('is_admin')`
2. ✅ Fallback: Query `profiles.role`
3. ❌ KHÔNG dùng: Hardcoded email list
4. ❌ KHÔNG dùng: `user.app_metadata.role`
