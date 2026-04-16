/**
 * Traffic source classification
 * Determines traffic source from referrer
 */

export type TrafficSource = 'direct' | 'google' | 'facebook' | 'instagram' | 'linkedin' | 'referral';

export const getTrafficSource = (): TrafficSource => {
    const referrer = document.referrer.toLowerCase();

    if (!referrer) {
        return 'direct';
    }

    if (referrer.includes('google')) {
        return 'google';
    }

    if (referrer.includes('facebook') || referrer.includes('fb')) {
        return 'facebook';
    }

    if (referrer.includes('instagram')) {
        return 'instagram';
    }

    if (referrer.includes('linkedin')) {
        return 'linkedin';
    }

    return 'referral';
};
