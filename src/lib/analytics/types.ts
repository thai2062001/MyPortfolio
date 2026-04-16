/**
 * Analytics types
 */

export interface PortfolioVisitEvent {
    id?: string;
    visitor_id: string;
    session_id: string;
    page_key: string;
    page_url: string;
    referrer: string;
    traffic_source: string;
    device_type: string;
    screen_width: number;
    screen_height: number;
    user_agent: string;
    time_on_page_seconds?: number;
    max_scroll_percent?: number;
    created_at?: string;
}

export interface AnalyticsEventData {
    visitor_id: string;
    session_id: string;
    page_key: string;
    page_url: string;
    referrer: string;
    traffic_source: string;
    device_type: string;
    screen_width: number;
    screen_height: number;
    user_agent: string;
}
