# Analytics Quick Start Guide

## ✅ Setup Complete

Analytics tracking has been fully implemented and integrated into your portfolio.

## 🚀 What's Working Now

### Automatic Tracking

- ✅ Visitor ID tracking (persists across sessions)
- ✅ Session ID tracking (per tab)
- ✅ Page view tracking (all pages)
- ✅ Scroll depth tracking (max scroll %)
- ✅ Time on page tracking (seconds)
- ✅ Traffic source classification (direct, google, facebook, instagram, linkedin, referral)
- ✅ Device type detection (mobile, tablet, desktop)
- ✅ Screen resolution tracking
- ✅ User agent tracking

### Admin Dashboard

- ✅ Analytics page at `/admin/analytics`
- ✅ Date range filters (Today, Last 7 Days, Last 30 Days, All Time)
- ✅ Summary cards (5 key metrics)
- ✅ Views over time chart
- ✅ Top pages chart
- ✅ Traffic sources chart
- ✅ Device types chart
- ✅ Recent visits table
- ✅ Sidebar menu item

## 📊 How to Access Analytics

1. **Login to Admin**: Go to `/admin/login`
2. **Navigate to Analytics**: Click "Analytics" in the sidebar (or go to `/admin/analytics`)
3. **Select Date Range**: Choose Today, Last 7 Days, Last 30 Days, or All Time
4. **View Metrics**: See all your portfolio analytics

## 📈 What Gets Tracked

For each page visit, the system records:

| Field                | Example                                | Purpose                   |
| -------------------- | -------------------------------------- | ------------------------- |
| visitor_id           | `550e8400-e29b-41d4-a716-446655440000` | Unique visitor identifier |
| session_id           | `550e8400-e29b-41d4-a716-446655440001` | Session per tab           |
| page_key             | `home`, `portfolio`, `project-detail`  | Page identifier           |
| page_url             | `https://example.com/portfolio`        | Full URL                  |
| referrer             | `https://google.com`                   | Where visitor came from   |
| traffic_source       | `google`, `direct`, `facebook`         | Traffic classification    |
| device_type          | `mobile`, `tablet`, `desktop`          | Device classification     |
| screen_width         | `1920`                                 | Screen width in pixels    |
| screen_height        | `1080`                                 | Screen height in pixels   |
| user_agent           | `Mozilla/5.0...`                       | Browser info              |
| time_on_page_seconds | `45`                                   | Seconds spent on page     |
| max_scroll_percent   | `75`                                   | Maximum scroll depth %    |
| created_at           | `2024-03-31T10:30:00Z`                 | Timestamp                 |

## 🔧 Technical Details

### Files Created (19 new files)

**Analytics Library** (`src/lib/analytics/`)

- `visitor.ts` - Visitor ID management
- `session.ts` - Session ID management
- `page-key.ts` - Page key extraction
- `traffic.ts` - Traffic source classification
- `device.ts` - Device type detection
- `date-range.ts` - Date range utilities
- `types.ts` - TypeScript interfaces
- `service.ts` - Supabase operations
- `queries.ts` - Analytics queries

**React Hook**

- `src/hooks/usePortfolioAnalytics.ts` - Main tracking hook

**Admin Components** (`src/components/admin/analytics/`)

- `AnalyticsSummaryCards.tsx` - Summary metrics
- `AnalyticsViewsChart.tsx` - Views chart
- `AnalyticsTopPages.tsx` - Top pages chart
- `AnalyticsSourceChart.tsx` - Traffic sources chart
- `AnalyticsDeviceChart.tsx` - Device types chart
- `AnalyticsRecentVisitsTable.tsx` - Recent visits table

**Admin Page**

- `src/pages/admin/Analytics.tsx` - Main dashboard

**Documentation**

- `ANALYTICS_IMPLEMENTATION.md` - Full documentation
- `ANALYTICS_FILES_SUMMARY.md` - Files summary
- `ANALYTICS_QUICK_START.md` - This file

### Files Modified (2 files)

