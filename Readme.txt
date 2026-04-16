Tạo một khu vực admin để chỉ người đã đăng nhập mới quản lý được dữ liệu, còn người dùng ngoài chỉ xem website public.
Admin này chỉ có 1 mình tôi dùng, nên không cần hệ thống role/phân quyền phức tạp. Chỉ cần:

đăng nhập
vào dashboard
CRUD toàn bộ content
upload / nhập link ảnh
sắp xếp thứ tự hiển thị
publish / unpublish
2. Database đã có

Hãy code bám theo các bảng sau trong Supabase:

project_categories
projects
project_images
project_approaches
project_results
project_testimonials
about_content
skills
work_experiences
work_experience_tasks
clients
testimonials
metrics
personal_info
3. Yêu cầu tổng thể

Hãy tạo một admin panel hoàn chỉnh gồm:

A. Authentication
Dùng Supabase Auth
Có trang /admin/login
Nếu chưa đăng nhập thì không vào được /admin
Nếu đã đăng nhập thì vào dashboard
Có nút logout
B. Layout admin

Tạo layout quản trị chuyên nghiệp:

sidebar bên trái
header trên cùng
content area bên phải
responsive cơ bản
giao diện gọn, dễ nhìn, dễ dùng

Sidebar gồm các menu:

Dashboard
Project Categories
Projects
About Content
Skills
Work Experiences
Clients
Testimonials
Metrics
Personal Info
4. Chức năng từng module
4.1. Dashboard

Trang /admin
Hiển thị tổng quan:

tổng số projects
tổng số categories
tổng số clients
tổng số testimonials
tổng số skills
tổng số work experiences
số project đang published
số project đang draft

Có card thống kê đơn giản.

4.2. Project Categories

Trang /admin/project-categories

Chức năng:

danh sách categories
tạo category mới
sửa category
xóa category
bật/tắt is_published
chỉnh order_index
slug tự động từ name nếu chưa nhập

Field:

slug
name
name_ja
name_vi
order_index
is_published

UI cần có:

bảng danh sách
nút Add New
modal hoặc form riêng để create/update
confirm trước khi delete
4.3. Projects

Trang /admin/projects

Đây là module quan trọng nhất.
Cần hỗ trợ CRUD đầy đủ cho bảng projects.

Field cần quản lý:

slug
title
title_ja
title_vi
category_id
short_description
short_description_ja
short_description_vi
description
description_ja
description_vi
overview
overview_ja
overview_vi
challenge
challenge_ja
challenge_vi
solution
solution_ja
solution_vi
client
duration
role
year
cover_image_url
tall
is_featured
is_published
seo_title
seo_title_ja
seo_title_vi
seo_description
seo_description_ja
seo_description_vi
og_image_url
published_at

Yêu cầu:

trang list có tìm kiếm theo title
filter theo category
filter published / draft
toggle nhanh is_featured
toggle nhanh is_published
create project
edit project
delete project
preview dữ liệu dễ nhìn

Form project cần:

input text
textarea
select category
checkbox cho tall, is_featured, is_published
tự tạo slug từ title nếu slug đang trống
nếu publish thì có thể set published_at = now()
4.4. Project Images

Trong trang edit project, cần có khu quản lý ảnh riêng cho project_images.

Chức năng:

thêm ảnh vào project
sửa ảnh
xóa ảnh
sắp xếp theo order_index
chọn ảnh cover bằng is_cover
nhập:
image_url
alt_text
caption

Yêu cầu:

ảnh hiển thị preview
có nút set cover
chỉ nên có 1 ảnh cover chính, nếu set ảnh mới là cover thì bỏ cover ảnh cũ
4.5. Project Approaches

Trong trang edit project, cần có section quản lý project_approaches

Chức năng:

thêm approach
sửa approach
xóa approach
chỉnh order_index
4.6. Project Results

Trong trang edit project, cần có section quản lý project_results

Chức năng:

thêm result
sửa result
xóa result
chỉnh order_index

Field:

label
value
4.7. Project Testimonials

Trong trang edit project, cần có section quản lý project_testimonials

Field:

quote
name
title
company
avatar_url
order_index

Chức năng:

create
update
delete
sắp xếp
4.8. About Content

Trang /admin/about-content

Chức năng:

list các section
edit section
publish/unpublish

Field:

