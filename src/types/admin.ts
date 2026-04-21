// Project Categories
export interface ProjectCategory {
    id: string;
    slug: string;
    name_en: string;
    name_ja?: string;
    name_vi?: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// Projects
export interface Project {
    id: string;
    slug: string;
    title: string;
    title_ja?: string;
    title_vi?: string;
    category_id: string;
    short_description: string;
    short_description_ja?: string;
    short_description_vi?: string;
    description: string;
    description_ja?: string;
    description_vi?: string;
    overview: string;
    overview_ja?: string;
    overview_vi?: string;
    challenge: string;
    challenge_ja?: string;
    challenge_vi?: string;
    solution: string;
    solution_ja?: string;
    solution_vi?: string;
    client: string;
    duration: string;
    role: string;
    year: string;
    cover_image_url: string;
    tall: boolean;
    is_featured: boolean;
    is_published: boolean;
    seo_title: string;
    seo_title_ja?: string;
    seo_title_vi?: string;
    seo_description: string;
    seo_description_ja?: string;
    seo_description_vi?: string;
    og_image_url: string;
    published_at: string | null;
    order_index: number;
    created_at: string;
    updated_at: string;
}

// Project Images
export interface ProjectImage {
    id: string;
    project_id: string;
    image_url: string;
    alt_text: string;
    caption: string;
    is_cover: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
}

// Project Approaches
export interface ProjectApproach {
    id: string;
    project_id: string;
    approach: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

// Project Results
export interface ProjectResult {
    id: string;
    project_id: string;
    label: string;
    value: string;
    order_index: number;
    created_at: string;
    updated_at: string;
}

// Project Testimonials
export interface ProjectTestimonial {
    id: string;
    project_id: string;
    quote: string;
    name: string;
    title: string;
    company: string;
    avatar_url: string;
    video_url: string | null;
    order_index: number;
    created_at: string;
    updated_at: string;
}

// About Content
export interface AboutContent {
    id: string;
    section_key: string;
    title_en: string;
    title_ja: string;
    title_vi?: string;
    content_en: string;
    content_ja: string;
    content_vi?: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    about_images?: AboutImage[];
    about_content_tags?: AboutContentTag[];
}

// About Images
export interface AboutImage {
    id: string;
    about_id: string;
    image_url: string;
    alt_text?: string;
    caption?: string;
    is_cover: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
}

// Skills
export interface Skill {
    id: string;
    category: string;
    skill_name: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// Clients
export interface Client {
    id: string;
    name: string;
    logo_url: string;
    website_url: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// Testimonials
export interface Testimonial {
    id: string;
    author_name: string;
    role_en: string;
    role_ja: string;
    role_vi?: string;
    quote_en: string;
    quote_ja: string;
    quote_vi?: string;
    portrait_url: string;
    video_url: string | null;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// Metrics
export interface Metric {
    id: string;
    value: string;
    label_en: string;
    label_ja: string;
    label_vi?: string;
    color: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// Personal Info
export interface PersonalInfo {
    id: number;
    full_name: string | null;
    bio: string | null;
    phone_number: string | null;
    email: string | null;
    address: string | null;
    updated_at?: string;
}

// Social Links
export interface SocialLink {
    id: string;
    platform_name: string;
    display_name: string;
    url: string;
    icon_url: string | null;
    icon_storage_path: string | null;
    order_index: number;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

// Site Settings
export interface SiteSettings {
    id: number;
    site_name: string;
    default_language: string;
    global_font_family: string;
    global_font_import_url: string;
    global_font_import_css: string;
    global_font_fallback: string;
    global_custom_css: string;
    body_font_id: string | null;
    heading_font_id: string | null;
    created_at: string;
    updated_at: string;
}

// Fonts
export interface Font {
    id: string;
    name: string;
    font_family: string;
    font_type: string;
    import_url: string;
    import_css: string;
    fallback: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Hero Section
export interface HeroSection {
    id: number;
    is_published: boolean;
    badge_en: string;
    badge_ja: string;
    badge_vi?: string;
    title_line_1_en: string;
    title_line_1_ja: string;
    title_line_1_vi?: string;
    title_line_2_en: string;
    title_line_2_ja: string;
    title_line_2_vi?: string;
    title_line_2_html: string | null;
    description_en: string;
    description_ja: string;
    description_vi?: string;
    primary_button_label_en: string;
    primary_button_label_ja: string;
    primary_button_label_vi?: string;
    primary_button_url: string;
    secondary_button_label_en: string;
    secondary_button_label_ja: string;
    secondary_button_label_vi?: string;
    secondary_button_url: string;
    hero_image_url: string;
    hero_image_alt_en: string;
    hero_image_alt_ja: string;
    hero_image_alt_vi?: string;
    hero_image_storage_path: string | null;
    created_at: string;
    updated_at: string;
}

// Expertise Section
export interface ExpertiseSection {
    id: number;
    is_published: boolean;
    eyebrow: string;
    eyebrow_ja?: string;
    eyebrow_vi?: string;
    title: string;
    title_ja?: string;
    title_vi?: string;
    strategic_title: string;
    strategic_title_ja?: string;
    strategic_title_vi?: string;
    strategic_helper_text: string;
    strategic_helper_text_ja?: string;
    strategic_helper_text_vi?: string;
    strategic_description?: string;
    strategic_description_ja?: string;
    strategic_description_vi?: string;
    tools_title: string;
    tools_title_ja?: string;
    tools_title_vi?: string;
    tools_helper_text: string;
    tools_helper_text_ja?: string;
    tools_helper_text_vi?: string;
    created_at: string;
    updated_at: string;
}

// Expertise Strategic Skills
export interface ExpertiseStrategicSkill {
    id: string;
    slug: string;
    skill_name: string;
    skill_name_ja?: string;
    skill_name_vi?: string;
    icon_name: string;
    icon_url?: string;
    description: string;
    description_ja?: string;
    description_vi?: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export type StrategicSkill = ExpertiseStrategicSkill;

// Expertise Tool Items
export interface ExpertiseToolItem {
    id: string;
    tool_name: string;
    tool_name_ja?: string;
    tool_name_vi?: string;
    description: string;
    description_ja?: string;
    description_vi?: string;
    tool_url: string;
    icon_url?: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export type ToolItem = ExpertiseToolItem;

// Timeline Phase Images
export interface TimelinePhaseImage {
    id: string;
    phase_id: string;
    image_url: string;
    alt_text?: string;
    caption?: string;
    image_orientation?: 'landscape' | 'portrait';
    is_cover: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
}

// Timeline Phases
export interface TimelinePhase {
    id: string;
    period: string;
    location: string;
    title_en: string;
    title_ja: string;
    title_vi?: string;
    company_en?: string;
    company_ja?: string;
    company_vi?: string;
    description_en: string;
    description_ja: string;
    description_vi?: string;
    image_url?: string; // legacy fallback only
    tag_en?: string;
    tag_ja?: string;
    tag_vi?: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    images?: TimelinePhaseImage[]; // new gallery support
}

// Timeline Section Settings
export interface TimelineSectionSettings {
    id: number;
    eyebrow_en: string;
    title_en: string;
    description_en?: string;
    eyebrow_ja: string;
    title_ja: string;
    description_ja?: string;
    eyebrow_vi?: string;
    title_vi?: string;
    description_vi?: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// Hero Layout
export interface HeroLayout {
    id: string;
    layout_key: string;
    layout_name: string;
    description: string;
    preview_image_url: string;
    default_config: Record<string, any>;
    supported_fields: Record<string, any>;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Extended Hero Section with layout
export interface HeroSectionWithLayout extends HeroSection {
    selected_layout_key?: string;
    layout_config?: Record<string, any>;
}

// Contact Section
export interface ContactSection {
    id: number;
    is_published: boolean;
    eyebrow_en: string;
    eyebrow_ja: string;
    eyebrow_vi?: string;
    title_line_1_en: string;
    title_line_1_ja: string;
    title_line_1_vi?: string;
    title_line_2_en: string;
    title_line_2_ja: string;
    title_line_2_vi?: string;
    title_line_2_html: string | null;
    description_en: string;
    description_ja: string;
    description_vi?: string;
    primary_button_label_en: string;
    primary_button_label_ja: string;
    primary_button_label_vi?: string;
    primary_button_url: string;
    background_image_url: string | null;
    overlay_opacity: number;
    created_at: string;
    updated_at: string;
}

// FAQ
export interface Faq {
    id: string;
    question_en: string;
    question_ja: string;
    question_vi?: string;
    answer_en: string;
    answer_ja: string;
    answer_vi?: string;
    category?: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// Contact Purpose Option
export interface ContactPurposeOption {
    id: string;
    value: string;
    label_en: string;
    label_ja: string | null;
    label_vi?: string | null;
    description: string | null;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Contact Form Settings
export interface ContactFormSettings {
    id: number;
    is_purpose_enabled: boolean;
    is_purpose_required: boolean;
    purpose_placeholder_en: string;
    purpose_placeholder_ja: string;
    purpose_placeholder_vi?: string;
    created_at: string;
    updated_at: string;
}

// Contact Message
export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    purpose: string | null;
    is_read: boolean;
    is_replied: boolean;
    created_at: string;
    updated_at: string;
}

// Site Stats Section Settings
export interface SiteStatsSectionSettings {
    id: number;
    is_published: boolean;
    eyebrow_en: string;
    eyebrow_ja: string;
    eyebrow_vi?: string;
    title_en: string;
    title_ja: string;
    title_vi?: string;
    description_en: string;
    description_ja: string;
    description_vi?: string;
    created_at: string;
    updated_at: string;
}

// Site Stats Items
export interface SiteStat {
    id: string;
    stat_key: string | null;
    value_text: string;
    label_en: string;
    label_ja: string | null;
    label_vi?: string | null;
    description_en: string | null;
    description_ja: string | null;
    description_vi?: string | null;
    icon_url: string | null;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// About Tags
export interface AboutTag {
    id: string;
    slug: string;
    name_en: string;
    name_ja: string;
    name_vi?: string;
    description?: string;
    icon_url?: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// About Content Tags (Pivot)
export interface AboutContentTag {
    id: string;
    about_id: string;
    tag_id: string;
    about_tags?: AboutTag;
    created_at: string;
}

// Project Tags
export interface ProjectTag {
    id: string;
    slug: string;
    name_en: string;
    name_ja?: string;
    name_vi?: string;
    description?: string;
    icon_url?: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Project Tag Relations (Pivot)
export interface ProjectTagRelation {
    id: string;
    project_id: string;
    tag_id: string;
    project_tags?: ProjectTag;
    created_at: string;
}

export interface ProjectWithTags extends Project {
    project_tag_relations?: (ProjectTagRelation & { project_tags: ProjectTag })[];
}

// Blog Categories
export interface BlogCategory {
    id: string;
    slug: string;
    name_en: string;
    name_ja?: string;
    name_vi?: string;
    description?: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Blog Tags
export interface BlogTag {
    id: string;
    slug: string;
    name_en: string;
    name_ja?: string;
    name_vi?: string;
    description?: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Blog Posts
export interface BlogPost {
    id: string;
    slug: string;
    category_id: string | null;
    title_en: string;
    title_ja?: string;
    title_vi?: string;
    excerpt_en?: string;
    excerpt_ja?: string;
    excerpt_vi?: string;
    content_en?: string;
    content_ja?: string;
    content_vi?: string;
    cover_image_url?: string;
    status: 'draft' | 'published' | 'scheduled' | 'archived';
    is_featured: boolean;
    reading_time: number;
    seo_title_en?: string;
    seo_title_ja?: string;
    seo_title_vi?: string;
    seo_description_en?: string;
    seo_description_ja?: string;
    seo_description_vi?: string;
    og_image_url?: string;
    canonical_url?: string;
    noindex: boolean;
    order_index: number;
    published_at: string | null;
    last_draft_saved_at: string;
    created_at: string;
    updated_at: string;
    blog_categories?: BlogCategory;
}

// Blog Post Tags (Pivot)
export interface BlogPostTag {
    id: string;
    post_id: string;
    tag_id: string;
    blog_tags?: BlogTag;
    created_at: string;
}

export interface BlogPostWithTags extends BlogPost {
    blog_post_tags?: (BlogPostTag & { blog_tags: BlogTag })[];
}
