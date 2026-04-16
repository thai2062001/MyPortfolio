/**
 * Session analytics queries
 * Fetches session-based analytics data
 */

import { supabase } from '@/lib/supabase';

export interface SessionSummary {
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

export interface PageInJourney {
    order: number;
    created_at: string;
    page_key: string;
    page_url: string;
    referrer: string;
    time_on_page_seconds: number;
    max_scroll_percent: number;
}

/**
 * Get all sessions with summary data
 */
export const getSessionsSummary = async (
    startDate: Date,
    endDate: Date,
    limit: number = 100
): Promise<SessionSummary[]> => {
    try {
        const { data, error } = await supabase
            .from('portfolio_visit_events')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .not('page_key', 'in', '(admin,analytics,dashboard)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching sessions:', error);
            return [];
        }

        if (!data) return [];

        // Group by session_id
        const sessionMap = new Map<string, any>();

        data.forEach((event) => {
            const key = event.session_id;

            if (!sessionMap.has(key)) {
                sessionMap.set(key, {
                    session_id: event.session_id,
                    visitor_id: event.visitor_id,
                    first_seen: event.created_at,
                    last_seen: event.created_at,
                    traffic_source: event.traffic_source,
                    device_type: event.device_type,
                    total_pages_viewed: 0,
                    total_time_spent: 0,
                    screen_width: event.screen_width,
                    screen_height: event.screen_height,
                    events: [],
                });
            }

            const session = sessionMap.get(key);
            session.events.push(event);
            session.last_seen = event.created_at;
            session.total_pages_viewed = session.events.length;
            session.total_time_spent += event.time_on_page_seconds || 0;
        });

        // Convert to array and sort by first_seen DESC
        const sessions = Array.from(sessionMap.values())
            .map((session) => ({
                session_id: session.session_id,
                visitor_id: session.visitor_id,
                first_seen: session.first_seen,
                last_seen: session.last_seen,
                traffic_source: session.traffic_source,
                device_type: session.device_type,
                total_pages_viewed: session.total_pages_viewed,
                total_time_spent: session.total_time_spent,
                screen_width: session.screen_width,
                screen_height: session.screen_height,
            }))
            .sort(
                (a, b) =>
                    new Date(b.first_seen).getTime() - new Date(a.first_seen).getTime()
            )
            .slice(0, limit);

        return sessions;
    } catch (error) {
        console.error('Error fetching sessions summary:', error);
        return [];
    }
};

/**
 * Get page journey for a specific session
 */
export const getSessionPageJourney = async (
    sessionId: string
): Promise<PageInJourney[]> => {
    try {
        const { data, error } = await supabase
            .from('portfolio_visit_events')
            .select('*')
            .eq('session_id', sessionId)
            .not('page_key', 'in', '(admin,analytics,dashboard)')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching page journey:', error);
            return [];
        }

        if (!data) return [];

        return data.map((event, index) => ({
            order: index + 1,
            created_at: event.created_at,
            page_key: event.page_key,
            page_url: event.page_url,
            referrer: event.referrer,
            time_on_page_seconds: event.time_on_page_seconds || 0,
            max_scroll_percent: event.max_scroll_percent || 0,
        }));
    } catch (error) {
        console.error('Error fetching page journey:', error);
        return [];
    }
};

/**
 * Get session detail
 */
export const getSessionDetail = async (
    sessionId: string
): Promise<SessionSummary | null> => {
    try {
        const { data, error } = await supabase
            .from('portfolio_visit_events')
            .select('*')
            .eq('session_id', sessionId)
            .not('page_key', 'in', '(admin,analytics,dashboard)')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching session detail:', error);
            return null;
        }

        if (!data || data.length === 0) return null;

        const firstEvent = data[0];
        const lastEvent = data[data.length - 1];

        const totalTimeSpent = data.reduce(
            (sum, event) => sum + (event.time_on_page_seconds || 0),
            0
        );

        return {
            session_id: sessionId,
            visitor_id: firstEvent.visitor_id,
            first_seen: firstEvent.created_at,
            last_seen: lastEvent.created_at,
            traffic_source: firstEvent.traffic_source,
            device_type: firstEvent.device_type,
            total_pages_viewed: data.length,
            total_time_spent: totalTimeSpent,
            screen_width: firstEvent.screen_width,
            screen_height: firstEvent.screen_height,
        };
    } catch (error) {
        console.error('Error fetching session detail:', error);
        return null;
    }
};
