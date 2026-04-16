# Clients Section Setup Guide

## Overview

Phần hiển thị clients trên trang home đã được cập nhật để lấy dữ liệu từ database thay vì hardcoded.

## Changes Made

### 1. Updated Component: `src/components/ClientsSection.tsx`

- Thay thế hardcoded clients array bằng database query
- Thêm `useEffect` hook để fetch dữ liệu từ Supabase
- Thêm loading state khi đang fetch dữ liệu
- Sử dụng `logo_url` từ database thay vì `logo`

### 2. Database Structure

Tạo table `clients` với các cột:

- `id` (UUID, primary key)
- `name` (VARCHAR 255) - Tên công ty
- `logo_url` (TEXT) - URL logo
- `website_url` (TEXT) - URL website (optional)
- `order_index` (INTEGER) - Thứ tự hiển thị
- `is_published` (BOOLEAN) - Trạng thái công khai
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Setup Steps

### Step 1: Create Table

Chạy SQL script `CREATE_CLIENTS_TABLE.sql` trong Supabase SQL Editor:

```sql
-- Copy toàn bộ nội dung từ CREATE_CLIENTS_TABLE.sql
-- Paste vào Supabase SQL Editor
-- Click "Run"
```

### Step 2: Seed Data

Chạy SQL script `SEED_CLIENTS.sql` để thêm dữ liệu clients:

```sql
-- Copy toàn bộ nội dung từ SEED_CLIENTS.sql
-- Paste vào Supabase SQL Editor
-- Click "Run"
```

### Step 3: Verify

- Truy cập trang home
- Kiểm tra phần Clients có hiển thị đúng không
- Nếu không thấy gì, kiểm tra browser console để xem lỗi

## Admin Management

Để quản lý clients, sử dụng trang Admin:

- Đi tới Admin Dashboard → Clients
- Thêm, sửa, xóa clients
- Thay đổi thứ tự hiển thị
- Công khai/ẩn clients

## Notes

- Chỉ hiển thị clients có `is_published = true`
- Clients được sắp xếp theo `order_index`
- Nếu không có clients nào, sẽ hiển thị loading spinner
