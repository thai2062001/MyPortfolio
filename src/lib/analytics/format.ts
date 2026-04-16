/**
 * Formatting utilities for analytics
 */

export const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    }

    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }

    return `${secs}s`;
};

export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const formatDateShort = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const truncateId = (id: string, length: number = 8): string => {
    if (id.length <= length) return id;
    return id.substring(0, length) + '...';
};

export const truncateUrl = (url: string, length: number = 40): string => {
    if (url.length <= length) return url;
    return url.substring(0, length) + '...';
};

export const getTrafficSourceLabel = (source: string): string => {
    const labels: Record<string, string> = {
        direct: 'Direct',
        google: 'Google',
        facebook: 'Facebook',
        instagram: 'Instagram',
        linkedin: 'LinkedIn',
        referral: 'Referral',
    };
    return labels[source] || source;
};

export const getTrafficSourceColor = (
    source: string
): 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' => {
    const colors: Record<string, 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan'> = {
        direct: 'blue',
        google: 'red',
        facebook: 'blue',
        instagram: 'purple',
        linkedin: 'cyan',
        referral: 'orange',
    };
    return colors[source] || 'gray';
};

export const getDeviceTypeLabel = (device: string): string => {
    const labels: Record<string, string> = {
        mobile: 'Mobile',
        tablet: 'Tablet',
        desktop: 'Desktop',
    };
    return labels[device] || device;
};

export const getDeviceTypeColor = (
    device: string
): 'blue' | 'green' | 'purple' => {
    const colors: Record<string, 'blue' | 'green' | 'purple'> = {
        mobile: 'blue',
        tablet: 'green',
        desktop: 'purple',
    };
    return colors[device] || 'gray';
};
