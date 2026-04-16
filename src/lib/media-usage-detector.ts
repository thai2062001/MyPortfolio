/**
 * Media Usage Detection
 * Detects which media assets are being used across the application
 */

import { supabase } from "./supabase";
import { MediaAsset } from "@/types/media";

export interface UsageResult {
    assetId: string;
    assetUrl: string;
    isUsed: boolean;
    usageCount: number;
    usedIn: UsageLocation[];
}

export interface UsageLocation {
    table: string;
    column: string;
    recordId: string;
    recordTitle?: string;
}

/**
 * Tables and columns to check for media usage
 */
const MEDIA_USAGE_MAP = [
    // Projects
    { table: 'projects', columns: ['cover_image_url'], titleColumn: 'title' },
    { table: 'project_images', columns: ['image_url'], titleColumn: null },

    // Skills
    { table: 'skills', columns: ['cover_image_url', 'icon_url'], titleColumn: 'skill_name' },
    { table: 'skill_highlight_images', columns: ['image_url'], titleColumn: null },
    { table: 'skill_categories', columns: ['icon_url'], titleColumn: 'name_en' },

    // Testimonials
    { table: 'testimonials', columns: ['portrait_url', 'video_url'], titleColumn: 'name' },

    // Clients
    { table: 'clients', columns: ['logo_url'], titleColumn: 'name' },

    // Timeline
    { table: 'timeline_phases', columns: ['image_url'], titleColumn: 'title_en' },
    { table: 'timeline_phase_images', columns: ['image_url'], titleColumn: null },

    // Site Stats
    { table: 'site_stats', columns: ['icon_url'], titleColumn: 'label_en' },

    // Hero Sections
    { table: 'hero_sections', columns: ['background_image_url', 'portrait_image_url'], titleColumn: 'title_en' },

    // About
    { table: 'about_content', columns: ['image_url'], titleColumn: 'title_en' },
    { table: 'about_tags', columns: ['icon_url'], titleColumn: 'name_en' },

    // Blog
    { table: 'blog_posts', columns: ['cover_image_url'], titleColumn: 'title_en' },

    // Expertise
    { table: 'expertise_strategic_skills', columns: ['icon_url'], titleColumn: 'skill_name' },
    { table: 'expertise_tool_items', columns: ['icon_url'], titleColumn: 'tool_name' },

    // Fonts
    { table: 'fonts', columns: ['preview_image_url'], titleColumn: 'font_name' },
];

/**
 * Check if a specific URL is used in the database
 */
export const checkMediaUsage = async (url: string): Promise<UsageLocation[]> => {
    const usageLocations: UsageLocation[] = [];

    for (const mapping of MEDIA_USAGE_MAP) {
        for (const column of mapping.columns) {
            try {
                let query = supabase
                    .from(mapping.table)
                    .select(`id, ${column}${mapping.titleColumn ? `, ${mapping.titleColumn}` : ''}`)
                    .eq(column, url);

                const { data, error } = await query;

                if (error) {
                    console.error(`Error checking ${mapping.table}.${column}:`, error);
                    continue;
                }

                if (data && data.length > 0) {
                    data.forEach((record: any) => {
                        usageLocations.push({
                            table: mapping.table,
                            column,
                            recordId: record.id,
                            recordTitle: mapping.titleColumn ? record[mapping.titleColumn] : undefined
                        });
                    });
                }
            } catch (error) {
                console.error(`Error checking ${mapping.table}.${column}:`, error);
            }
        }
    }

    return usageLocations;
};

/**
 * Find all unused media assets
 */
export const findUnusedMedia = async (assets: MediaAsset[]): Promise<UsageResult[]> => {
    const results: UsageResult[] = [];

    for (const asset of assets) {
        const usedIn = await checkMediaUsage(asset.secure_url);

        results.push({
            assetId: asset.id,
            assetUrl: asset.secure_url,
            isUsed: usedIn.length > 0,
            usageCount: usedIn.length,
            usedIn
        });
    }

    return results;
};

/**
 * Get unused media assets only
 */
export const getUnusedMedia = async (assets: MediaAsset[]): Promise<MediaAsset[]> => {
    const usageResults = await findUnusedMedia(assets);
    const unusedAssetIds = usageResults
        .filter(r => !r.isUsed)
        .map(r => r.assetId);

    return assets.filter(a => unusedAssetIds.includes(a.id));
};

/**
 * Get storage statistics
 */
export const getStorageStats = async () => {
    try {
        const { data: assets, error } = await supabase
            .from('media_assets')
            .select('file_size, asset_type, is_active');

        if (error) throw error;

        const totalSize = assets?.reduce((sum, a) => sum + (a.file_size || 0), 0) || 0;
        const activeSize = assets?.filter(a => a.is_active).reduce((sum, a) => sum + (a.file_size || 0), 0) || 0;

        const byType = assets?.reduce((acc, a) => {
            const type = a.asset_type || 'other';
            if (!acc[type]) acc[type] = { count: 0, size: 0 };
            acc[type].count++;
            acc[type].size += a.file_size || 0;
            return acc;
        }, {} as Record<string, { count: number; size: number }>);

        return {
            totalAssets: assets?.length || 0,
            totalSize,
            activeSize,
            inactiveSize: totalSize - activeSize,
            byType: byType || {}
        };
    } catch (error) {
        console.error('Error getting storage stats:', error);
        return null;
    }
};
