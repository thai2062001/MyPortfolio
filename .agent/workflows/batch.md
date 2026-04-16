---
description: Thực hiện chuỗi các nhiệm vụ tự động
---

// turbo-all
# Quy trình thực hiện nhiệm vụ liên tiếp

Dưới đây là các bước tôi sẽ tự động thực hiện. Bạn có thể chỉnh sửa nội dung trong các mục "Nhiệm vụ" bên dưới.

### Bước 1: Thực hiện nhiệm vụ đầu tiên
- **Nhiệm vụ:** [Nhập nội dung prompt 1 của bạn vào đây]
- **Hành động:** Tôi sẽ phân tích yêu cầu này, thực hiện các thay đổi cần thiết hoặc trả lời câu hỏi.

### Bước 2: Tự động chuyển sang nhiệm vụ thứ hai
- **Nhiệm vụ:** [Nhập nội dung prompt 2 của bạn vào đây]
- **Hành động:** Sau khi hoàn thành Bước 1, tôi sẽ ngay lập tức đọc và thực hiện yêu cầu này mà không cần chờ lệnh mới.

---
*Ghi chú: Để kích hoạt, hãy bảo tôi "Chạy workflow batch"*


Task 1 :
Tôi muốn hiệu ứng parallax cho ảnh cover.

Không phải hover lift.
Không phải fade up thông thường.

Tôi muốn khi người dùng scroll, phần ảnh bên trong khung sẽ di chuyển dọc theo scroll, tạo cảm giác ảnh có chiều sâu và đang chuyển động bên trong container.

Yêu cầu:

* container ảnh vẫn bo góc và overflow hidden
* ảnh bên trong lớn hơn khung một chút để có không gian di chuyển
* khi scroll xuống, ảnh bên trong dịch chuyển mượt theo trục Y
* hiệu ứng nhẹ, sang, không quá lố
* ưu tiên cảm giác premium giống portfolio/framer style
* vẫn tối ưu mobile
* tôn trọng prefers-reduced-motion

Talks 2 :
Implement a bottom blur reveal (frosted glass effect) for all public pages (EXCEPT admin pages).

🎯 Goal:
When the user has NOT scrolled to the bottom section yet, the content near the bottom should appear blurred with a glass-like overlay.
As the user scrolls down, the blur gradually disappears and content becomes fully visible.

⚠️ IMPORTANT:
- DO NOT apply this to any admin routes (/admin/*)
- DO NOT break existing layout or section structure
- DO NOT modify data fetching or business logic
- Only enhance UI/UX with visual effect

---

🧩 Behavior details:

1. Create a fixed or absolute overlay at the bottom of the viewport:
   - Height: ~150px–300px
   - Position: bottom: 0
   - Width: 100%
   - Pointer-events: none (so user can still scroll)

2. Apply glass effect:
   - backdrop-filter: blur(10px–20px)
   - background: linear-gradient(to top, white/black with opacity → transparent)
   - Slight opacity for smooth fade

3. Detect scroll position:
   - When user is near bottom (e.g. within 200px of page end):
     → fade out overlay (opacity: 0)
   - Otherwise:
     → overlay visible (opacity: 1)

4. Add smooth animation:
   - transition: opacity 0.3s ease

---

🧠 Tech requirements (Next.js / React):

- Use a custom hook:
  useEffect + window.scrollY + document.body.scrollHeight

- Example logic:
  const isNearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200);

- Store state:
  const [hideBlur, setHideBlur] = useState(false)

---

🧱 Component structure:

Create a reusable component:
<BottomBlurOverlay />

Then include it in main layout (NOT admin layout)

Example:
if (!pathname.startsWith('/admin')) {
  render overlay
}

---

🎨 Styling suggestion (Tailwind or CSS):

.overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  backdrop-filter: blur(16px);
  background: linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0));
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 50;
}

.hidden {
  opacity: 0;
}

---

✨ Extra (optional but recommended):

- Add slight scale or translateY effect for content reveal
- Support dark mode (use rgba(0,0,0,...) instead of white)
- Optimize performance (throttle scroll event)

---

✅ Final result:
- When user scrolls → blur fades out smoothly
- When user scrolls up → blur returns
- Works across all public pages consistently