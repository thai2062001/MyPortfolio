# BACKUP - Services & Testimonials Design + Logic

## ✅ FramerServicesSection.tsx - Key Features

### 1. Custom Cursor

```typescript
const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
const [showCursor, setShowCursor] = useState(false);
const sectionRef = useRef<HTMLElement>(null);

// Track mouse position
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };
  const section = sectionRef.current;
  if (section) {
    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }
}, []);

// Custom cursor element
{showCursor && (
  <div
    className="fixed w-3 h-3 bg-[#0C0D0D] rounded-full pointer-events-none z-50 transition-transform duration-100"
    style={{
      left: `${cursorPos.x}px`,
      top: `${cursorPos.y}px`,
      transform: "translate(-50%, -50%)",
    }}
  />
)}

// Section with cursor: none
style={{ cursor: showCursor ? "none" : "default" }}
```

### 2. Hover Effects on Cards

```typescript
const [isHovered, setIsHovered] = useState(false);

// Card styling
style={{
  backgroundColor: isHovered ? "#F1E9FE" : "#FFFFFF",
  transform: isHovered ? "scale(1.01)" : "scale(1)",
}}
className="transition-all duration-500 ease-out cursor-pointer"
```

### 3. Custom Toggle Button (Chevron)

```typescript
{/* Custom SVG chevron - NOT Lucide icon */}
<div className="relative w-4 h-4 flex items-center justify-center">
  <div
    className="absolute w-[15px] h-[1px] bg-[#0C0D0D] rounded-full transition-transform duration-300"
    style={{
      transform: isOpen ? "rotate(-45deg) translateY(0px)" : "rotate(45deg) translateY(-2px)",
    }}
  />
  <div
    className="absolute w-[15px] h-[1px] bg-[#0C0D0D] rounded-full transition-transform duration-300"
    style={{
      transform: isOpen ? "rotate(45deg) translateY(0px)" : "rotate(-45deg) translateY(2px)",
    }}
  />
</div>
```

### 4. Smooth Expand/Collapse Animation

```typescript
{/* Features List - maxHeight animation */}
<div
  className="flex flex-col gap-2 overflow-hidden transition-all duration-500 ease-out"
  style={{
    maxHeight: isOpen ? "500px" : "0px",
    opacity: isOpen ? 1 : 0,
  }}
>
  {features.map((feature, index) => (...))}
</div>

{/* CTA Button - maxHeight animation */}
<div
  className="flex flex-row items-center gap-3 overflow-hidden transition-all duration-500 ease-out"
  style={{
    maxHeight: isOpen ? "100px" : "0px",
    opacity: isOpen ? 1 : 0,
  }}
>
  <a href="/#pricing">...</a>
</div>
```

---

## ✅ FramerTestimonialsSection.tsx - Key Features

### 1. Vertical Slider Animation

```typescript
const [currentIndex, setCurrentIndex] = useState(0);

// Auto-rotate every 4 seconds
useEffect(() => {
  if (testimonials.length <= 1) return;
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, 4000);
  return () => clearInterval(interval);
}, [testimonials.length]);

// Slider container with translateY
<div
  className="relative w-[400px] h-[400px] transition-transform duration-700 ease-out"
  style={{
    transform: `translateY(-${currentIndex * 460}px)`,
  }}
>
  {testimonials.map((testimonial, index) => (
    <div className="w-[400px] h-[400px] ... mb-[60px]">
      {/* Card content */}
    </div>
  ))}
</div>
```

### 2. UP/DOWN Buttons on Active Card

```typescript
{/* UP Button - Top center of card */}
{testimonials.length > 1 && index === currentIndex && (
  <button
    onClick={() =>
      setCurrentIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      )
    }
    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] bg-white rounded-full border border-[#0C0D0D] flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
  >
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path
        d="M8 11L8 5M8 5L5 8M8 5L11 8"
        stroke="#0C0D0D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
)}

{/* DOWN Button - Bottom center of card */}
{testimonials.length > 1 && index === currentIndex && (
  <button
    onClick={() =>
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }
    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-[40px] h-[40px] bg-white rounded-full border border-[#0C0D0D] flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
  >
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path
        d="M8 5L8 11M8 11L11 8M8 11L5 8"
        stroke="#0C0D0D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
)}
```

### 3. Card Layout Structure

```typescript
<div
  className="w-[400px] h-[400px] rounded-[20px] border border-[#0C0D0D] p-10 flex flex-col justify-between mb-[60px] relative"
  style={{ backgroundColor: bgColor }}
>
  {/* UP/DOWN buttons here */}

  {/* Quote at bottom */}
  <div className="flex-1 flex items-end">
    <p className="text-[20px] leading-[1.4em] tracking-[-0.02em]">
      {quote}
    </p>
  </div>

  {/* Author info at top with border separator */}
  <div className="flex flex-col gap-3 pt-3 border-t border-dashed border-[#0C0D0D]">
    {/* Portrait image */}
    {testimonial.portrait_url && (
      <div className="flex justify-center">
        <img
          src={testimonial.portrait_url}
          alt={testimonial.name}
          className="w-20 h-[60px] rounded-lg object-cover border border-[#0C0D0D]"
        />
      </div>
    )}

    {/* Name and Role */}
    <div className="flex flex-col items-center gap-0">
      <h3 className="text-[40px] leading-[1.2em] tracking-[-0.04em] font-medium text-center">
        {testimonial.name}
      </h3>
      <p className="text-[20px] leading-[1.4em] tracking-[-0.04em] font-medium text-center">
        {role}
      </p>
    </div>
  </div>
</div>
```

### 4. NO Dots Pagination

```
❌ KHÔNG có dots pagination
✅ CHỈ có UP/DOWN buttons trên card
```

### 5. Card Colors

```typescript
const cardColors = [
  "rgb(241, 233, 254)", // Purple
  "rgb(218, 230, 255)", // Blue
  "rgb(254, 229, 247)", // Pink
  "rgb(255, 243, 198)", // Yellow
  "rgb(230, 254, 201)", // Green
  "rgb(255, 230, 225)", // Orange
];
```

---

## 🎯 Key Points to Remember

### Services Section:

1. ✅ Custom small cursor (12x12px black dot)
2. ✅ Hover effect: background #F1E9FE + scale(1.01)
3. ✅ Custom chevron toggle (2 lines rotating)
4. ✅ Smooth maxHeight animations (500ms ease-out)
5. ✅ Features + CTA button expand/collapse together

### Testimonials Section:

1. ✅ Vertical slider with translateY animation
2. ✅ UP/DOWN buttons ON the active card (not outside)
3. ✅ NO dots pagination
4. ✅ Auto-rotate every 4 seconds
5. ✅ Card: 400x400px, quote at bottom, author at top
6. ✅ Portrait: 80x60px rounded-lg (not circle)
7. ✅ Border-top dashed separator
8. ✅ 60px margin-bottom between cards

---

## 📝 Files to Update After Discard

1. `src/components/framer-ui/FramerServicesSection.tsx`
2. `src/components/framer-ui/FramerTestimonialsSection.tsx`

Sau khi discard, chỉ cần apply lại 2 files này với logic trên!
