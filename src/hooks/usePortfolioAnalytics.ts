/**
 * usePortfolioAnalytics hook
 * Tracks page visits and user interactions
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getVisitorId } from '@/lib/analytics/visitor';
import { getSessionId } from '@/lib/analytics/session';
import { getTrafficSource } from '@/lib/analytics/traffic';
import { getDeviceType } from '@/lib/analytics/device';
import { getPageKey } from '@/lib/analytics/page-key';
import { insertVisitEvent, updateVisitEvent } from '@/lib/analytics/service';
import { AnalyticsEventData } from '@/lib/analytics/types';
import { getExistingPageEventId, addPageToHistory } from '@/lib/analytics/page-history';

interface TrackingState {
    eventId: string | null;
    startTime: number;
    maxScrollPercent: number;
}

export const usePortfolioAnalytics = () => {
    const location = useLocation();
    const trackingStateRef = useRef<TrackingState>({
        eventId: null,
        startTime: Date.now(),
        maxScrollPercent: 0,
    });

    // Helper function to update previous event
    const updatePreviousEvent = async () => {
        const { eventId: prevEventId, startTime: prevStartTime, maxScrollPercent: prevMaxScroll } = trackingStateRef.current;

        if (prevEventId) {
            const timeOnPageSeconds = Math.round((Date.now() - prevStartTime) / 1000);
            await updateVisitEvent(prevEventId, timeOnPageSeconds, prevMaxScroll);
        }
    };

    // Track scroll depth
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrolled = window.scrollY;
                    const scrollPercent = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;

                    if (scrollPercent > trackingStateRef.current.maxScrollPercent) {
                        trackingStateRef.current.maxScrollPercent = scrollPercent;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track page visit
    useEffect(() => {
        const trackPageVisit = async () => {
            // Update previous event before tracking new page
            await updatePreviousEvent();

            const pageKey = getPageKey(location.pathname);

            // Check if this page was already visited in this session
            const existingEventId = getExistingPageEventId(pageKey);

            if (existingEventId) {
                // Page already visited in this session, just update the existing event
                trackingStateRef.current.eventId = existingEventId;
                trackingStateRef.current.startTime = Date.now();
                trackingStateRef.current.maxScrollPercent = 0;
                return;
            }

            // New page visit, create new event
            const visitorId = getVisitorId();
            const sessionId = getSessionId();
            const pageUrl = window.location.href;
            const referrer = document.referrer;
            const trafficSource = getTrafficSource();
            const deviceType = getDeviceType();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const userAgent = navigator.userAgent;

            const eventData: AnalyticsEventData = {
                visitor_id: visitorId,
                session_id: sessionId,
                page_key: pageKey,
                page_url: pageUrl,
                referrer,
                traffic_source: trafficSource,
                device_type: deviceType,
                screen_width: screenWidth,
                screen_height: screenHeight,
                user_agent: userAgent,
            };

            // Insert new event
            const eventId = await insertVisitEvent(eventData);

            if (!eventId) {
                console.error('Failed to insert analytics event');
                return;
            }

            // Add to page history to track that we've visited this page
            addPageToHistory(pageKey, eventId);

            trackingStateRef.current.eventId = eventId;
            trackingStateRef.current.startTime = Date.now();
            trackingStateRef.current.maxScrollPercent = 0;
        };

        trackPageVisit();
    }, [location.pathname]);

    // Update event when leaving page (beforeunload)
    useEffect(() => {
        const handleBeforeUnload = async () => {
            await updatePreviousEvent();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            updatePreviousEvent();
        };
    }, []);
};
