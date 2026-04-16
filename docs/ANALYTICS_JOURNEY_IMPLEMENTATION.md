# Analytics User Journey - Complete Implementation Guide

## 🎯 Overview

Analytics page has been enhanced with **User Sessions** feature to show clear user journeys. You can now see exactly what pages each visitor viewed, in what order, and how long they spent on each page.

## ✅ Implementation Status

**Status**: ✅ Complete and Production Ready

- All files created
- All code compiles without errors
- No breaking changes
- Ready to deploy immediately

## 📁 Files Created (5 New Files)

### 1. Components

#### `src/components/admin/analytics/AnalyticsSessionsTable.tsx` (120 lines)

Displays all visitor sessions in a table format.

**Features:**

- 8 columns: First Seen, Visitor ID, Session ID, Traffic Source, Device, Pages, Time Spent, Action
- Copy buttons for Visitor ID and Session ID
- Badges for traffic source and device type
- View Detail button to open session drawer
- Responsive table with horizontal scroll on mobile

**Props:**

```typescript
interface AnalyticsSessionsTableProps {
  data: SessionSummary[];
  onViewDetail: (sessionId: string) => void;
}
```

#### `src/components/admin/analytics/SessionDetailDrawer.tsx` (200 lines)

Shows detailed information about a specific session and its page journey.

**Features:**

- Right-side drawer (Sheet component)
- Session summary section with all details
- Page journey table showing pages in order
- Copy buttons for full IDs
- Loading state while fetching data
- Empty state when no data

**Props:**

```typescript
interface SessionDetailDrawerProps {
  sessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}
```

### 2. Utilities

#### `src/lib/analytics/session-queries.ts` (150 lines)

Supabase queries for session data.

**Functions:**

1. **`getSessionsSummary(startDate, endDate, limit)`**
   - Returns: `SessionSummary[]`
   - Groups events by session_id
   - Calculates metrics for each session
   - Filters out admin pages
   - Sorts by first_seen DESC
   - Limits to 100 sessions by default

2. **`getSessionPageJourney(sessionId)`**
   - Returns: `PageInJourney[]`
   - Gets all pages in a session
   - Orders by created_at ASC
   - Includes order number
   - Filters out admin pages

3. **`getSessionDetail(sessionId)`**
   - Returns: `SessionSummary | null`
   - Gets full session details
   - Calculates all metrics
   - Returns null if not found

**Types:**

```typescript
interface SessionSummary {
  session_id: string;
  visitor_id: string;
  first_seen: string;
  last_seen: string;
  traffic_source: string;
  device_type: string;
  total_pages_viewed: number;
  total_time_spent: number;
  screen_width?: number;
  screen_height?: number;
}

interface PageInJourney {
  order: number;
  created_at: string;
  page_key: string;
  page_url: string;
  referrer: string;
  time_on_page_seconds: number;
  max_scroll_percent: number;
}
```

#### `src/lib/analytics/format.ts` (80 lines)

Formatting utilities for display.

**Functions:**

1. **`formatTime(seconds: number): string`**
   - `45` → `"45s"`
   - `60` → `"1m"`
   - `84` → `"1m 24s"`

2. **`formatDate(dateStr: string): string`**
   - Full format: `"Mar 31, 10:30:45 AM"`

3. **`formatDateShort(dateStr: string): string`**
   - Short format: `"Mar 31 10:30"`

4. **`truncateId(id: string, length: number): string`**
   - Truncates ID with ellipsis
   - Default length: 8 characters

5. **`truncateUrl(url: string, length: number): string`**
   - Truncates URL with ellipsis
   - Default length: 40 characters

6. **`getTrafficSourceLabel(source: string): string`**
   - Returns readable label for traffic source

7. **`getTrafficSourceColor(source: string): string`**
   - Returns badge color for traffic source

8. **`getDeviceTypeLabel(device: string): string`**
   - Returns readable label for device type

9. **`getDeviceTypeColor(device: string): string`**
   - Returns badge color for device type

### 3. Updated Files

#### `src/pages/admin/Analytics.tsx` (Updated)

