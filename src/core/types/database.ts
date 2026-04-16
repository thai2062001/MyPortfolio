/**
 * CORE DATABASE TYPES
 * Source of truth for all data structures in the Portfolio Platform.
 * @version 1.0.0
 */

export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// --- PERSONAL & SITE ---

export interface PersonalInfo extends BaseEntity {
  id: string; // Restricted to '1'
  phone_number: string | null;
  email: string | null;
  address: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  blog_url: string | null;
  github_url: string | null;
}

export interface SiteSettings extends BaseEntity {
  id: string; // Restricted to '1'
  site_name: string | null;
  default_language: string;
  global_font_family: string | null;
  global_font_import_url: string | null;
  global_font_fallback: string | null;
  theme_id?: string; // Future use for Super Admin
}

export interface SocialLink extends BaseEntity {
  platform: string;
  url: string;
  icon_url: string | null;
  order_index: number;
  is_published: boolean;
}

// --- PROJECTS ---

export interface ProjectCategory extends BaseEntity {
  slug: string;
  name: string;
  name_ja?: string;
  name_vi?: string;
  order_index: number;
  is_published: boolean;
}

export interface Project extends BaseEntity {
  slug: string;
  title: string;
  title_ja?: string;
  title_vi?: string;
  category_id: string | null;
  short_description: string | null;
  short_description_ja?: string | null;
  short_description_vi?: string | null;
  description: string | null;
  description_ja?: string | null;
  description_vi?: string | null;
  overview?: string | null;
  overview_ja?: string | null;
  overview_vi?: string | null;
  challenge?: string | null;
  challenge_ja?: string | null;
  challenge_vi?: string | null;
  solution?: string | null;
  solution_ja?: string | null;
  solution_vi?: string | null;
  client?: string | null;
  duration?: string | null;
  role?: string | null;
  year?: string | null;
  cover_image_url: string | null;
  tall: boolean;
  is_featured: boolean;
  is_published: boolean;
  published_at?: string | null;

  // Relations
  project_categories?: ProjectCategory;
  project_images?: ProjectImage[];
  project_approaches?: any[];
  project_results?: any[];
  project_testimonials?: any[];
  tags?: any[];
}

export interface ProjectImage extends BaseEntity {
  project_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  is_cover: boolean;
  order_index: number;
}

// --- SKILLS & EXPERTISE ---

export interface Skill extends BaseEntity {
  slug: string;
  category_id: string;
  skill_name: string;
  skill_name_ja?: string | null;
  skill_name_vi?: string | null;
  short_description: string | null;
  description: string | null;
  description_ja?: string | null;
  description_vi?: string | null;
  overview: string | null;
  overview_ja?: string | null;
  overview_vi?: string | null;
  application: string | null;
  use_cases: string | null;
  difficulty_level: string | null;
  experience_level: string | null;
  estimated_time: string | null;
  key_points: string[] | null;
  order_index: number;
  is_published: boolean;
}

export interface StrategicSkill extends BaseEntity {
  slug: string;
  skill_name: string;
  icon_name: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
}

export interface ToolItem extends BaseEntity {
  tool_name: string;
  description: string | null;
  tool_url: string | null;
  icon_url: string | null;
  order_index: number;
  is_published: boolean;
}

// --- EXPERIENCE & TIMELINE ---

export interface TimelinePhase extends BaseEntity {
  period: string;
  location: string | null;
  title_en: string;
  title_ja: string;
  title_vi?: string;
  company_en: string | null;
  company_ja?: string | null;
  company_vi?: string | null;
  description_en: string;
  description_ja: string;
  description_vi?: string;
  tag_en: string | null;
  tag_ja?: string | null;
  tag_vi?: string | null;
  order_index: number;
  is_published: boolean;
}

// --- MISC ---

export interface Testimonial extends BaseEntity {
  name: string;
  role_en: string;
  quote_en: string;
  portrait_url: string | null;
  is_published: boolean;
  order_index: number;
}

export interface ClientBrand extends BaseEntity {
  name: string;
  logo_url: string;
  website_url: string | null;
  is_published: boolean;
  order_index: number;
}

// --- EXTENDED CONTENT ---

export interface AboutContent extends BaseEntity {
  section_key: string;
  title_en: string;
  title_ja: string;
  content_en: string;
  content_ja: string;
  image_url: string | null;
  order_index: number;
}

export interface Faq extends BaseEntity {
  question_en: string;
  question_ja: string;
  answer_en: string;
  answer_ja: string;
  order_index: number;
  is_published: boolean;
}

export interface SiteStat extends BaseEntity {
  label_en: string;
  label_ja: string;
  value_text: string;
  order_index: number;
  is_published: boolean;
}

export interface SiteStatsSectionSettings extends BaseEntity {
  id: string; // Restricted to '1'
  is_published: boolean;
}

export interface HeroSectionConfig extends BaseEntity {
  id: string; // Restricted to '1'
  title_en: string;
  title_ja: string;
  subtitle_en: string;
  subtitle_ja: string;
  cta_text_en: string;
  cta_text_ja: string;
  video_url: string | null;
  image_url: string | null;
  layout_config: any;
  selected_layout_key: string;
}

export interface ContactSectionConfig extends BaseEntity {
  id: string; // Restricted to '1'
  title_en: string;
  title_ja: string;
  description_en: string;
  description_ja: string;
  form_settings: any;
}

// --- BLOG ---

export interface BlogCategory extends BaseEntity {
  slug: string;
  name_en: string;
  name_ja?: string;
  name_vi?: string;
  description?: string;
  order_index: number;
  is_active: boolean;
}

export interface BlogPost extends BaseEntity {
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
  cover_image_url?: string | null;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  is_featured: boolean;
  reading_time: number;
  seo_title_en?: string;
  seo_description_en?: string;
  order_index: number;
  published_at: string | null;
  
  // Relations
  blog_categories?: BlogCategory;
}
