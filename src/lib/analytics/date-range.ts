/**
 * Date range utilities for analytics
 */

export type DateRangeType = 'today' | 'last7days' | 'last30days' | 'alltime';

export const getDateRange = (type: DateRangeType): [Date, Date] => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    let startDate = new Date();

    switch (type) {
        case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'last7days':
            startDate.setDate(startDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'last30days':
            startDate.setDate(startDate.getDate() - 29);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'alltime':
            startDate = new Date('2000-01-01');
            break;
    }

    return [startDate, endDate];
};

export const formatDateRange = (type: DateRangeType): string => {
    switch (type) {
        case 'today':
            return 'Today';
        case 'last7days':
            return 'Last 7 Days';
        case 'last30days':
            return 'Last 30 Days';
        case 'alltime':
            return 'All Time';
    }
};
