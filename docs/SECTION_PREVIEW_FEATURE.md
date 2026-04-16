# Live Preview Feature - Section Management

## Overview

Added a live preview feature to the Section Management admin page, allowing users to visualize the actual page layout with real data without leaving the CMS.

## Features Implemented

### 1. Preview Layout Button

- **Location**: Top-right of Section Management page
- **Style**: Primary blue button
- **Label**: "Preview Layout"
- **Action**: Opens right-side drawer with page preview

### 2. Preview Panel (Right-Side Drawer)

- **Width**: Full width on mobile, 50% on desktop
- **Behavior**:
  - Slides in from right side
  - Overlay on mobile devices
  - Smooth animations
  - Close button (X) in header
  - Scrollable content area

### 3. Real-Time Sync

- **Visibility**: Only renders sections where `is_visible = true`
- **Ordering**: Sorted by `order_index`
- **Updates**: Preview updates instantly when:
  - Sections are reordered (drag & drop)
  - Sections are toggled visible/hidden
  - Tab is switched (Home/Portfolio)

### 4. Real Component Rendering

Each section renders the **actual component** from the homepage with real data:

| Section Key       | Component            | Data Source                      |
| ----------------- | -------------------- | -------------------------------- |
| home_hero         | HeroSection          | hero_sections table              |
| home_about        | AboutSection         | about_content table              |
| home_metrics      | MetricsSection       | metrics table                    |
| home_services     | SkillsSection        | skills table                     |
| home_skills       | ProficienciesSection | expertise_strategic_skills table |
| home_expertise    | ProficienciesSection | expertise_sections table         |
| home_testimonials | TestimonialsSection  | testimonials table               |
| home_timeline     | TimelineSection      | timeline_phases table            |
| home_contact      | ContactSection       | contact_messages table           |
| portfolio_grid    | PortfolioGrid        | projects table                   |
| portfolio_clients | ClientsSection       | clients table                    |

### 5. Interactive Hover Effects

- **List Hover**: Hovering a section in the list highlights its preview block
- **Preview Hover**: Hovering a preview block highlights it with blue border and scale effect
- **Visual Feedback**: Smooth transitions and shadow effects

### 6. Responsive Design

- **Mobile**: Full-screen drawer with overlay
- **Tablet/Desktop**: 50% width right-side panel
- **Scrollable**: Content scrolls independently on both list and preview
- **Height Limited**: Each section preview is capped at 384px (max-h-96) to keep drawer scrollable

### 7. Loading States

- Uses Suspense boundaries for smooth loading
- Shows skeleton placeholder while data is being fetched
- Gracefully handles missing sections

## Components Created

### `SectionPreview.tsx`

Renders individual section preview blocks with:

- Section label header
- Actual component rendering with real data
- Suspense boundary for loading states
- Hover state styling
- Height limiting for preview

### `PagePreview.tsx`

Main preview drawer component with:

- Overlay for mobile
- Slide-in animation
- Header with close button
- Filtered and sorted section list
- Hover state management

## Integration Points

### `page.tsx` (Section Management)

- Added state for preview visibility
- Added state for hovered section tracking
- Added state for active tab tracking
- Integrated Preview Layout button
- Passes current page sections to preview

### `PageSectionsList.tsx`

- Added hover event handlers
- Passes hover state to parent
- Highlights sections on hover

## Technical Details

- **Real Data**: Preview renders actual components with real database data
- **Lightweight**: Uses existing component infrastructure
- **Performance**: Suspense boundaries prevent blocking
- **Accessibility**: Proper button labels and semantic HTML
- **TypeScript**: Fully typed with no diagnostics

## User Experience Flow

1. User clicks "Preview Layout" button
2. Right-side drawer slides in with page preview
3. Components load with real data (shows skeleton while loading)
4. User can:
   - See all visible sections in order with real content
   - Hover sections to highlight them
   - Switch tabs to preview different pages
   - Reorder sections in list (preview updates instantly)
   - Toggle visibility (preview updates instantly)
5. User closes preview by clicking X or overlay

## Future Enhancements (Optional)

- Device preview toggle (Desktop/Tablet/Mobile)
- Zoom in/out controls
- "Open full page" button to view actual page
- Section detail tooltips
- Export preview as image
