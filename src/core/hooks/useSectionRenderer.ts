'use client';

import { useQuery } from '@tanstack/react-query';
import { getSectionsByPage } from '@/core/api/sections';
import type {
    PageSection,
    PageType,
    ReorderRequest,
    MoveRequest,
    RpcResponse
} from '@/core/types/sections';

/**
 * Hook to fetch and manage page sections with caching
 * Uses React Query for state management and caching
 */
export function useSectionRenderer(pageType: PageType) {
    const { 
        data: sections = [], 
        isLoading, 
        error 
    } = useQuery({
        queryKey: ['sections', pageType],
        queryFn: async () => {
            const data = await getSectionsByPage(pageType);
            // Filter to only visible and published sections for the renderer
            return data.filter(s => s.is_visible && s.is_published);
        },
    });

    const errorMsg = error instanceof Error ? error.message : error ? String(error) : null;

    return { 
        sections, 
        isLoading, 
        error: errorMsg 
    };
}
