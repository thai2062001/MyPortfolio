/**
 * Session ID management
 * Creates a unique session identifier per tab/session
 */

const SESSION_ID_KEY = 'portfolio_session_id';

export const getSessionId = (): string => {
    try {
        let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

        if (!sessionId) {
            sessionId = crypto.randomUUID();
            sessionStorage.setItem(SESSION_ID_KEY, sessionId);
        }

        return sessionId;
    } catch (e) {
        return crypto.randomUUID();
    }
};
