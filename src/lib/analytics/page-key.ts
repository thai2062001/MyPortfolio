/**
 * Page key extraction from current route
 * Maps routes to meaningful page identifiers
 */

export const getPageKey = (pathname: string): string => {
    // Remove leading/trailing slashes
    const path = pathname.replace(/^\/|\/$/g, '');

    if (!path || path === '') {
        return 'home';
    }

    // Handle nested routes
    const segments = path.split('/');

    // /portfolio => portfolio
    if (segments[0] === 'portfolio') {
        return 'portfolio';
    }

    // /project/:slug => project-detail
    if (segments[0] === 'project') {
        return 'project-detail';
    }

    // /skills => skills
    if (segments[0] === 'skills') {
        // /skills/:slug => skill-category
        if (segments.length > 1 && segments[2]) {
            return 'skill-detail';
        }
        // /skills/:slug => skill-category
        if (segments.length > 1) {
            return 'skill-category';
        }
        return 'skills';
    }

    // /contact => contact
    if (segments[0] === 'contact') {
        return 'contact';
    }

    // /timeline => timeline
    if (segments[0] === 'timeline') {
        return 'timeline';
    }

    // Fallback to first segment
    return segments[0] || 'unknown';
};
