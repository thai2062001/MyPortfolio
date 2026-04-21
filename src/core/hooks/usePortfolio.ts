import { useQuery } from "@tanstack/react-query";
import { portfolioApi } from "../api/portfolio";

/**
 * CORE PORTFOLIO HOOKS
 * Modularized hooks for themes to fetch and cache portfolio data.
 * Using individual hooks prevents unnecessary re-renders in components 
 * that only need a subset of the data.
 */

export const useSiteSettings = () => useQuery({
  queryKey: ["site-settings"],
  queryFn: () => portfolioApi.getSiteSettings(),
});

export const usePersonalInfo = () => useQuery({
  queryKey: ["personal-info"],
  queryFn: () => portfolioApi.getPersonalInfo(),
});

export const useSocialLinks = () => useQuery({
  queryKey: ["social-links"],
  queryFn: () => portfolioApi.getSocialLinks(),
});

export const useProjects = (featuredOnly = false) => useQuery({
  queryKey: ["projects", { featuredOnly }],
  queryFn: () => portfolioApi.getProjects(featuredOnly),
});

export const useProjectDetails = (slug: string) => useQuery({
  queryKey: ["project", slug],
  queryFn: () => portfolioApi.getProjectBySlug(slug),
  enabled: !!slug
});

export const useSkills = () => useQuery({
  queryKey: ["skills"],
  queryFn: () => portfolioApi.getSkills(),
});

export const useSkillCategories = () => useQuery({
  queryKey: ["skill-categories"],
  queryFn: () => portfolioApi.getSkillCategories(),
});

export const useTimeline = () => useQuery({
  queryKey: ["timeline"],
  queryFn: () => portfolioApi.getTimeline(),
});

export const useTimelineSettings = () => useQuery({
  queryKey: ["timeline-settings"],
  queryFn: () => portfolioApi.getTimelineSectionSettings(),
});

export const useTestimonials = () => useQuery({
  queryKey: ["testimonials"],
  queryFn: () => portfolioApi.getTestimonials(),
});

export const useClients = () => useQuery({
  queryKey: ["clients"],
  queryFn: () => portfolioApi.getClients(),
});

export const useAboutContent = () => useQuery({
  queryKey: ["about-content"],
  queryFn: () => portfolioApi.getAboutContent(),
});

export const useFaqs = () => useQuery({
  queryKey: ["faqs"],
  queryFn: () => portfolioApi.getFaqs(),
});

export const useFaqSettings = () => useQuery({
  queryKey: ["faq-settings"],
  queryFn: () => portfolioApi.getFaqSectionSettings(),
});

export const useHeroSettings = () => useQuery({
  queryKey: ["hero-settings"],
  queryFn: () => portfolioApi.getHeroSection(),
});

export const useContactSettings = () => useQuery({
  queryKey: ["contact-settings"],
  queryFn: () => portfolioApi.getContactSection(),
});

export const useContactPurposeOptions = () => useQuery({
  queryKey: ["contact-purpose-options"],
  queryFn: () => portfolioApi.getContactPurposeOptions(),
});

export const useExpertiseSection = () => useQuery({
  queryKey: ["expertise-section"],
  queryFn: () => portfolioApi.getExpertiseSection(),
});

export const useExpertiseSkills = () => useQuery({
  queryKey: ["expertise-skills"],
  queryFn: () => portfolioApi.getExpertiseStrategicSkills(),
});

export const useSiteStats = () => useQuery({
  queryKey: ["site-stats"],
  queryFn: () => portfolioApi.getSiteStats(),
});

export const useSiteStatsSettings = () => useQuery({
  queryKey: ["site-stats-settings"],
  queryFn: () => portfolioApi.getSiteStatsSettings(),
});

export const useBlogPosts = (featuredOnly = false) => useQuery({
  queryKey: ["blog-posts", { featuredOnly }],
  queryFn: () => portfolioApi.getBlogPosts(featuredOnly),
});

export const useBlogPostsByCategory = (categoryId: string) => useQuery({
  queryKey: ["blog-posts-category", categoryId],
  queryFn: () => portfolioApi.getBlogPostsByCategory(categoryId),
  enabled: !!categoryId
});

export const useBlogCategories = () => useQuery({
  queryKey: ["blog-categories"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data || [];
  }
});

export const useBlogPost = (slug: string) => useQuery({
  queryKey: ["blog-post", slug],
  queryFn: () => portfolioApi.getBlogPostBySlug(slug),
  enabled: !!slug
});

/**
 * @deprecated Use granular hooks (e.g., useHeroSettings, useProjects) instead 
 * to prevent over-rendering and improve performance.
 */
export const usePortfolioData = () => {
  const siteSettings = useSiteSettings();
  const personalInfo = usePersonalInfo();
  const socialLinks = useSocialLinks();
  const projects = useProjects();
  const skills = useSkills();
  const skillCategories = useSkillCategories();
  const timeline = useTimeline();
  const timelineSettings = useTimelineSettings();
  const testimonials = useTestimonials();
  const clients = useClients();
  const aboutContent = useAboutContent();
  const faqs = useFaqs();
  const faqSettings = useFaqSettings();
  const heroSettings = useHeroSettings();
  const contactSettings = useContactSettings();
  const contactPurposeOptions = useContactPurposeOptions();
  const expertiseSection = useExpertiseSection();
  const expertiseSkills = useExpertiseSkills();
  const siteStats = useSiteStats();
  const siteStatsSettings = useSiteStatsSettings();

  return {
    siteSettings,
    personalInfo,
    socialLinks,
    projects,
    skills,
    skillCategories,
    timeline,
    timelineSettings,
    testimonials,
    clients,
    aboutContent,
    faqs,
    faqSettings,
    heroSettings,
    contactSettings,
    contactPurposeOptions,
    expertiseSection,
    expertiseSkills,
    siteStats,
    siteStatsSettings,
    isLoading: 
      siteSettings.isLoading || 
      personalInfo.isLoading || 
      projects.isLoading ||
      heroSettings.isLoading,
    isError: 
      siteSettings.isError || 
      personalInfo.isError || 
      projects.isError
  };
};
