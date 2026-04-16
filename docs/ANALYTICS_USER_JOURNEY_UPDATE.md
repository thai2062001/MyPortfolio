# Analytics User Journey Enhancement

## 🎯 Overview

Analytics page has been significantly improved to show **clear user journeys**. Now you can see exactly what pages each visitor viewed, in what order, and how long they spent on each page.

## ✨ What's New

### 1. **User Sessions Tab**

- New tab showing all visitor sessions
- Displays session summary with key metrics
- Click "View Detail" to see full user journey

### 2. **Session Summary Table**

Columns:

- **First Seen** - When session started
- **Visitor ID** - Unique visitor identifier (truncated, copy button)
- **Session ID** - Session identifier (truncated, copy button)
- **Traffic Source** - Where visitor came from (badge)
- **Device** - Device type (badge)
- **Pages** - Total pages viewed in session
- **Time Spent** - Total time in session (formatted: 1m 24s)
- **Action** - View detail button

### 3. **Session Detail Drawer**

When you click "View Detail", a drawer opens showing:

**Session Summary Section:**

- Visitor ID (full, copyable)
- Session ID (full, copyable)
- First Seen (timestamp)
- Last Seen (timestamp)
- Traffic Source (badge)
- Device Type (badge)
- Screen Size (if available)
- Total Pages Viewed
- Total Time Spent (formatted)

**Page Journey Section:**
Timeline of all pages visited in order:

- **#** - Order number (1, 2, 3...)
- **Time** - When page was visited
- **Page** - Page key (home, portfolio, etc.)
- **URL** - Full page URL (truncated, hover to see full)
- **Time (s)** - Seconds spent on page
- **Scroll %** - Maximum scroll depth

## 📁 Files Created

### New Components

1. **`src/components/admin/analytics/AnalyticsSessionsTable.tsx`**
   - Displays sessions in table format
   - Shows summary metrics per session
   - Copy buttons for IDs
   - View detail button

2. **`src/components/admin/analytics/SessionDetailDrawer.tsx`**
   - Drawer showing full session details
   - Session summary cards
   - Page journey table
   - Copy functionality for IDs

### New Utilities

3. **`src/lib/analytics/session-queries.ts`**
   - `getSessionsSummary()` - Get all sessions with metrics
   - `getSessionPageJourney()` - Get pages in order for a session
   - `getSessionDetail()` - Get full session details
   - Filters out admin pages automatically

4. **`src/lib/analytics/format.ts`**
   - `formatTime()` - Format seconds to "1m 24s"
   - `formatDate()` - Format timestamps
   - `formatDateShort()` - Short date format
   - `truncateId()` - Truncate IDs with ellipsis
   - `truncateUrl()` - Truncate URLs
   - `getTrafficSourceLabel()` - Get readable traffic source
   - `getTrafficSourceColor()` - Get badge color for traffic source
   - `getDeviceTypeLabel()` - Get readable device type
   - `getDeviceTypeColor()` - Get badge color for device type

### Updated Files

5. **`src/pages/admin/Analytics.tsx`**
   - Added Tabs component (Overview & User Sessions)
   - Integrated sessions data fetching
   - Added session detail drawer
   - Updated header description

## 🎨 UI Features

### Tabs

- **Overview** - Original charts and metrics
- **User Sessions** - New sessions table and journey view

### Badges

- Traffic sources: Google (red), Facebook (blue), Instagram (purple), LinkedIn (cyan), Direct (blue), Referral (orange)
- Device types: Mobile (blue), Tablet (green), Desktop (purple)

### Copy Buttons

- Visitor ID and Session ID have copy buttons
- Shows "Copied!" confirmation for 2 seconds

### Time Formatting

- `45s` - Less than 1 minute
- `1m` - Exactly 1 minute
- `1m 24s` - Minutes and seconds

### Responsive Design

- Table scrolls horizontally on small screens
- Drawer adjusts width on mobile
- All components responsive

## 🔍 How to Use

### View Sessions

1. Go to `/admin/analytics`
2. Click "User Sessions" tab
3. See all sessions with summary metrics
4. Sessions sorted by most recent first

### View User Journey

1. In sessions table, click "View Detail" button
2. Drawer opens on the right
3. See session summary at top
4. Scroll down to see page journey
5. Each row shows one page visit with:
   - Order number
   - Time visited
   - Page name
   - URL
   - Time spent
   - Scroll depth

### Copy IDs

1. Click copy icon next to Visitor ID or Session ID
2. "Copied!" message appears
3. ID is copied to clipboard

## 📊 Data Filtering

All data respects the date range filter:

- Today
- Last 7 Days
- Last 30 Days
- All Time

Admin pages are automatically filtered out:

- `admin`
- `analytics`
- `dashboard`

## 🔧 Technical Details

### Session Grouping

Sessions are grouped by `session_id` and `visitor_id`:

- Calculates first_seen (MIN created_at)
- Calculates last_seen (MAX created_at)
- Counts total pages (COUNT)
- Sums total time (SUM time_on_page_seconds)

### Page Journey

Pages are ordered by `created_at` ascending:

- Shows exact order user visited pages
- Includes all engagement metrics
- Preserves referrer information

### Performance

- Efficient Supabase queries
- Client-side grouping for sessions
- Lazy loading of drawer content
- No N+1 queries

## 📋 Example User Journey

```
Session: abc123def456
Visitor: xyz789

Page Journey:
1. 10:30:00 - home (30s, 45% scroll)
2. 10:30:35 - portfolio (2m 15s, 85% scroll)
3. 10:32:50 - project-detail (1m 45s, 100% scroll)
4. 10:34:35 - contact (45s, 20% scroll)

Total: 4 pages, 5m 15s
```

## 🎯 Key Improvements

✅ **Clear User Journey** - See exactly what pages users visit
✅ **Chronological Order** - Pages shown in order visited
✅ **Engagement Metrics** - Time and scroll depth per page
✅ **Session Context** - Understand traffic source and device
✅ **Easy Navigation** - Copy IDs, view details with one click
✅ **Responsive** - Works on all screen sizes
✅ **Formatted Data** - Time shown as "1m 24s", not raw seconds
✅ **Admin Filtered** - Admin pages excluded automatically

## 🚀 Next Steps

1. Visit `/admin/analytics`
2. Click "User Sessions" tab
3. Click "View Detail" on any session
4. See the full user journey!

## 📝 Notes

- Sessions are grouped by `session_id` (per tab/browser)
- Visitor ID persists across sessions (localStorage)
- Admin pages (admin, analytics, dashboard) are filtered out
- All times are in UTC (from Supabase)
- Scroll depth is maximum scroll percentage during visit

## 🐛 Troubleshooting

**No sessions showing?**

- Check date range filter
- Make sure you have visit events in the database
- Admin pages are filtered out

**IDs not copying?**

- Check browser console for errors
- Ensure clipboard API is available

**Drawer not opening?**

- Check browser console for errors
- Ensure session ID is valid

## 📞 Support

For issues or questions, check:

1. Browser console for errors
2. Supabase dashboard for data
3. Date range filter settings
4. Admin page filtering logic
