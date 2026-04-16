/**
 * Analytics queries
 * Fetches analytics data from Supabase
 */

import { supabase } from '@/lib/supabase';

export interface AnalyticsSummary {
    totalViews: number;
    todayViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    avgScrollDepth: number;
}

export interface ViewsByDay {
    date: string;
    views: number;
}

export interface TopPage {
    page_key: string;
    views: number;
}

export interface TrafficSourceBreakdown {
    traffic_source: string;
    views: number;
    percentage: number;
}

export interface DeviceBreakdown {
    device_type: string;
    views: number;
    percentage: number;
}

export interface RecentVisit {
    id: string;
    created_at: string;
    page_key: string;
    page_url: string;
    referrer: string;
    traffic_source: string;
    device_type: string;
    screen_width: number;
    screen_height: number;
    time_on_page_seconds: number;
    max_scroll_percent: number;
}

/**
 * Get analytics summary for a date range
 */
export const getAnalyticsSummary = async (
    startDate: Date,
    endDate: Date
): Promise<AnalyticsSummary> => {
    try {
        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();

        // Total views
        const { count: totalViews } = await supabase
            .from('portfolio_visit_events')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startDateStr)
            .lte('created_at', endDateStr);

        // Unique visitors
        const { data: uniqueVisitorsData } = await supabase
            .from('portfolio_visit_events')
            .select('visitor_id', { count: 'exact' })
            .gte('created_at', startDateStr)
            .lte('created_at', endDateStr);

        const uniqueVisitors = new Set(
            uniqueVisitorsData?.map((v) => v.visitor_id) || []
        ).size;

        // Average time on page
        const { data: timeData } = await supabase
            .from('portfolio_visit_events')
            .select('time_on_page_seconds')
            .gte('created_at', startDateStr)
            .lte('created_at', endDateStr)
            .not('time_on_page_seconds', 'is', null);

        const avgTimeOnPage =
            timeData && timeData.length > 0
                ? Math.round(
                    timeData.reduce((sum, item) => sum + (item.time_on_page_seconds || 0), 0) /
                    timeData.length
                )
                : 0;

        // Average scroll depth
        const { data: scrollData } = await supabase
            .from('portfolio_visit_events')
            .select('max_scroll_percent')
            .gte('created_at', startDateStr)
            .lte('created_at', endDateStr)
            .not('max_scroll_percent', 'is', null);

        const avgScrollDepth =
            scrollData && scrollData.length > 0
                ? Math.round(
                    scrollData.reduce((sum, item) => sum + (item.max_scroll_percent || 0), 0) /
                    scrollData.length
                )
                : 0;

        // Today views
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { count: todayViews } = await supabase
            .from('portfolio_visit_events')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString())
            .lt('created_at', tomorrow.toISOString());

        return {
            totalViews: totalViews || 0,
            todayViews: todayViews || 0,
            uniqueVisitors,
            avgTimeOnPage,
            avgScrollDepth,
        };
    } catch (error) {
        console.error('Error fetching analytics summary:', error);
        return {
            totalViews: 0,
            todayViews: 0,
            uniqueVisitors: 0,
            avgTimeOnPage: 0,
            avgScrollDepth: 0,
        };
    }
};

/**
 * Get views by day for a date range
 */
export const getViewsByDay = async (
    startDate: Date,
    endDate: Date
): Promise<ViewsByDay[]> => {
    try {
        const { data } = await supabase
            .from('portfolio_visit_events')
            .select('created_at')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .order('created_at', { ascending: true });

        if (!data) return [];

        // Group by day
        const viewsByDay: { [key: string]: number } = {};

        data.forEach((item) => {
            const date = new Date(item.created_at);
            const dateStr = date.toISOString().split('T')[0];
            viewsByDay[dateStr] = (viewsByDay[dateStr] || 0) + 1;
        });

        // Fill in missing days
        const result: ViewsByDay[] = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            const dateStr = current.toISOString().split('T')[0];
            result.push({
                date: dateStr,
                views: viewsByDay[dateStr] || 0,
            });
            current.setDate(current.getDate() + 1);
        }

        return result;
    } catch (error) {
        console.error('Error fetching views by day:', error);
        return [];
    }
};

/**
 * Get top pages
 */
export const getTopPages = async (
    startDate: Date,
    endDate: Date,
    limit: number = 10
): Promise<TopPage[]> => {
    try {
        const { data } = await supabase
            .from('portfolio_visit_events')
            .select('page_key')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        if (!data) return [];

        // Group by page_key
        const pageViews: { [key: string]: number } = {};

        data.forEach((item) => {
            pageViews[item.page_key] = (pageViews[item.page_key] || 0) + 1;
        });

        // Sort and limit
        return Object.entries(pageViews)
            .map(([page_key, views]) => ({ page_key, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching top pages:', error);
        return [];
    }
};

/**
 * Get traffic source breakdown
 */
export const getTrafficSourceBreakdown = async (
    startDate: Date,
    endDate: Date
): Promise<TrafficSourceBreakdown[]> => {
    try {
        const { data } = await supabase
            .from('portfolio_visit_events')
            .select('traffic_source')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        if (!data) return [];

        // Group by traffic_source
        const sourceViews: { [key: string]: number } = {};

        data.forEach((item) => {
            sourceViews[item.traffic_source] = (sourceViews[item.traffic_source] || 0) + 1;
        });

        const total = data.length;

        return Object.entries(sourceViews)
            .map(([traffic_source, views]) => ({
                traffic_source,
                views,
                percentage: total > 0 ? Math.round((views / total) * 100) : 0,
            }))
            .sort((a, b) => b.views - a.views);
    } catch (error) {
        console.error('Error fetching traffic source breakdown:', error);
        return [];
    }
};

/**
 * Get device breakdown
 */
export const getDeviceBreakdown = async (
    startDate: Date,
    endDate: Date
): Promise<DeviceBreakdown[]> => {
    try {
        const { data } = await supabase
            .from('portfolio_visit_events')
            .select('device_type')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());

        if (!data) return [];

        // Group by device_type
        const deviceViews: { [key: string]: number } = {};

        data.forEach((item) => {
            deviceViews[item.device_type] = (deviceViews[item.device_type] || 0) + 1;
        });

        const total = data.length;

        return Object.entries(deviceViews)
            .map(([device_type, views]) => ({
                device_type,
                views,
                percentage: total > 0 ? Math.round((views / total) * 100) : 0,
            }))
            .sort((a, b) => b.views - a.views);
    } catch (error) {
        console.error('Error fetching device breakdown:', error);
        return [];
    }
};

/**
 * Get recent visits
 */
export const getRecentVisits = async (
    startDate: Date,
    endDate: Date,
    limit: number = 50
): Promise<RecentVisit[]> => {
    try {
        const { data } = await supabase
            .from('portfolio_visit_events')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .order('created_at', { ascending: false })
            .limit(limit);

        return (data || []) as RecentVisit[];
    } catch (error) {
        console.error('Error fetching recent visits:', error);
        return [];
    }
};