1. **`src/App.tsx`**
   - Added `usePortfolioAnalytics` hook import
   - Added `Analytics` page import
   - Called hook in `AppContent` component
   - Added `/admin/analytics` route

2. **`src/components/admin/AdminLayout.tsx`**
   - Added `TrendingUp` icon import
   - Added "Analytics" menu item

## 🎯 Key Features

### 1. Automatic Tracking

No code needed - tracking starts automatically when the app loads.

### 2. Privacy-Focused

- No personal data collected
- Random UUIDs for visitor identification
- All data in your Supabase instance
- No external analytics services

### 3. Beautiful Dashboard

- Modern, clean UI
- Responsive design
- Multiple chart types
- Real-time data updates

### 4. Flexible Queries

- Date range filtering
- Summary metrics
- Detailed breakdowns
- Recent visit records

## 💡 Usage Examples

### View Analytics in Admin

```
1. Go to /admin/analytics
2. Select date range
3. View all metrics and charts
```

### Access Data Programmatically

```typescript
import { getAnalyticsSummary, getViewsByDay } from "@/lib/analytics/queries";
import { getDateRange } from "@/lib/analytics/date-range";

// Get last 7 days data
const [start, end] = getDateRange("last7days");
const summary = await getAnalyticsSummary(start, end);
const views = await getViewsByDay(start, end);

console.log(`Total views: ${summary.totalViews}`);
console.log(`Unique visitors: ${summary.uniqueVisitors}`);
```

### Get Specific Metrics

```typescript
import {
  getTopPages,
  getTrafficSourceBreakdown,
} from "@/lib/analytics/queries";

const topPages = await getTopPages(start, end, 10);
const sources = await getTrafficSourceBreakdown(start, end);

topPages.forEach((page) => {
  console.log(`${page.page_key}: ${page.views} views`);
});
```

## 🐛 Troubleshooting

### No data in analytics?

1. Check that `portfolio_visit_events` table exists in Supabase
2. Verify `.env.local` has correct Supabase credentials
3. Check browser console for errors
4. Make sure you've visited pages after deployment

### Wrong traffic source?

- Check `document.referrer` in browser console
- Verify referrer is being sent correctly

### Device type incorrect?

- Check `window.innerWidth` in browser console
- Verify breakpoints: mobile <768px, tablet 768-1023px, desktop ≥1024px

### Charts not showing?

- Ensure Recharts is installed (it is)
- Check browser console for errors
- Verify data is being fetched

## 📱 Supported Browsers

Works in all modern browsers that support:

- `crypto.randomUUID()` (all modern browsers)
- `localStorage` and `sessionStorage`
- ES6+ JavaScript

## 🔐 Security Notes

- ✅ No authentication required for tracking (runs on client)
- ✅ Admin page requires authentication
- ✅ All data stored in your Supabase instance
- ✅ No external API calls
- ✅ No cookies or tracking pixels

## 📊 Database

Uses existing table: `portfolio_visit_events`

Indexes for performance:

- `idx_visit_created_at` - For date range queries
- `idx_visit_page_key` - For page analysis
- `idx_visit_visitor` - For visitor tracking

## 🚀 Next Steps

1. **Test Tracking**: Visit different pages and check analytics
2. **Monitor Traffic**: Check `/admin/analytics` regularly
3. **Analyze Patterns**: Look for trends in traffic sources and pages
4. **Optimize**: Use insights to improve portfolio

## 📞 Support

For issues or questions:

1. Check `ANALYTICS_IMPLEMENTATION.md` for detailed docs
2. Review code comments in analytics library
3. Check browser console for errors
4. Verify Supabase connection

## ✨ What's Included

- ✅ Complete tracking system
- ✅ Beautiful admin dashboard
- ✅ Multiple chart types
- ✅ Data tables
- ✅ Date range filtering
- ✅ TypeScript support
- ✅ Responsive design
- ✅ No external dependencies
- ✅ Full documentation
- ✅ Privacy-focused

## 🎉 You're All Set!

Analytics is now live on your portfolio. Start tracking visitor behavior and gain insights into your portfolio performance!

Visit `/admin/analytics` to see your data.
