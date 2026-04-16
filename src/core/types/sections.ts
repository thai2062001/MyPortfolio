export type PageType = 'home' | 'portfolio';

export type SectionTypeEnum =
    | 'hero'
    | 'about'
    | 'metrics'
    | 'services'
    | 'skills'
    | 'testimonials'
    | 'contact'
    | 'timeline'
    | 'portfolio_grid'
    | 'project_categories'
    | 'featured_projects'
    | 'clients'
    | 'case_studies'
    | 'faq';

export type DataSourceEnum =
    | 'hero_sections'
    | 'about_content'
    | 'metrics'
    | 'skills'
    | 'testimonials'
    | 'timeline_phases'
    | 'projects'
    | 'project_categories'
    | 'clients'
    | 'expertise_sections'
    | 'expertise_strategic_skills'
    | 'expertise_tool_items'
    | 'contact_messages'
    | 'faqs'
    | 'custom';

export interface PageSection {
    id: string;
    section_key: string;
    section_name: string;
    section_type: SectionTypeEnum;
    page_type: PageType;
    order_index: number;
    is_published: boolean;
    is_visible: boolean;
    is_fixed: boolean;
    data_source: DataSourceEnum;
    source_table: string | null;
    description: string | null;
    icon_name: string | null;
    created_at: string;
    updated_at: string;
}

export interface ReorderRequest {
    page_type: PageType;
    sections: Array<{
        id: string;
        order_index: number;
    }>;
}

export interface MoveRequest {
    section_id: string;
    to_page_type: PageType;
}

export interface RpcResponse<T = any> {
    success: boolean;
    message?: string;
    error?: string;
    error_code?: string;
    data?: T;
}
