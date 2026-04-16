# Hướng dẫn Triển khai Database (10 Bước)

Để giải quyết triệt để các lỗi "đã tồn tại" (already exists) và "trùng lặp" (duplicate key), hãy chạy 10 file SQL dưới đây theo đúng thứ tự trong Supabase SQL Editor.

## Thứ tự thực hiện:

1.  **[01_foundation.sql](file:///D:/Projects/My_portfolio/radiant-growth-portfolio/database/deployment-steps/01_foundation.sql)**: Khởi tạo Extension, Hàm Helper (is_admin, upsert_secret) và các kiểu Enum quan trọng.
2.  **[02_core_tables.sql](file:///D:/Projects/My_portfolio/radiant-growth-portfolio/database/deployment-steps/02_core_tables.sql)**: Tạo các bảng cấu hình cơ bản (Personal Info, Settings, Fonts).
3.  **[03_skill_expertise.sql](file:///D:/Projects/My_portfolio/radiant-growth-portfolio/database/deployment-steps/03_skill_expertise.sql)**: Tạo cấu hình cho phần Kỹ năng và Chuyên môn.
4.  **[04_projects.sql](file:///D:/Projects/My_portfolio/radiant-growth-portfolio/database/deployment-steps/04_projects.sql)**: Tạo cấu hình cho phần Dự án (Portfolio).
5.  **[05_blog.sql](file:///D:/Projects/My_portfolio/radiant-growth-portfolio/database/deployment-steps/05_blog.sql)**: Tạo cấu hình cho phần Blog.
6.  **[06_experience_about.sql](file:///D:/Projects/My_portfolio/radiant-growth-portfolio/database/deployment-steps/06_experience_about.sql)**: Tạo cấu hình cho Kinh nghiệm, Giới thiệu và Timeline.
7.  **[07_services_testimonials_metrics.sql](file:///D:/Projects/My_portfolio/radiant-growth-portfolio/database/deployment-steps/07_services_testimonials_metrics.sql)**: Tạo cấu hình cho Dịch vụ, Đánh giá và Chỉ số.
8.  **[08_infrastructure.sql](file:///D:/Projects/My_portfolio/radiant-growth-portfolio/database/deployment-steps/08_infrastructure.sql)**: Tạo cấu hình cho Trang (Page Sections), Liên hệ và ghi nhật ký.
9.  **[09_rls_policies.sql](file:///D:/Projects/My_portfolio/radiant-growth-portfolio/database/deployment-steps/09_rls_policies.sql)**: Kích hoạt bảo mật RLS và thiết lập quyền truy cập cho Admin/Public.
10. **[10_seed_data.sql](file:///D:/Projects/My_portfolio/radiant-growth-portfolio/database/deployment-steps/10_seed_data.sql)**: Chèn dữ liệu mẫu và các thiết lập khởi tạo an toàn (Sử dụng `ON CONFLICT`).

## Tại sao cách này hoạt động?
- **Idempotency**: Mọi câu lệnh đều có kiểm tra `IF NOT EXISTS` hoặc `DROP IF EXISTS`. Bạn có thể chạy lại bao nhiêu lần tùy thích mà không lo lỗi.
- **Dependency Management**: Các file được sắp xếp để đảm bảo các Enum và Hàm Helper được tạo trước khi các bảng tham chiếu tới chúng.
- **Safe Data Seeding**: Dữ liệu mẫu sử dụng `ON CONFLICT DO NOTHING` hoặc `UPDATE`, giúp giữ nguyên dữ liệu bạn đã sửa thủ công nếu có.