section_key
title_en
title_ja
title_vi
content_en
content_ja
content_vi
image_url
order_index
is_published

Yêu cầu:

section_key hiển thị readonly nếu đã tồn tại
textarea lớn cho content
preview ảnh nếu có
4.9. Skills

Trang /admin/skills

Field:

category
skill_name
skill_name_ja
skill_name_vi
description
description_ja
description_vi
order_index
is_published

Chức năng:

thêm skill
sửa
xóa
filter theo category
sắp xếp theo order_index
4.10. Work Experiences

Trang /admin/work-experiences

Field:

company_name
duration
description_en
description_ja
description_vi
order_index
is_published

Chức năng:

create / update / delete
bật tắt publish

Trong trang edit work experience cần có section quản lý work_experience_tasks.

Work Experience Tasks

Field:

task_en
task_ja
order_index

Chức năng:

thêm task
sửa task
xóa task
sắp xếp
4.11. Clients

Trang /admin/clients

Field:

name
logo_url
website_url
order_index
is_published

Chức năng:

create / update / delete
preview logo
publish/unpublish
4.12. Testimonials

Trang /admin/testimonials

Field:

name
role_en
role_ja
role_vi
quote_en
quote_ja
quote_vi
portrait_url
order_index
is_published

Chức năng:

CRUD đầy đủ
preview portrait
publish/unpublish
4.13. Metrics

Trang /admin/metrics

Field:

value
label_en
label_ja
label_vi
color
order_index
is_published

Chức năng:

create / update / delete
chọn nhanh color
publish/unpublish
4.14. Personal Info

Trang /admin/personal-info

Bảng này chỉ có 1 record duy nhất.
Làm UI theo kiểu form chỉnh sửa một lần, không phải list.

Field:

phone_number
email
address
facebook_url
linkedin_url
blog_url
github_url

Chức năng:

load dữ liệu record id = 1
update dữ liệu
không cho tạo nhiều record
5. Kỹ thuật cần làm

Hãy code theo các yêu cầu sau:

A. Công nghệ
Next.js App Router
TypeScript
Supabase client
Server actions hoặc API route hợp lý
Form validation rõ ràng
Toast thông báo khi create/update/delete thành công hoặc lỗi
B. Cấu trúc code

Tổ chức code rõ ràng:

app/admin/...
components/admin/...
lib/supabase/...
types/...
C. UI/UX
form rõ ràng
nút Save / Cancel / Delete
loading state
empty state
confirm delete
preview ảnh nếu có url ảnh
có search/filter ở list page khi hợp lý
D. Validation
field bắt buộc phải validate
không cho submit thiếu dữ liệu quan trọng
slug không được trùng nếu có thể kiểm tra trước
URL field nên validate cơ bản
E. CRUD hoàn chỉnh

Mỗi module phải có đủ:

list
create
edit
delete

Không làm nửa vời.

6. Public/Admin data flow
Admin dùng Supabase Auth để CRUD trực tiếp theo RLS hiện có
Public site chỉ lấy dữ liệu is_published = true
Không thay đổi schema database hiện tại, chỉ viết code bám theo schema đã có
7. Kết quả mong muốn

Tôi muốn AI trả ra:

cấu trúc file đầy đủ
code hoàn chỉnh cho từng file quan trọng
các route admin cần tạo
component form/list cần tạo
helper dùng chung
hướng dẫn chạy local
nếu cần, thêm seed/demo data đơn giản
8. Ưu tiên triển khai

Hãy làm theo thứ tự sau:

auth + admin layout
dashboard
project categories
projects + project_images + approaches + results + testimonials
about content
skills
work experiences + tasks
clients
testimonials
metrics
personal info
9. Yêu cầu quan trọng
Viết code sạch, dễ maintain
Thiết kế dựa theo hệ thông hiện tại ( Đồng nhất phong cách thiết kế)
Không mock dữ liệu giả nếu không cần
Không bỏ sót CRUD
Không chỉ tạo UI tĩnh, phải có logic thực sự kết nối Supabase
Ưu tiên làm xong tính năng đầy đủ trước, tối ưu sau
Nếu cần chọn giữa đẹp và đủ chức năng, ưu tiên đủ chức năng
Code phải chạy thực tế được
ĐỌc file SUPABASE_TABLES.md nếu cần biết về cấu trúc supabase