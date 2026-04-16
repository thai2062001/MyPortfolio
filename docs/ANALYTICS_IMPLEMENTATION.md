# Portfolio Analytics Implementation

## Overview

Complete analytics tracking system for the portfolio website. Tracks visitor behavior, page views, traffic sources, device types, and user engagement metrics.

## Architecture

### 1. Client-Side Tracking (`src/lib/analytics/`)

#### Core Modules

- **`visitor.ts`** - Visitor ID management
  - Creates unique visitor identifier using `crypto.randomUUID()`
  - Persists in `localStorage` with key `portfolio_visitor_id`
  - Reused across sessions

- **`session.ts`** - Session ID management
  - Creates unique session identifier per tab/session
  - Stored in `sessionStorage` with key `portfolio_session_id`
  - New session per tab/browser restart

- **`page-key.ts`** - Page key extraction
  - Maps routes to meaningful identifiers
  - Examples: `/` → `home`, `/portfolio` → `portfolio`, `/project/:slug` → `project-detail`
  - Fallback to pathname if no match

- **`traffic.ts`** - Traffic source classification
  - Analyzes `document.referrer` to determine traffic source
  - Categories: `direct`, `google`, `facebook`, `instagram`, `linkedin`, `referral`

- **`device.ts`** - Device type detection
  - Classifies based on `window.innerWidth`
  - Categories: `mobile` (<768px), `tablet` (768-1023px), `desktop` (≥1024px)

- **`date-range.ts`** - Date range utilities
  - Provides date ranges for analytics queries
  - Options: `today`, `last7days`, `last30days`, `alltime`

- **`types.ts`** - TypeScript interfaces
  - `PortfolioVisitEvent` - Full event data
  - `AnalyticsEventData` - Event data for insertion

- **`service.ts`** - Supabase operations
  - `insertVisitEvent()` - Creates new visit record
  - `updateVisitEvent()` - Updates time and scroll data

- **`queries.ts`** - Analytics data queries
  - `getAnalyticsSummary()` - Summary metrics
  - `getViewsByDay()` - Views over time
  - `getTopPages()` - Most visited pages
  - `getTrafficSourceBreakdown()` - Traffic source stats
  - `getDeviceBreakdown()` - Device type stats
  - `getRecentVisits()` - Recent visit records

### 2. React Hook (`src/hooks/usePortfolioAnalytics.ts`)

Automatically tracks:

- Page visits (inserts new record on route change)
- Scroll depth (tracks max scroll percentage)
- Time on page (calculates on page leave)
- Updates record with engagement metrics

**Usage**: Integrated in `App.tsx` - runs on all pages automatically

### 3. Admin Components (`src/components/admin/analytics/`)

- **`AnalyticsSummaryCards.tsx`** - Key metrics display
  - Total Views, Today Views, Unique Visitors, Avg Time, Avg Scroll Depth

- **`AnalyticsViewsChart.tsx`** - Line chart
  - Views over time (7-30 days)

- **`AnalyticsTopPages.tsx`** - Bar chart
  - Most visited pages

- **`AnalyticsSourceChart.tsx`** - Pie chart
  - Traffic source breakdown

- **`AnalyticsDeviceChart.tsx`** - Bar chart
  - Device type distribution

- **`AnalyticsRecentVisitsTable.tsx`** - Data table
  - Recent visit records with details

### 4. Admin Page (`src/pages/admin/Analytics.tsx`)

Complete analytics dashboard with:

- Date range filter (Today, Last 7 Days, Last 30 Days, All Time)
- Summary cards
- Multiple charts and visualizations
- Recent visits table
- Real-time data updates

## Database Schema

Table: `portfolio_visit_events`

```sql
CREATE TABLE IF NOT EXISTS public.portfolio_visit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  session_id TEXT,
  page_key TEXT,
  page_url TEXT NOT NULL,
  referrer TEXT,
  traffic_source TEXT,
  device_type TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  user_agent TEXT,
  time_on_page_seconds INTEGER DEFAULT 0,
  max_scroll_percent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visit_created_at ON public.portfolio_visit_events(created_at DESC);
CREATE INDEX idx_visit_page_key ON public.portfolio_visit_events(page_key);
CREATE INDEX idx_visit_visitor ON public.portfolio_visit_events(visitor_id);
```

## Data Flow

### On Page Load

1. `usePortfolioAnalytics` hook initializes
2. Collects visitor data:
   - `visitor_id` from localStorage (or creates new)
   - `session_id` from sessionStorage (or creates new)
   - `page_key` from current route
   - `page_url`, `referrer`, `traffic_source`, `device_type`
   - `screen_width`, `screen_height`, `user_agent`
3. Inserts new record into `portfolio_visit_events`
4. Stores returned `id` for later update

### While on Page

1. Scroll listener tracks maximum scroll percentage
2. Updates `maxScrollPercent` in component state

### On Page Leave

1. Calculates `time_on_page_seconds` from start time
2. Updates record with:
   - `time_on_page_seconds`
   - `max_scroll_percent`

