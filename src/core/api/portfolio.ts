import { supabase } from "@/lib/supabase";
import { 
  Project, 
  PersonalInfo, 
  Skill, 
  TimelinePhase, 
  Testimonial,
  ClientBrand,
  SiteSettings,
  SocialLink,
  BlogPost,
  BlogCategory
} from "../types/database";

/**
 * PORTFOLIO API SERVICES
 * Centralized fetch functions for all theme-facing data.
 */

export const portfolioApi = {
  // --- SITE CONFIG ---
  getSiteSettings: async (): Promise<SiteSettings | null> => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) {
      console.error("Error fetching site settings:", error);
      return null;
    }
    return data;
  },

  getSocialLinks: async (): Promise<SocialLink[]> => {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching social links:", error);
      return [];
    }
    return data || [];
  },

  // --- IDENTITY ---
  getPersonalInfo: async (): Promise<PersonalInfo | null> => {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) {
      console.error("Error fetching personal info:", error);
      return null;
    }
    return data;
  },

  // --- WORK ---
  getProjects: async (featuredOnly = false): Promise<Project[]> => {
    let query = supabase
      .from('projects')
      .select('*, project_categories(*), project_tag_relations(project_tags(*))')
      .eq('is_published', true)
      .order('year', { ascending: false });
    
    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    return (data || []).map(project => ({
      ...project,
      project_categories: (project as any).project_categories?.[0] || (project as any).project_categories || null,
      tags: (project as any).project_tag_relations 
        ? (project as any).project_tag_relations.map((r: any) => r.project_tags).filter(Boolean)
        : []
    })) as Project[];
  },

  getProjectBySlug: async (slug: string): Promise<Project | null> => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_categories(*),
        project_images(*),
        project_approaches(*),
        project_results(*),
        project_testimonials(*),
        project_tag_relations(project_tags(*))
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
      
    if (error) {
      console.error(`Error fetching project with slug ${slug}:`, error);
      return null;
    }

    // Map relations to the format expected by the UI
    return {
      ...data,
      project_categories: (data as any).project_categories?.[0] || (data as any).project_categories || null,
      tags: (data as any).project_tag_relations 
        ? (data as any).project_tag_relations.map((r: any) => r.project_tags).filter(Boolean)
        : []
    } as Project;
  },

  // --- SKILLS ---
  getSkills: async (): Promise<Skill[]> => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching skills:", error);
      return [];
    }
    return data || [];
  },

  getSkillCategories: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching skill categories:", error);
      return [];
    }
    return data || [];
  },

  // --- PROJECT TAGS ---
  getProjectTags: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('project_tags')
      .select('*')
      .order('name_en', { ascending: true });
    if (error) {
      console.error("Error fetching project tags:", error);
      return [];
    }
    return data || [];
  },

  getProjectTagRelations: async (projectId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('project_tag_relations')
      .select('*')
      .eq('project_id', projectId);
    if (error) {
      console.error(`Error fetching tag relations for project ${projectId}:`, error);
      return [];
    }
    return data || [];
  },

  syncProjectTags: async (projectId: string, tagIds: string[]): Promise<void> => {
    // Delete existing relations
    const { error: deleteError } = await supabase
      .from('project_tag_relations')
      .delete()
      .eq('project_id', projectId);
    
    if (deleteError) throw deleteError;

    if (tagIds.length === 0) return;

    // Insert new relations
    const relations = tagIds.map(tagId => ({
      project_id: projectId,
      tag_id: tagId
    }));

    const { error: insertError } = await supabase
      .from('project_tag_relations')
      .insert(relations);
    
    if (insertError) throw insertError;
  },

  getSkillCategoryBySlug: async (slug: string): Promise<any | null> => {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    if (error) {
      console.error(`Error fetching skill category ${slug}:`, error);
      return null;
    }
    return data;
  },

  getSkillsByCategory: async (categoryId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) {
      console.error(`Error fetching skills for category ${categoryId}:`, error);
      return [];
    }
    return data || [];
  },

  getSkillBySlug: async (slug: string): Promise<any | null> => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    if (error) {
      console.error(`Error fetching skill ${slug}:`, error);
      return null;
    }
    return data;
  },

  getSkillHighlights: async (skillId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('skill_highlights')
      .select('*')
      .eq('skill_id', skillId)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching skill highlights:", error);
      return [];
    }
    return data || [];
  },

  getSkillApplications: async (skillId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('skill_applications')
      .select('*')
      .eq('skill_id', skillId)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching skill applications:", error);
      return [];
    }
    return data || [];
  },

  getSkillTools: async (skillId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('skill_tools')
      .select('*')
      .eq('skill_id', skillId)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching skill tools:", error);
      return [];
    }
    return data || [];
  },

  getSkillSteps: async (skillId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('skill_steps')
      .select('*')
      .eq('skill_id', skillId)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching skill steps:", error);
      return [];
    }
    return data || [];
  },

  getHighlightImages: async (highlightId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('skill_highlight_images')
      .select('*')
      .eq('highlight_id', highlightId)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching highlight images:", error);
      return [];
    }
    return data || [];
  },

  getExpertiseSection: async (): Promise<any | null> => {
    const { data, error } = await supabase
      .from('expertise_sections')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) {
      console.error("Error fetching expertise section:", error);
      return null;
    }
    return data;
  },

  getExpertiseStrategicSkills: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('expertise_strategic_skills')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching expertise skills:", error);
      return [];
    }
    return data || [];
  },

  // --- CAREER ---
  getTimeline: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('timeline_phases')
      .select('*, timeline_phase_images(*)')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error("Error fetching timeline:", error);
      return [];
    }
    
    // Map the joined data to match expectation (images plural)
    return (data || []).map(phase => ({
      ...phase,
      images: phase.timeline_phase_images || []
    }));
  },

  getTimelineSectionSettings: async (): Promise<any | null> => {
    const { data, error } = await supabase
      .from('timeline_section_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) {
      console.error("Error fetching timeline settings:", error);
      return null;
    }
    return data;
  },

  // --- SOCIAL PROOF ---
  getTestimonials: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching testimonials:", error);
      return [];
    }
    return data || [];
  },

  getClients: async (): Promise<ClientBrand[]> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
    return data || [];
  },

  // --- EXTENDED CONTENT ---
  getAboutContent: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('about_content')
      .select(`
        *,
        about_images (
          *
        ),
        about_content_tags (
          tag_id,
          about_tags (*)
        )
      `)
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error("Error fetching about content:", error);
      return [];
    }
    return data || [];
  },

  getFaqs: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching faqs:", error);
      return [];
    }
    return data || [];
  },

  getFaqSectionSettings: async (): Promise<any | null> => {
    const { data, error } = await supabase
      .from('faq_section_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) {
      console.error("Error fetching FAQ settings:", error);
      return null;
    }
    return data;
  },

  getSiteStats: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('site_stats')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) {
      console.error("Error fetching site stats:", error);
      return [];
    }
    return data || [];
  },

  getSiteStatsSettings: async (): Promise<any | null> => {
    const { data, error } = await supabase
      .from('site_stats_section_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) {
      console.error("Error fetching site stats settings:", error);
      return null;
    }
    return data;
  },

  getHeroSection: async (): Promise<any | null> => {
    const { data, error } = await supabase
      .from('hero_sections')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) {
      console.error("Error fetching hero section:", error);
      return null;
    }
    return data;
  },

  getContactSection: async (): Promise<any | null> => {
    const { data, error } = await supabase
      .from('contact_sections')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) {
      console.error("Error fetching contact section:", error);
      return null;
    }
    return data;
  },

  getContactPurposeOptions: async (publishedOnly: boolean = true): Promise<any[]> => {
    let query = supabase
      .from('contact_purpose_options')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (publishedOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching contact purpose options:", error);
      return [];
    }
    return data || [];
  },

  submitContactMessage: async (messageData: any): Promise<{ success: boolean; error?: any }> => {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([messageData])
      .select('id, name, email, company, purpose, subject, message')
      .single();
    
    if (error) {
      console.error("Error submitting contact message:", error);
      return { success: false, error };
    }

    const { error: functionError } = await supabase.functions.invoke("send-contact-email", {
      body: {
        id: data.id,
        name: data.name,
        email: data.email,
        company: data.company,
        purpose: data.purpose,
        subject: data.subject,
        message: data.message,
      },
    });

    if (functionError) {
      console.error("Error sending contact notification email:", functionError);
      return { success: false, error: functionError };
    }

    return { success: true };
  },

  // --- BLOG ---
  getBlogPosts: async (featuredOnly = false): Promise<BlogPost[]> => {
    let query = supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
    return data || [];
  },

  getBlogPostsByCategory: async (categoryId: string): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) {
      console.error(`Error fetching blog posts for category ${categoryId}:`, error);
      return [];
    }
    return data || [];
  },

  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    if (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }
    return data;
  }
};
