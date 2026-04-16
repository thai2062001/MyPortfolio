export interface SkillCategory {
    id: string;
    slug: string;
    name_en: string;
    name_ja: string;
    name_vi?: string;
    description?: string;
    icon_url?: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface Skill {
    id: string;
    slug: string;
    category_id: string;
    skill_name: string;
    skill_name_ja?: string;
    skill_name_vi?: string;
    short_description?: string;
    short_description_ja?: string;
    short_description_vi?: string;
    description?: string;
    description_ja?: string;
    description_vi?: string;
    overview?: string;
    overview_ja?: string;
    overview_vi?: string;
    application?: string;
    application_ja?: string;
    application_vi?: string;
    use_cases?: string;
    use_cases_ja?: string;
    use_cases_vi?: string;
    icon_url?: string;
    cover_image_url?: string;
    difficulty_level?: string;
    difficulty_level_ja?: string;
    difficulty_level_vi?: string;
    experience_level?: string;
    experience_level_ja?: string;
    experience_level_vi?: string;
    estimated_time?: string;
    estimated_time_ja?: string;
    estimated_time_vi?: string;
    tool_stack?: string[];
    key_points?: string[];
    related_skill_ids?: string[];
    seo_title?: string;
    seo_title_ja?: string;
    seo_title_vi?: string;
    seo_description?: string;
    seo_description_ja?: string;
    seo_description_vi?: string;
    order_index: number;
    is_published: boolean;
    // Section visibility controls
    show_highlights?: boolean;
    show_applications?: boolean;
    show_tools?: boolean;
    show_steps?: boolean;
    created_at: string;
    updated_at: string;
}

export interface SkillHighlight {
    id: string;
    skill_id: string;
    title: string;
    title_ja?: string;
    title_vi?: string;
    description?: string;
    description_ja?: string;
    description_vi?: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface SkillHighlightImage {
    id: string;
    highlight_id: string;
    image_url: string;
    alt_text?: string;
    caption?: string;
    is_cover: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface SkillApplication {
    id: string;
    skill_id: string;
    title: string;
    title_ja?: string;
    title_vi?: string;
    description?: string;
    description_ja?: string;
    description_vi?: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface SkillTool {
    id: string;
    skill_id: string;
    tool_name: string;
    tool_name_ja?: string;
    tool_name_vi?: string;
    description?: string;
    description_ja?: string;
    description_vi?: string;
    icon_url?: string;
    tool_url?: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface SkillStep {
    id: string;
    skill_id: string;
    step_title: string;
    step_title_ja?: string;
    step_title_vi?: string;
    step_description?: string;
    step_description_ja?: string;
    step_description_vi?: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}
