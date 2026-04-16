import { lazy, useMemo } from "react";
import { useSite } from "@/contexts/SiteContext";

/**
 * THEME DEFINITIONS
 * Add new themes here by mapping their IDs to their page components.
 */
const themesRegistry = {
  radiant: {
    Home: lazy(() => import("@/themes/radiant/pages/Home")),
    Blog: lazy(() => import("@/themes/radiant/pages/Blog")),
    Portfolio: lazy(() => import("@/themes/radiant/pages/Portfolio")),
    Projects: lazy(() => import("@/themes/radiant/pages/Projects")),
    Contact: lazy(() => import("@/themes/radiant/pages/Portfolio")), 
    Privacy: lazy(() => import("@/themes/radiant/pages/Portfolio")), 
    ProjectDetail: lazy(() => import("@/themes/radiant/pages/ProjectDetail")),
    Skills: lazy(() => import("@/themes/radiant/pages/Skills")),
    SkillCategory: lazy(() => import("@/themes/radiant/pages/SkillCategory")),
    SkillDetail: lazy(() => import("@/themes/radiant/pages/SkillDetail")),
    BlogDetail: lazy(() => import("@/themes/radiant/pages/BlogDetail")),
    ScrollToTop: lazy(() => import("@/themes/radiant/components/ScrollToTop")),
  },
  minimal: {
    Home: lazy(() => import("@/themes/minimalist/pages/Home.tsx")),
    Blog: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")),
    Portfolio: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")),
    Projects: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")), // Placeholder
    Contact: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")),
    Privacy: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")),
    ProjectDetail: lazy(() => import("@/themes/minimalist/pages/ProjectDetail.tsx")),
    Skills: lazy(() => import("@/themes/radiant/pages/Skills")),
    SkillCategory: lazy(() => import("@/themes/radiant/pages/SkillCategory")),
    SkillDetail: lazy(() => import("@/themes/minimalist/pages/SkillDetail.tsx")),
    BlogDetail: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")), // Placeholder
    ScrollToTop: lazy(() => import("@/themes/radiant/components/ScrollToTop")),
  },
  minimalist: {
    Home: lazy(() => import("@/themes/minimalist/pages/Home.tsx")),
    Blog: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")),
    Portfolio: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")),
    Projects: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")), // Placeholder
    Contact: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")),
    Privacy: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")),
    ProjectDetail: lazy(() => import("@/themes/minimalist/pages/ProjectDetail.tsx")),
    Skills: lazy(() => import("@/themes/radiant/pages/Skills")),
    SkillCategory: lazy(() => import("@/themes/radiant/pages/SkillCategory")),
    SkillDetail: lazy(() => import("@/themes/minimalist/pages/SkillDetail.tsx")),
    BlogDetail: lazy(() => import("@/themes/minimalist/pages/Portfolio.tsx")), // Placeholder
    ScrollToTop: lazy(() => import("@/themes/radiant/components/ScrollToTop")),
  },
  editorial: {
    Home: lazy(() => import("@/themes/editorial/pages/Home")),
    Blog: lazy(() => import("@/themes/editorial/pages/Blog")),
    Portfolio: lazy(() => import("@/themes/editorial/pages/Portfolio")),
    Projects: lazy(() => import("@/themes/radiant/pages/Projects")), // Point to radiant projects for now
    Contact: lazy(() => import("@/themes/editorial/pages/Contact")),
    Privacy: lazy(() => import("@/themes/editorial/pages/Privacy")),
    ProjectDetail: lazy(() => import("@/themes/editorial/pages/ProjectDetail")),
    Skills: lazy(() => import("@/themes/radiant/pages/Skills")),
    SkillCategory: lazy(() => import("@/themes/radiant/pages/SkillCategory")),
    SkillDetail: lazy(() => import("@/themes/radiant/pages/SkillDetail")),
    BlogDetail: lazy(() => import("@/themes/radiant/pages/Portfolio")), // Placeholder
    ScrollToTop: lazy(() => import("@/themes/editorial/components/NavigationManager")),
  },
};

/**
 * HOOK: useThemePages
 * This hook returns the correct page components based on the active theme from database.
 */
export const useThemePages = () => {
  const { settings } = useSite();
  const themeId = settings?.active_theme_id || 'radiant';
  
  return useMemo(() => {
    return (themesRegistry as any)[themeId] || themesRegistry.radiant;
  }, [themeId]);
};

// Export the registry for reference if needed
export const THEMES_REGISTRY = themesRegistry;