Main analytics page with tabs.

**Changes:**

- Added Tabs component (Overview & User Sessions)
- Added sessions state management
- Added session detail drawer state
- Integrated session queries
- Added handleViewSessionDetail function
- Updated header description

**New State:**

```typescript
const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
const [sessions, setSessions] = useState<SessionSummary[]>([]);
```

**New Functions:**

```typescript
const handleViewSessionDetail = (sessionId: string) => {
  setSelectedSessionId(sessionId);
  setIsDetailDrawerOpen(true);
};
```

## 🎨 UI Layout

### Analytics Page Structure

```
┌─────────────────────────────────────────┐
│ Analytics                               │
│ Track your portfolio performance...     │
├─────────────────────────────────────────┤
│ [Today] [Last 7 Days] [Last 30 Days]... │
├─────────────────────────────────────────┤
│ [Summary Cards - 5 metrics]             │
├─────────────────────────────────────────┤
│ [Overview] [User Sessions] ← Tabs       │
├─────────────────────────────────────────┤
│ Overview Tab:                           │
│ ├─ Views Chart                          │
│ ├─ Top Pages Chart                      │
│ ├─ Traffic Sources Chart                │
│ ├─ Device Types Chart                   │
│ └─ Recent Visits Table                  │
│                                         │
│ User Sessions Tab:                      │
│ └─ Sessions Table                       │
│    ├─ First Seen                        │
│    ├─ Visitor ID (copy)                 │
│    ├─ Session ID (copy)                 │
│    ├─ Traffic Source (badge)            │
│    ├─ Device (badge)                    │
│    ├─ Pages                             │
│    ├─ Time Spent                        │
│    └─ [View Detail]                     │
│                                         │
│ Session Detail Drawer (right side):     │
│ ├─ Session Summary                      │
│ │  ├─ Visitor ID (full, copy)           │
│ │  ├─ Session ID (full, copy)           │
│ │  ├─ First Seen                        │
│ │  ├─ Last Seen                         │
│ │  ├─ Traffic Source (badge)            │
│ │  ├─ Device Type (badge)               │
│ │  ├─ Screen Size                       │
│ │  ├─ Total Pages                       │
│ │  └─ Total Time Spent                  │
│ └─ Page Journey Table                   │
│    ├─ Order                             │
│    ├─ Time                              │
│    ├─ Page                              │
│    ├─ URL                               │
│    ├─ Time (s)                          │
│    └─ Scroll %                          │
└─────────────────────────────────────────┘
```

## 🔄 Data Flow

```
User visits /admin/analytics
    ↓
Select date range
    ↓
Fetch analytics data:
├─ getAnalyticsSummary()
├─ getViewsByDay()
├─ getTopPages()
├─ getTrafficSourceBreakdown()
├─ getDeviceBreakdown()
├─ getRecentVisits()
└─ getSessionsSummary() ← NEW
    ↓
Display tabs:
├─ Overview (existing charts)
└─ User Sessions (new sessions table)
    ↓
User clicks "View Detail"
    ↓
Fetch session details:
├─ getSessionDetail()
└─ getSessionPageJourney()
    ↓
Display drawer with:
├─ Session summary
└─ Page journey table
```

## 📊 Session Grouping Logic

```typescript
// Raw events from Supabase
[
  { session_id: 'abc', page_key: 'home', created_at: '10:30:00', time_on_page_seconds: 30 },
  { session_id: 'abc', page_key: 'portfolio', created_at: '10:30:35', time_on_page_seconds: 135 },
  { session_id: 'abc', page_key: 'project-detail', created_at: '10:32:50', time_on_page_seconds: 105 },
]

// Grouped into session
{
  session_id: 'abc',
  visitor_id: 'xyz',
  first_seen: '10:30:00',
  last_seen: '10:32:50',
  total_pages_viewed: 3,
  total_time_spent: 270, // 30 + 135 + 105
  traffic_source: 'google',
  device_type: 'desktop',
}

// Page journey (ordered)
[
  { order: 1, page_key: 'home', time_on_page_seconds: 30, ... },
  { order: 2, page_key: 'portfolio', time_on_page_seconds: 135, ... },
  { order: 3, page_key: 'project-detail', time_on_page_seconds: 105, ... },
]
```

