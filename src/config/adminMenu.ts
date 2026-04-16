import {
  LayoutDashboard,
  Layers,
  Image,
  FileText,
  Users,
  MessageSquare,
  User,
  Mail,
  Settings,
  Zap,
  Wrench,
  Award,
  Globe,
  Briefcase,
  BookOpen,
  TrendingUp,
  Tag,
  Palette,
} from "lucide-react";

export interface MenuItem {
  labelKey: string;
  path?: string;
  icon: React.ComponentType<any>;
  groupId?: string;
  children?: MenuItem[];
}

export const getAdminMenu = (translations: any, lang: string): MenuItem[] => [
  {
    labelKey: translations[lang].dashboard,
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    labelKey: translations[lang].analytics,
    path: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    labelKey: translations[lang].sections,
    path: "/admin/sections",
    icon: Layers,
  },
  {
    labelKey: translations[lang].heroSection,
    path: "/admin/hero-management",
    icon: Zap,
  },
  {
    labelKey: translations[lang].personalInfo,
    path: "/admin/personal-info",
    icon: User,
  },
  {
    labelKey: translations[lang].mediaLibrary,
    path: "/admin/media",
    icon: Image,
  },
  {
    labelKey: translations[lang].projects,
    icon: Image,
    groupId: "projects",
    children: [
      {
        labelKey: translations[lang].projects,
        path: "/admin/projects",
        icon: Image,
      },
      {
        labelKey: translations[lang].projectCategories,
        path: "/admin/project-categories",
        icon: Layers,
      },
      {
        labelKey: translations[lang].projectTags,
        path: "/admin/projects/tags",
        icon: Tag,
      },
    ],
  },
  {
    labelKey: translations[lang].blogManagement,
    icon: BookOpen,
    groupId: "blog",
    children: [
      {
        labelKey: translations[lang].blogPosts,
        path: "/admin/blog/posts",
        icon: FileText,
      },
      {
        labelKey: translations[lang].blogCategories,
        path: "/admin/blog/categories",
        icon: Layers,
      },
      {
        labelKey: translations[lang].blogTags,
        path: "/admin/blog/tags",
        icon: Tag,
      },
    ],
  },
  {
    labelKey: translations[lang].aboutContent,
    icon: FileText,
    groupId: "about",
    children: [
      {
        labelKey: translations[lang].aboutMe,
        path: "/admin/about-content",
        icon: FileText,
      },
      {
        labelKey: translations[lang].stats,
        path: "/admin/stats",
        icon: TrendingUp,
      },
      {
        labelKey: translations[lang].aboutTags,
        path: "/admin/about-tags",
        icon: Layers,
      },
    ],
  },
  {
    labelKey: translations[lang].skillsManagement,
    icon: Award,
    groupId: "skills",
    children: [
      {
        labelKey: translations[lang].skillCategories,
        path: "/admin/skill-categories",
        icon: Layers,
      },
      {
        labelKey: translations[lang].skillSettings,
        path: "/admin/skills",
        icon: Award,
      },
      {
        labelKey: translations[lang].skillDetails,
        path: "/admin/skill-details",
        icon: BookOpen,
      },
    ],
  },
  { labelKey: translations[lang].clients, path: "/admin/clients", icon: Users },
  {
    labelKey: translations[lang].testimonials,
    path: "/admin/testimonials",
    icon: MessageSquare,
  },
  {
    labelKey: translations[lang].faqManagementTitle,
    path: "/admin/faq-management",
    icon: MessageSquare,
  },
  {
    labelKey: translations[lang].contactGroup,
    icon: Mail,
    groupId: "contact",
    children: [
      {
        labelKey: translations[lang].contactMessages,
        path: "/admin/contact-messages",
        icon: Mail,
      },
      {
        labelKey: translations[lang].contactConfig,
        path: "/admin/contact-config",
        icon: Settings,
      },
    ],
  },
  {
    labelKey: translations[lang].siteSettings,
    path: "/admin/site-settings",
    icon: Settings,
  },
  {
    labelKey: translations[lang].themes,
    path: "/admin/themes",
    icon: Palette,
  },
  {
    labelKey: translations[lang].expertiseSection,
    icon: Briefcase,
    groupId: "expertise",
    children: [
      {
        labelKey: translations[lang].expertiseSectionSettings,
        path: "/admin/expertise-management",
        icon: Settings,
      },
      {
        labelKey: translations[lang].strategicSkills,
        path: "/admin/strategic-skills",
        icon: Award,
      },
      {
        labelKey: translations[lang].toolItems,
        path: "/admin/tool-items",
        icon: Wrench,
      },
    ],
  },
  {
    labelKey: translations[lang].timeline,
    icon: Globe,
    groupId: "timeline",
    children: [
      {
        labelKey: translations[lang].sectionSettings,
        path: "/admin/timeline-section-settings",
        icon: Settings,
      },
      {
        labelKey: translations[lang].timelinePhases,
        path: "/admin/timeline-management",
        icon: Globe,
      },
    ],
  },
];
