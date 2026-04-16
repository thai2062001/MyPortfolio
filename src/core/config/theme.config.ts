/**
 * THEME CONFIGURATION
 * Centralized settings for managing and switching portfolio themes.
 */

export type ThemeIdentifier = 'radiant' | 'minimal' | 'editorial';

export interface ThemeConfig {
  id: ThemeIdentifier;
  name: string;
  basePath: string;
  available: boolean;
}

export const THEMES: Record<ThemeIdentifier, ThemeConfig> = {
  radiant: {
    id: 'radiant',
    name: 'Radiant Growth',
    basePath: '@/themes/radiant',
    available: true,
  },
  minimal: {
    id: 'minimal',
    name: 'Minimalist Portfolio',
    basePath: '@/themes/minimalist',
    available: true,
  },
  editorial: {
    id: 'editorial',
    name: 'Editorial Masterpiece',
    basePath: '@/themes/editorial',
    available: false,
  }
};

/**
 * ACTIVE THEME SELECTION
 * Change this value to switch between different themes.
 */
export const ACTIVE_THEME: ThemeIdentifier = 'radiant';

/**
 * HELPER: Get active theme configuration
 */
export const getActiveTheme = () => THEMES[ACTIVE_THEME];
