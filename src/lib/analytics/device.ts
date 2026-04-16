/**
 * Device type classification
 * Determines device type based on screen width
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const getDeviceType = (): DeviceType => {
    const width = window.innerWidth;

    if (width < 768) {
        return 'mobile';
    }

    if (width < 1024) {
        return 'tablet';
    }

    return 'desktop';
};
