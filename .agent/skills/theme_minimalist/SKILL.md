---
name: Minimalist Theme (Organic Neo-Nordic)
description: Hướng dẫn lập trình và quy tắc thiết kế cho theme Minimalist theo phong cách Organic Neo-Nordic.
---

# Minimalist Theme (Organic Neo-Nordic) Rules

Khi làm việc với theme **Minimalist**, hãy luôn tuân thủ các quy tắc dưới đây để đảm bảo tính đồng bộ tuyệt đối với hệ thống thiết kế "Organic Neo-Nordic".

## 1. Nguyên tắc màu sắc (Colors)
- KHÔNG sử dụng màu đen thuần (`#000`). Sử dụng `--text-main` (`#2D312E`).
- Nền trang luôn là `--bg-canvas` (`#FAF9F6`).
- Màu nhấn chính là `--primary-sage` (`#8CA693`).

## 2. Nguyên tắc Typography
- Tiêu đề (Headings): Luôn dùng font `Outfit`. Trọng tâm vào sự tròn trịa.
- Nội dung (Body): Luôn dùng font `Plus Jakarta Sans`.
- Badge/Label: Dùng `Satoshi` kèm theo `Uppercase` và `letter-spacing: 0.08em`.

## 3. Nguyên tắc Hình khối (Shapes)
- Tuyệt đối không có góc nhọn trong UI.
- Bo góc (Border-radius) tối thiểu: `16px`.
- Bo góc Card: `32px`.
- Bo góc Hero/Wrapper: `48px` - `64px`.
- Nút bấm (Buttons): Luôn là dạng viên thuốc (Pill shape).

## 4. Nguyên tắc Chuyển động (Motion)
- Sử dụng `Framer Motion` cho mọi tương tác xuất hiện.
- Kiểu chuyển động chủ đạo: `y: 20 -> 0`, `opacity: 0 -> 1` kèm theo độ trễ (stagger children).
- Hiệu ứng Hover: Ưu tiên `scale: 1.05` và đổ bóng mềm (Ambient shadow).

## 5. Đồng bộ 1:1 với Radiant
- Mọi trang (`Home`, `Blog`, `Portfolio`, `Projects`, `ProjectDetail`, `Skills`, `SkillDetail`, `Timeline`) phải được xây dựng đầy đủ.
- Mọi Section có trong Radiant phải được tái hiện lại trong Minimalist nhưng với "lớp áo" mới. Nếu Radiant có 10 section thì Minimalist cũng phải có 10 section tương ứng.

## 6. Layout & Spacing
- Desktop Container: `1320px`.
- Section Gap: `120px`.
- Không sử dụng các đường kẻ chia cắt (Divider) truyền thống. Sử dụng khoảng trắng hoặc sự thay đổi nhẹ về màu nền (`--surface-sand`).

> [!IMPORTANT]
> VI PHẠM QUY TẮC BO GÓC HOẶC MÀU SẮC TRONG THEME MINIMALIST SẼ LÀM MẤT ĐI CHẤT "ORGANIC" CỦA THIẾT KẾ.
