import { supabase } from '@/lib/supabase';
import type {
    PageSection,
    PageType,
    ReorderRequest,
    MoveRequest,
    RpcResponse
} from '@/core/types/sections';

/**
 * Fetch sections by page type
 * Public can see published + visible sections
 * Admin can see all sections
 */
export async function getSectionsByPage(pageType: PageType): Promise<PageSection[]> {
    const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_type', pageType)
        .order('order_index', { ascending: true });

    if (error) {
        throw error;
    }

    return data || [];
}

/**
 * Reorder sections on same page
 * Input: full ordered list
 * Output: updated sections
 */
export async function reorderSections(request: ReorderRequest): Promise<RpcResponse> {
    const { data, error } = await supabase.rpc('reorder_page_sections', {
        p_page_type: request.page_type,
        p_sections: request.sections,
    });

    if (error) throw error;
    return data;
}

/**
 * Move section to another page
 * Input: section_id, target page
 * Output: moved section info
 */
export async function moveSection(request: MoveRequest): Promise<RpcResponse> {
    const { data, error } = await supabase.rpc('move_section_to_page', {
        p_section_id: request.section_id,
        p_to_page_type: request.to_page_type,
    });

    if (error) throw error;
    return data;
}

/**
 * Toggle section visibility
 * Admin only
 */
export async function toggleSectionVisibility(
    sectionId: string,
    isVisible: boolean
): Promise<RpcResponse> {
    const { data, error } = await supabase.rpc('toggle_section_visibility', {
        p_section_id: sectionId,
        p_is_visible: isVisible,
    });

    if (error) throw error;
    return data;
}

/**
 * Toggle section published status
 * Admin only
 */
export async function toggleSectionPublished(
    sectionId: string,
    isPublished: boolean
): Promise<RpcResponse> {
    const { data, error } = await supabase.rpc('toggle_section_published', {
        p_section_id: sectionId,
        p_is_published: isPublished,
    });

    if (error) throw error;
    return data;
}

/**
 * Audit data existence for all major sections
 * Returns a record of section_type -> has_data
 */
export async function getSectionsDataStatus(): Promise<Record<string, boolean>> {
    const tables = {
        hero: 'hero_sections',
        about: 'about_content',
        services: 'services',
        experience: 'timeline_phases',
        skills: 'skills',
        testimonials: 'testimonials',
        blog: 'blog_posts',
        projects: 'projects',
        portfolio_grid: 'projects',
        expertise_section: 'skills',
        contact: 'contact_sections',
        faq: 'faqs',
    };

    const status: Record<string, boolean> = {};

    // Parallel check for counts
    await Promise.all(
        Object.entries(tables).map(async ([type, table]) => {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (!error && count !== null) {
                status[type] = count > 0;
            } else {
                status[type] = false;
            }
        })
    );

    return status;
}
