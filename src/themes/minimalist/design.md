# 🌿 Unified Design System: Organic Neo-Nordic (Minimalist Theme)

Bộ quy tắc này là tiêu chuẩn bắt buộc cho mọi thành phần UI trong theme Minimalist. Tất cả Component phải tuân thủ các thông số dưới đây để đảm bảo sự đồng bộ 100% về mặt thị giác và tính năng so với theme Radiant.

---

## 1. Bản sắc thiết kế (Design Identity)
- **Phong cách:** Organic Minimalism / Nordic Modern.
- **Triết lý:** "The Breathing Space" - Tạo ra một không gian kỹ thuật số thoáng đãng, ấm áp và có sức sống.
- **Cảm giác:** Thân thiện, cao cấp, an nhiên và cực kỳ tinh tế.

---

## 2. Visual Tokens (Thông số quy chuẩn)

### A. Color Palette (Màu sắc HSL)
| Token | Giá trị HSL | HEX (Ref) | Mô tả |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `45, 15%, 98%` | `#FAF9F6` | Trắng gốm (Bone White) - Nền chủ đạo. |
| `--primary-sage` | `138, 14%, 60%` | `#8CA693` | Xanh trà (Sage Green) - Màu nhấn chính. |
| `--secondary-clay`| `24, 28%, 65%` | `#BFA08A` | Màu đất sét (Clay) - Màu nhấn phụ. |
| `--text-main` | `140, 5%, 19%` | `#2D312E` | Xám than (Charcoal) - Chữ chính. |
| `--surface-sand` | `28, 33%, 94%` | `#F2E8DF` | Màu cát nhạt (Sand Glow) - Nền Card/Badge. |
| `--accent-glow` | `138, 14%, 60%, 0.1`| - | Hiệu ứng tỏa sáng/blur nhẹ. |

### B. Typography (Hệ thống chữ)
- **Heading Fonts:** `Outfit` (Modern, Geometric-but-soft).
- **Body Fonts:** `Plus Jakarta Sans` (Elegant, Readable).
- **Accent/Utility:** `Satoshi` (Bold, Professional).

| Cấp bậc | Size (PX) | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 88px | 600 | 1.0 | -0.04em |
| **Section Title** | 56px | 500 | 1.1 | -0.02em |
| **Sub Heading** | 32px | 500 | 1.2 | -0.01em |
| **Body Base** | 18px | 400 | 1.6 | 0 |
| **Label/Badge** | 13px | 600 | 1.2 | 0.08em (Uppercase) |

### C. Layout & Spacing
- **Container Max-wide:** `1320px`.
- **Hệ số Spacing:** 8px (Base unit).
- **Section Gap:** `120px` (Desktop) / `80px` (Mobile).
- **Border Radius:**
    - `Large (Hero/Wrapper): 48px - 64px`
    - `Medium (Cards/Images): 32px`
    - `Small (Elements): 16px`
    - `Pill (Buttons): 9999px`

---

## 3. Component Design Rules (Quy tắc thành phần)

### ⚪ Buttons
- Phải luôn là dạng viên thuốc (Pill shape).
- **Hover:** Tăng kích thước nhẹ (`scale: 1.05`) và đổ bóng đổ màu `--primary-sage` độ mờ cao.

### 🍱 Cards & Containers
- Không sử dụng border đậm.
- Sử dụng màu nền `--surface-sand` hoặc trắng mờ (`glassmorphism`).
- Đổ bóng: "Ambient Shadow" (Đổ bóng lan tỏa, nhạt, không có góc chết).

### 🎞️ Media & Images
- 100% hình ảnh phải có bo góc tối thiểu `32px`.
- Ưu tiên sử dụng hiệu ứng `Parallax` hoặc `Reveal` (trượt nhẹ) khi hình ảnh xuất hiện.

---

## 4. 100% Feature Parity with Radiant (Đồng bộ tính năng)

Mọi trang và section bên Radiant phải có mặt tại Minimalist với phong cách mới:
- **Timeline:** Chuyển từ logic dích dắc sang logic "Dòng chảy mượt mà" (Flowing curve).
- **Skills Orbital:** Biến các hạt orbital thành các "Blobs" (đốm sáng) màu Sage nhạt.
- **Portfolio Grid:** Sử dụng layout bất đối xứng (Asymmetric) để tạo sự tự nhiên.
- **Stats:** Con số hiển thị siêu lớn (`Outlined` hoặc `Light weight`) để không gây nặng nề.

---

## 5. Animation Guidelines (Chuyển động)
- **Chủ đạo:** "Smooth Glide & Fade".
- **Framer Motion Config:**
    - `stiffness: 70`
    - `damping: 15`
    - `mass: 1`
- **Trạng thái:** Các khối UI không bao giờ xuất hiện đột ngột mà luôn có độ trễ (stagger) từ dưới lên.
