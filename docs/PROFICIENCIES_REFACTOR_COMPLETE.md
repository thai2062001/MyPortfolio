# Proficiencies Section Refactor - Complete

## Overview

Refactored toàn bộ section PROFICIENCIES theo design mới với layout 2 cột, hover interactions, và responsive design.

## Components Created

### 1. **ProficienciesSection** (`src/components/ProficienciesSection.tsx`)

- Main component hiển thị toàn bộ section
- Layout 2 cột: Strategic Skills (trái) + Technical Arsenal (phải)
- Fetch dữ liệu từ Supabase
- Responsive: Stack 1 column trên mobile, 2 columns trên desktop
- Animations: Fade-in + slide effects

### 2. **StrategicSkillsBlock** (`src/components/StrategicSkillsBlock.tsx`)

- Hiển thị danh sách Strategic Skills
- Mỗi skill có:
  - Icon bo tròn nền xám nhạt
  - Title (bold)
  - Subtitle (uppercase, nhỏ, màu nhạt)
- Staggered animation khi scroll vào view

### 3. **ToolCard** (`src/components/ToolCard.tsx`)

- Card cho mỗi tool trong Technical Arsenal
- Hover interactions:
  - Scale 1.04 (nhẹ)
  - Shadow đậm hơn
  - Overlay fade-in hiển thị Applications
- Smooth transitions (0.2s ease-out)
- Emoji icons cho visual appeal

## Data Structure

### Tools Data (`src/data/tools.ts`)

```typescript
interface Tool {
  id: string;
  name: string;
  category: string;
  applications: string[];
  icon?: string;
}
```

Dữ liệu tools được lấy từ Supabase `expertise_tool_items` table.

## Layout Details

### Left Column (Strategic Skills)

- Title: "Strategic Skills"
- Description từ Supabase
- List items với icon + title + subtitle
- Spacing thoáng, clean

### Right Column (Technical Arsenal)

- Header card (bg-gray-50, rounded-2xl)
  - Title: "Technical Arsenal"
  - Description
  - Badge: "X active licenses"
- Grid 2 hàng x 3 cột (desktop)
- Grid 2 hàng x 2 cột (mobile)
- Gap: 4 (1rem)

## Responsive Design

### Desktop (md+)

- 2 columns layout
- Grid 3 columns cho tools
- Larger typography

### Mobile

- Stack 1 column
- Strategic Skills lên trước
- Tools grid 2 columns
- Adjusted padding/spacing

## Animations

### Section Entry

- Header: fade-in + slide-up (0.6s)
- Left column: fade-in + slide-left (0.6s, delay 0.1s)
- Right column: fade-in + slide-right (0.6s, delay 0.1s)

### Tool Cards

- Staggered fade-in + slide-up (0.5s, delay 0.05s per item)

### Hover Effects

- Scale: 1.04 (0.2s ease-out)
- Shadow: sm → xl
- Overlay: fade-in + slide-up (0.2s)

## Integration

### Updated Files

1. `src/lib/sectionRenderer.tsx`
   - Replaced `SkillsSection` with `ProficienciesSection`
   - Maps `home_skills` and `home_expertise` to new component

### Deleted Files

- `src/components/SkillsSection.tsx` (old component)

## Styling

### Colors

- Background: white
- Text: gray-900 (headings), gray-600 (body), gray-500 (labels)
- Cards: gray-50 (default), white (hover)
- Icons: gray-700

### Typography

- Heading: text-4xl md:text-5xl lg:text-6xl, font-bold
- Subheading: text-lg md:text-xl, font-semibold
- Body: text-sm, text-gray-600
- Labels: text-xs, uppercase, tracking-widest

### Spacing

- Section padding: py-20 md:py-32
- Container max-width: max-w-7xl
- Gap between columns: gap-12 md:gap-20 lg:gap-24
- Tool cards gap: gap-4

### Border Radius

- Cards: rounded-2xl
- Icons: rounded-full

## Features

✅ Layout 2 cột theo design
✅ Strategic Skills block với icon + title + subtitle
✅ Technical Arsenal card với badge
✅ Tools grid 2x3 (desktop) / 2x2 (mobile)
✅ Hover interactions (scale + shadow + overlay)
✅ Smooth animations (0.2-0.6s)
✅ Responsive design
✅ Clean, modern UI
✅ Supabase integration
✅ Loading skeleton

## Usage

Section tự động render khi `section_key` = `home_expertise` hoặc `home_skills` trong database.

Dữ liệu được quản lý từ admin panel:

- `/admin/strategic-skills` - Quản lý Strategic Skills
- `/admin/tool-items` - Quản lý Technical Tools

## Notes

- Tools hiển thị tối đa 6 items (2 hàng x 3 cột)
- Nếu có ít hơn 6 tools, grid sẽ tự adjust
- Hover overlay chỉ hiển thị trên desktop (mouse events)
- Mobile users sẽ thấy card bình thường
- Tất cả dữ liệu được filter `is_published = true`