## Integration Points

### 1. App.tsx

- Imports `usePortfolioAnalytics` hook
- Calls hook in `AppContent` component
- Automatically tracks all pages

### 2. AdminLayout.tsx

- Added "Analytics" menu item with TrendingUp icon
- Positioned after Dashboard
- Links to `/admin/analytics`

### 3. App.tsx Routes

- Added protected route: `/admin/analytics` → `Analytics` page

## Usage

### For Developers

#### Access Analytics Data

```typescript
import {
  getAnalyticsSummary,
  getViewsByDay,
  getTopPages,
  getTrafficSourceBreakdown,
  getDeviceBreakdown,
  getRecentVisits,
} from "@/lib/analytics/queries";
import { getDateRange } from "@/lib/analytics/date-range";

// Get data for last 7 days
const [startDate, endDate] = getDateRange("last7days");
const summary = await getAnalyticsSummary(startDate, endDate);
const views = await getViewsByDay(startDate, endDate);
```

#### Track Custom Events

```typescript
import { insertVisitEvent, updateVisitEvent } from "@/lib/analytics/service";
import { getVisitorId } from "@/lib/analytics/visitor";
import { getSessionId } from "@/lib/analytics/session";

const eventId = await insertVisitEvent({
  visitor_id: getVisitorId(),
  session_id: getSessionId(),
  page_key: "custom-page",
  page_url: window.location.href,
  referrer: document.referrer,
  traffic_source: getTrafficSource(),
  device_type: getDeviceType(),
  screen_width: window.innerWidth,
  screen_height: window.innerHeight,
  user_agent: navigator.userAgent,
});

// Later, update with engagement metrics
await updateVisitEvent(eventId, timeInSeconds, scrollPercent);
```

### For Admin Users

1. Navigate to `/admin/analytics`
2. Select date range (Today, Last 7 Days, Last 30 Days, All Time)
3. View:
   - Summary metrics (cards at top)
   - Views over time (line chart)
   - Top pages (bar chart)
   - Traffic sources (pie chart)
   - Device types (bar chart)
   - Recent visits (table)

## File Structure

```
src/
├── lib/analytics/
│   ├── device.ts              # Device type detection
│   ├── page-key.ts            # Page key extraction
│   ├── queries.ts             # Analytics queries
│   ├── service.ts             # Supabase operations
│   ├── session.ts             # Session ID management
│   ├── traffic.ts             # Traffic source classification
│   ├── types.ts               # TypeScript interfaces
│   ├── visitor.ts             # Visitor ID management
│   └── date-range.ts          # Date range utilities
├── hooks/
│   └── usePortfolioAnalytics.ts  # Main tracking hook
├── components/admin/analytics/
│   ├── AnalyticsSummaryCards.tsx
│   ├── AnalyticsViewsChart.tsx
│   ├── AnalyticsTopPages.tsx
│   ├── AnalyticsSourceChart.tsx
│   ├── AnalyticsDeviceChart.tsx
│   └── AnalyticsRecentVisitsTable.tsx
└── pages/admin/
    └── Analytics.tsx          # Admin analytics page
```

## Features

✅ Automatic page tracking
✅ Visitor identification (persistent across sessions)
✅ Session tracking (per tab)
✅ Traffic source classification
✅ Device type detection
✅ Scroll depth tracking
✅ Time on page calculation
✅ Beautiful admin dashboard
✅ Multiple date range filters
✅ Real-time data updates
✅ Responsive charts and tables
✅ No external analytics services required

## Performance Considerations

- Tracking is non-blocking (async operations)
- Minimal data collection (no personal data)
- Efficient database queries with indexes
- Client-side aggregation for summary metrics
- Lazy loading of analytics page

## Privacy & Data

- No personally identifiable information collected
- Visitor IDs are random UUIDs (not linked to users)
- Session IDs are temporary (per tab)
- User agents stored for device classification
- Referrer stored for traffic source analysis
- All data stored in Supabase (your own database)

## Future Enhancements

- Export analytics data (CSV, PDF)
- Custom date range picker
- Comparison between date ranges
- Goal tracking
- Conversion funnel analysis
- User journey visualization
- Real-time analytics updates
- Email reports

## Troubleshooting

### No data appearing in analytics

1. Check that `portfolio_visit_events` table exists in Supabase
2. Verify Supabase credentials in `.env.local`
3. Check browser console for errors
4. Ensure tracking hook is running (check `usePortfolioAnalytics` in App.tsx)

### Incorrect traffic source classification

- Check `document.referrer` in browser console
- Verify traffic source logic in `src/lib/analytics/traffic.ts`

### Device type incorrect

- Check `window.innerWidth` in browser console
- Verify breakpoints in `src/lib/analytics/device.ts`

## Dependencies

- Supabase JS client (already in project)
- Recharts (already in project)
- React Router (already in project)
- Tailwind CSS (already in project)
- shadcn/ui components (already in project)

No additional dependencies required!
