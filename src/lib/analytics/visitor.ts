/**
 * Visitor ID management
 * Creates and persists a unique visitor identifier
 */

const VISITOR_ID_KEY = 'portfolio_visitor_id';

export const getVisitorId = (): string => {
    try {
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);

        if (!visitorId) {
            visitorId = crypto.randomUUID();
            localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }

        return visitorId;
    } catch (e) {
        console.warn('Storage access blocked, using session-only visitor ID');
        return crypto.randomUUID(); // Fallback to random ID for this session only
    }
};

export const resetVisitorId = (): void => {
    localStorage.removeItem(VISITOR_ID_KEY);
};
