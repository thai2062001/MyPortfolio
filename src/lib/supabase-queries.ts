import { supabase } from "./supabase";
import type {
    SiteSettings,
    HeroSection,
    ExpertiseSection,
    ExpertiseStrategicSkill,
    ExpertiseToolItem,
    ContactSection,
    Font,
} from "@/types/admin";

// ============ SITE SETTINGS ============
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
};

export const upsertSiteSettings = async (
    settings: Partial<SiteSettings>
): Promise<SiteSettings> => {
    const { data, error } = await supabase
        .from("site_settings")
        .upsert(
            {
                id: 1,
                ...settings,
            },
            { onConflict: "id" }
        )
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ============ FONTS ============
export const getFonts = async (): Promise<Font[]> => {
    const { data, error } = await supabase
        .from("fonts")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
};

export const createFont = async (
    font: Omit<Font, "id" | "created_at" | "updated_at">
): Promise<Font> => {
    const { data, error } = await supabase
        .from("fonts")
        .insert([font])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateFont = async (
    id: string,
    font: Partial<Font>
): Promise<Font> => {
    const { data, error } = await supabase
        .from("fonts")
        .update(font)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteFont = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from("fonts")
        .delete()
        .eq("id", id);

    if (error) throw error;
};

// ============ HERO SECTION ============
export const getHeroSection = async (): Promise<HeroSection | null> => {
    const { data, error } = await supabase
        .from("hero_sections")
        .select("*")
        .eq("id", 1)
        .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
};

// Also clear cache on updates
export const upsertHeroSection = async (
    hero: Partial<HeroSection>
): Promise<HeroSection> => {
    const { data, error } = await supabase
        .from("hero_sections")
        .upsert(
            {
                id: 1,
                ...hero,
            },
            { onConflict: "id" }
        )
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ============ EXPERTISE SECTION ============
export const getExpertiseSection = async (): Promise<ExpertiseSection | null> => {
    const { data, error } = await supabase
        .from("expertise_sections")
        .select("*")
        .eq("id", 1)
        .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
};

export const upsertExpertiseSection = async (
    expertise: Partial<ExpertiseSection>
): Promise<ExpertiseSection> => {
    const { data, error } = await supabase
        .from("expertise_sections")
        .upsert(
            {
                id: 1,
                ...expertise,
            },
            { onConflict: "id" }
        )
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ============ EXPERTISE STRATEGIC SKILLS ============
export const getExpertiseStrategicSkills = async (): Promise<
    ExpertiseStrategicSkill[]
> => {
    const { data, error } = await supabase
        .from("expertise_strategic_skills")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
};

export const createExpertiseStrategicSkill = async (
    skill: Omit<ExpertiseStrategicSkill, "id" | "created_at" | "updated_at">
): Promise<ExpertiseStrategicSkill> => {
    const { data, error } = await supabase
        .from("expertise_strategic_skills")
        .insert([skill])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateExpertiseStrategicSkill = async (
    id: string,
    skill: Partial<ExpertiseStrategicSkill>
): Promise<ExpertiseStrategicSkill> => {
    const { data, error } = await supabase
        .from("expertise_strategic_skills")
        .update(skill)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteExpertiseStrategicSkill = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from("expertise_strategic_skills")
        .delete()
        .eq("id", id);

    if (error) throw error;
};

// ============ EXPERTISE TOOL ITEMS ============
export const getExpertiseToolItems = async (): Promise<ExpertiseToolItem[]> => {
    const { data, error } = await supabase
        .from("expertise_tool_items")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
};

export const createExpertiseToolItem = async (
    item: Omit<ExpertiseToolItem, "id" | "created_at" | "updated_at">
): Promise<ExpertiseToolItem> => {
    const { data, error } = await supabase
        .from("expertise_tool_items")
        .insert([item])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateExpertiseToolItem = async (
    id: string,
    item: Partial<ExpertiseToolItem>
): Promise<ExpertiseToolItem> => {
    const { data, error } = await supabase
        .from("expertise_tool_items")
        .update(item)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteExpertiseToolItem = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from("expertise_tool_items")
        .delete()
        .eq("id", id);

    if (error) throw error;
};

// ============ PROJECTS ============
export const getPublishedProjects = async () => {
    const { data, error } = await supabase
        .from("projects")
        .select(
            `
            id,
            slug,
            title,
            title_ja,
            category_id,
            cover_image_url,
            tall,
            client,
            duration,
            role,
            year,
            overview,
            overview_ja,
            challenge,
            challenge_ja,
            solution,
            solution_ja,
            short_description,
            short_description_ja,
            description,
            description_ja,
            is_published,
            project_categories(name),
            project_approaches(approach, order_index),
            project_results(label, value, order_index),
            project_testimonials(quote, name, title, company, order_index),
            project_images(id, image_url, alt_text, caption, order_index),
            project_tag_relations(tag_id, project_tags(*))
            `
        )
        .eq("is_published", true)
        .order("order_index", { ascending: true });

    if (error) throw error;
    return (data || []).map((project: any) => ({
        ...project,
        project_categories: project.project_categories?.[0] || null,
        tags: project.project_tag_relations ? project.project_tag_relations.map((r: any) => r.project_tags) : []
    }));
};

// Lightweight version for the portfolio grid
export const getPublishedProjectsBasic = async () => {
    const { data, error } = await supabase
        .from("projects")
        .select(
            `
            id,
            slug,
            title,
            title_ja,
            category_id,
            cover_image_url,
            tall,
            order_index,
            short_description,
            short_description_ja,
            is_published,
            project_categories(name),
            project_tag_relations(tag_id, project_tags(*))
            `
        )
        .eq("is_published", true)
        .order("order_index", { ascending: true });

    if (error) throw error;
    return (data || []).map((project: any) => ({
        ...project,
        project_categories: project.project_categories?.[0] || null,
        tags: project.project_tag_relations ? project.project_tag_relations.map((r: any) => r.project_tags).filter(Boolean) : []
    }));
};

export const getProjectBySlug = async (slug: string) => {
    const { data, error } = await supabase
        .from("projects")
        .select(
            `
            id,
            slug,
            title,
            title_ja,
            category_id,
            cover_image_url,
            tall,
            client,
            duration,
            role,
            year,
            overview,
            overview_ja,
            challenge,
            challenge_ja,
            solution,
            solution_ja,
            short_description,
            short_description_ja,
            description,
            description_ja,
            is_published,
            project_categories(name),
            project_approaches(approach, order_index),
            project_results(label, value, order_index),
            project_testimonials(quote, name, title, company, order_index),
            project_images(id, image_url, alt_text, caption, order_index),
            project_tag_relations(tag_id, project_tags(*))
            `
        )
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (error && error.code !== "PGRST116") throw error;
    if (!data) return null;

    return {
        ...data,
        project_categories: data.project_categories?.[0] || null,
        tags: data.project_tag_relations ? data.project_tag_relations.map((r: any) => r.project_tags) : []
    };
};

// ============ SOCIAL LINKS ============
export const getSocialLinks = async () => {
    const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
};

export const getAllSocialLinks = async () => {
    const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
};

export const updateSocialLink = async (
    id: string,
    link: Partial<any>
): Promise<any> => {
    const { data, error } = await supabase
        .from("social_links")
        .update(link)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const createSocialLink = async (
    link: Omit<any, "id" | "created_at" | "updated_at">
): Promise<any> => {
    const { data, error } = await supabase
        .from("social_links")
        .insert([link])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteSocialLink = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", id);

    if (error) throw error;
};

// ============ TIMELINE SECTION SETTINGS ============
export const getTimelineSectionSettings = async (): Promise<any | null> => {
    try {
        const { data, error } = await supabase
            .from("timeline_section_settings")
            .select("*")
            .eq("id", 1)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                // Table doesn't exist or no data
                return null;
            }
            console.error("Supabase error:", error);
            throw error;
        }
        return data || null;
    } catch (error) {
        console.error("Error fetching timeline section settings:", error);
        return null;
    }
};

export const upsertTimelineSectionSettings = async (
    settings: Partial<any>
): Promise<any> => {
    try {
        const { data, error } = await supabase
            .from("timeline_section_settings")
            .upsert(
                {
                    id: 1,
                    ...settings,
                },
                { onConflict: "id" }
            )
            .select()
            .single();

        if (error) {
            console.error("Supabase error:", error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error saving timeline section settings:", error);
        throw error;
    }
};

// ============ HERO LAYOUTS ============
export const getHeroLayouts = async (): Promise<any[]> => {
    const { data, error } = await supabase
        .from("hero_layouts")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
};

export const getHeroLayoutByKey = async (layoutKey: string): Promise<any | null> => {
    const { data, error } = await supabase
        .from("hero_layouts")
        .select("*")
        .eq("layout_key", layoutKey)
        .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
};

export const updateHeroLayoutConfig = async (
    layoutConfig: Record<string, any>,
    layoutKey: string
): Promise<HeroSection> => {
    const { data, error } = await supabase
        .from("hero_sections")
        .update({
            layout_config: layoutConfig,
            selected_layout_key: layoutKey,
        })
        .eq("id", 1)
        .select()
        .single();

    if (error) throw error;
    return data;
};


// ============ CONTACT SECTION ============
export const getContactSection = async (): Promise<ContactSection | null> => {
    const { data, error } = await supabase
        .from("contact_sections")
        .select("*")
        .eq("id", 1)
        .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
};

export const upsertContactSection = async (
    contact: Partial<ContactSection>
): Promise<ContactSection> => {
    const { data, error } = await supabase
        .from("contact_sections")
        .upsert(
            {
                id: 1,
                ...contact,
            },
            { onConflict: "id" }
        )
        .select()
        .single();

    if (error) throw error;
    return data;
};