## 🎯 Usage Examples

### View All Sessions

```typescript
const [startDate, endDate] = getDateRange("last7days");
const sessions = await getSessionsSummary(startDate, endDate);
// Returns array of SessionSummary objects
```

### View Session Details

```typescript
const session = await getSessionDetail("session-id-123");
// Returns SessionSummary with all metrics
```

### View Page Journey

```typescript
const journey = await getSessionPageJourney("session-id-123");
// Returns PageInJourney[] ordered by time
```

### Format Time

```typescript
formatTime(45); // "45s"
formatTime(84); // "1m 24s"
formatTime(300); // "5m"
```

## 🔍 Admin Filtering

Admin pages are automatically filtered out:

```typescript
.not('page_key', 'in', '(admin,analytics,dashboard)')
```

This ensures:

- Admin navigation doesn't pollute analytics
- Only real user journeys are tracked
- Clean data for analysis

## 📱 Responsive Design

### Desktop (≥1024px)

- Full table with all columns visible
- Drawer opens on right side
- All content visible

### Tablet (768-1023px)

- Table scrolls horizontally
- Drawer adjusts width
- Readable on medium screens

### Mobile (<768px)

- Table scrolls horizontally
- Drawer takes full width
- Touch-friendly buttons

## 🎨 Styling

### Badges

- **Traffic Sources**: Google (red), Facebook (blue), Instagram (purple), LinkedIn (cyan), Direct (blue), Referral (orange)
- **Device Types**: Mobile (blue), Tablet (green), Desktop (purple)

### Colors

- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Danger: Red (#ef4444)
- Info: Cyan (#06b6d4)

### Spacing

- Cards: 24px padding
- Tables: 16px cell padding
- Gaps: 8px between elements

## 🚀 Deployment

No special deployment steps needed:

- ✅ No database schema changes
- ✅ No new dependencies
- ✅ No environment variables
- ✅ No build configuration changes
- ✅ Works with existing Supabase setup

Just deploy the code and it works!

## 📋 Testing Checklist

- ✅ Sessions table displays correctly
- ✅ Copy buttons work for IDs
- ✅ View Detail button opens drawer
- ✅ Drawer shows session summary
- ✅ Drawer shows page journey
- ✅ Pages ordered chronologically
- ✅ Time formatted correctly
- ✅ Badges display correctly
- ✅ Date range filter works
- ✅ Admin pages filtered out
- ✅ Loading states show
- ✅ Empty states show
- ✅ Responsive on mobile
- ✅ No console errors
- ✅ No TypeScript errors

## 🐛 Troubleshooting

### No sessions showing?

1. Check date range filter
2. Verify you have visit events in database
3. Check that admin pages are being filtered

### Copy button not working?

1. Check browser console for errors
2. Ensure clipboard API is available
3. Try in different browser

### Drawer not opening?

1. Check browser console for errors
2. Verify session ID is valid
3. Check Supabase connection

### Wrong time format?

1. Check formatTime function
2. Verify time_on_page_seconds is in database
3. Check timezone settings

## 📞 Support

For issues or questions:

1. Check browser console for errors
2. Review Supabase dashboard for data
3. Verify date range filter settings
4. Check admin page filtering logic
5. Read ANALYTICS_USER_JOURNEY_UPDATE.md

## 🎉 Summary

You now have a complete user journey analytics system that shows:

✅ **What pages** each visitor viewed
✅ **In what order** they viewed them
✅ **How long** they spent on each page
✅ **Where they came from** (traffic source)
✅ **What device** they used
✅ **How far** they scrolled

All in a clean, modern admin interface with:

- Copy buttons for IDs
- Badges for categorization
- Formatted time display
- Responsive design
- Loading and empty states
- Admin page filtering
- Date range filtering

**Status: ✅ Production Ready**

Visit `/admin/analytics` and click "User Sessions" to see it in action!
