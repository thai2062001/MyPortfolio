'use client';

import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { PageSection, PageType } from '@/core/types/sections';
import {
    getSectionsByPage,
    reorderSections,
    toggleSectionVisibility,
} from '@/core/api/sections';

export function useSectionReorder(pageType: PageType) {
    const [sections, setSections] = useState<PageSection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const originalSectionsRef = useRef<PageSection[]>([]);

    const fetchSections = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getSectionsByPage(pageType);
            setSections(data);
            originalSectionsRef.current = data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch sections';
            setError(message);
            console.error('Error fetching sections:', err);
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [pageType]); // Remove toast from dependency to prevent infinite loop

    const handleReorder = useCallback(
        async (newSections: PageSection[]) => {
            try {
                if (newSections.length === 0) {
                    throw new Error('No sections to reorder');
                }

                // Check if order actually changed by comparing IDs
                const orderChanged = newSections.some(
                    (s, i) => sections[i]?.id !== s.id
                );

                if (!orderChanged) {
                    return;
                }

                setIsLoading(true);

                const result = await reorderSections({
                    page_type: pageType,
                    sections: newSections.map((s) => ({
                        id: s.id,
                        order_index: s.order_index,
                    })),
                });

                if (!result.success) {
                    throw new Error(result.error || 'Failed to reorder sections');
                }

                setSections(newSections);

                toast({
                    title: 'Success',
                    description: 'Sections reordered successfully',
                });
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to reorder';
                setError(message);
                console.error('Error reordering:', err);

                toast({
                    title: 'Error',
                    description: message,
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        },
        [pageType, sections, toast]
    );

    const handleToggleVisibility = useCallback(
        async (sectionId: string, isVisible: boolean) => {
            try {
                const result = await toggleSectionVisibility(sectionId, isVisible);

                if (!result.success) {
                    throw new Error(result.error || 'Failed to toggle visibility');
                }

                setSections((prev) =>
                    prev.map((s) =>
                        s.id === sectionId ? { ...s, is_visible: isVisible } : s
                    )
                );

                toast({
                    title: 'Success',
                    description: `Section ${isVisible ? 'shown' : 'hidden'}`,
                });
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to toggle visibility';
                toast({
                    title: 'Error',
                    description: message,
                    variant: 'destructive',
                });
            }
        },
        [toast]
    );

    return {
        sections,
        isLoading,
        error,
        fetchSections,
        handleReorder,
        handleToggleVisibility,
    };
}
