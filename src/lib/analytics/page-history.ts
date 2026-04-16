/**
 * Page history tracking within a session
 * Prevents duplicate page views when revisiting pages
 */

const PAGE_HISTORY_KEY = 'portfolio_page_history';

interface PageHistoryEntry {
    pageKey: string;
    eventId: string;
    timestamp: number;
}

/**
 * Get page history for current session
 */
export const getPageHistory = (): PageHistoryEntry[] => {
    try {
        const history = sessionStorage.getItem(PAGE_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch {
        return [];
    }
};

/**
 * Check if page was already visited in this session
 * Returns the eventId if found, null otherwise
 */
export const getExistingPageEventId = (pageKey: string): string | null => {
    const history = getPageHistory();
    const existing = history.find(entry => entry.pageKey === pageKey);
    return existing?.eventId || null;
};

/**
 * Add page to history (only if it's a new page)
 */
export const addPageToHistory = (pageKey: string, eventId: string): void => {
    try {
        const history = getPageHistory();

        // Check if page already exists
        const existingIndex = history.findIndex(entry => entry.pageKey === pageKey);

        if (existingIndex === -1) {
            // New page, add to history
            history.push({
                pageKey,
                eventId,
                timestamp: Date.now(),
            });
            sessionStorage.setItem(PAGE_HISTORY_KEY, JSON.stringify(history));
        }
    } catch (error) {
        console.error('Error adding page to history:', error);
    }
};

/**
 * Clear page history (when session ends)
 */
export const clearPageHistory = (): void => {
    sessionStorage.removeItem(PAGE_HISTORY_KEY);
};
