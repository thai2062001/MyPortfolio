/**
 * Analytics service
 * Handles tracking and updating visit events in Supabase
 */

import { supabase } from '@/lib/supabase';
import { PortfolioVisitEvent, AnalyticsEventData } from './types';

/**
 * Insert a new visit event
 */
export const insertVisitEvent = async (
    data: AnalyticsEventData
): Promise<string | null> => {
    try {
        const { data: result, error } = await supabase
            .from('portfolio_visit_events')
            .insert([data])
            .select('id')
            .single();

        if (error) {
            console.error('Error inserting visit event:', error);
            return null;
        }

        return result?.id || null;
    } catch (error) {
        console.error('Error inserting visit event:', error);
        return null;
    }
};

/**
 * Update visit event with time and scroll data
 */
export const updateVisitEvent = async (
    eventId: string,
    timeOnPageSeconds: number,
    maxScrollPercent: number
): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('portfolio_visit_events')
            .update({
                time_on_page_seconds: timeOnPageSeconds,
                max_scroll_percent: maxScrollPercent,
            })
            .eq('id', eventId)
            .select();

        if (error) {
            console.error('Error updating visit event:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error updating visit event:', error);
        return false;
    }
};
