# Design System Documentation: Radiant Growth Portfolio

Tài liệu này tổng hợp toàn bộ phong cách thiết kế từ Framer để phục vụ việc lập trình giao diện đồng nhất.

## 1. Bản sắc thiết kế (Design Identity)
- **Phong cách:** Editorial Minimalist (Tạp chí tối giản).
- **Cảm giác mang lại:** Sang trọng, chuyên nghiệp, thoáng đãng và tin cậy.

## 2. Bảng màu (Color Palette)

### Core Colors
| Token | Giá trị (Light) | Mô tả |
| :--- | :--- | :--- |
| `Primary` | `rgb(14, 58, 39)` | Xanh đậm (Thường dùng cho heading hoặc brand). |
| `Secondary` | `rgb(230, 238, 205)` | Xanh mạ nhạt (Màu nhấn hoặc nền phụ). |
| `Background` | `rgb(236, 235, 228)` | Màu kem/be chủ đạo cho toàn trang. |
| `Card Color` | `rgb(246, 244, 237)` | Màu nền cho các khối thẻ/box. |
| `Green Accent`| `rgb(49, 238, 51)` | Xanh lá tươi (Dùng cho Badge/Trạng thái). |

### Neutral Colors
| Token | Giá trị |
| :--- | :--- |
| `Black` | `rgb(0, 0, 0)` |
| `Black 85%` | `rgba(0, 0, 0, 0.85)` |
| `Black 50%` | `rgba(0, 0, 0, 0.5)` |
| `Black 10%` | `rgba(0, 0, 0, 0.1)` (Dùng cho đường kẻ chia cắt). |
| `White` | `rgb(255, 255, 255)` |

---

## 3. Hệ thống chữ (Typography)

### Font Families
- **Serif (Chính):** `Crimson Pro` (Thường dùng bản Light cho Heading).
- **Sans-serif (Nội dung):** `Inter` (Dùng cho Body/Small text).
- **Satoshi:** Dùng cho một số nội dung đặc biệt hoặc Badge.

### Typography Styles
| Style Path | Font Family | Size | Leading | Tracking | Weight |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Headings/H1` | Crimson Pro | 70px | 1.0em | -0.04em | Light (300) |
| `Headings/H2` | Crimson Pro | 44px | 1.1em | -0.04em | Light (300) |
| `Headings/H3` | Inter | 36px | 1.2em | -0.01em | Medium (500) |
| `Paragraphs/Body`| Inter | 18px | 1.5em | -0.02em | Regular (400) |
| `Body Small` | Satoshi | 14px | 1.2em | 0.8px | Medium (500) |

---

## 4. Quy tắc Layout & Spacing

### Grid & Breakpoints
- **Desktop Width:** 1200px (Center).
- **Padding Container:** 50px (Desktop), 20px (Mobile).
- **Section Padding:** Thường là 100px (Top/Bottom).

### Sizing & Shape
- **Border Radius (Large):** 36px (Khối bao quanh Hero/Wrapper).
- **Border Radius (Medium):** 16px - 18px (Cards, Images, Buttons).
- **Gaps:** 
  - Section con: 48px - 64px.
  - Nội dung nhóm: 24px.
  - Các phần tử nhỏ (nút, badge): 12px - 16px.

---

## 5. UI Components Pattern

### Buttons
- **Primary:** Nền `Primary`, chữ `White`, bo góc `16px`, icon `ArrowUpRight`.
- **Secondary:** Nền `Transparent` hoặc `White`, viền mảnh, chữ `Black`.

### Cards (Services/Projects)
- Nền: `Card Color`.
- Viền: 2px Solid, màu `White` hoặc `Black 10%`.
- Overflow: Hidden (để chứa ảnh bo góc).

### Badges
- Kích thước: `fit-content`.
- Padding: Thường là `6px 12px`.
- Text: In hoa (Uppercase), font Satoshi Medium.

---

## 6. Hiệu ứng thị giác (Design Tokens)
- **Separation Lines:** Dày 2px, màu `Black`, Opacity `0.1`.
- **Glassmorphism/Blurs:** Sử dụng các khối tròn (`Circle`) với bộ lọc `Blur` làm nền phía sau Hero Section.
- **Animations:** 
  - Ticker: Chạy vô tận (Ticker) cho danh sách đối tác.
  - Hover: Các card và nút thường có hiệu ứng đổi màu hoặc nhích lên nhẹ.

---

## 7. Cấu trúc thành phần (Component Architecture)

Để code "y chang" thiết kế, cấu trúc các Section cần tuân thủ logic sau:

### Hero Section (`HeroSection`)
- **Wrapper:** `max-width: 1200px`, `display: flex`, `flex-wrap: wrap`.
- **Left Content (60%):** Chứa Badge -> H1 -> Supporting Text -> Button Group. 
- **Right Content (40%):** Chứa cụm ảnh bo góc `16px`, tỉ lệ ảnh `0.638 (aspect-ratio)`.
- **Decoration:** Blurs nền đặt ở `position: absolute`, `z-index: 0`.

### Services Section (`Services`)
- **Background:** `bg color` (`rgb(236, 235, 228)`).
- **Cards Grid:** 
  - Desktop: Grid hoặc Flex-wrap với `min-width: 400px` cho mỗi card.
- **Card Internal:** Padding `44px`, bo góc `18px`, viền `2px solid white`.

---

## 8. Quy tắc CSS Global (Dành cho AI Coding)

Khi thực hiện code, tôi sẽ áp dụng các biến CSS sau để đảm bảo độ chính xác:

```css
:root {
  --primary: rgb(14, 58, 39);
  --secondary: rgb(230, 238, 205);
  --bg-color: rgb(236, 235, 228);
  --card-bg: rgb(246, 244, 237);
  --white: #FFFFFF;
  --black-10: rgba(0, 0, 0, 0.1);
  --black-85: rgba(0, 0, 0, 0.85);
  
  --font-serif: 'Crimson Pro', serif;
  --font-sans: 'Inter', sans-serif;
  
  --radius-xl: 36px;
  --radius-lg: 18px;
  --radius-md: 16px;
}

/* Base Styles */
h1 {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: 70px;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--primary);
}

p {
  font-family: var(--font-sans);
  font-size: 18px;
  line-height: 1.5;
  color: var(--black-85);
}
```
