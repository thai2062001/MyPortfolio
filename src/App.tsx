import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LangProvider, useLang } from "@/contexts/LangContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteProvider, useSite } from "@/contexts/SiteContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { useFontSettings } from "@/hooks/useFontSettings";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import { useThemePages } from "./themes/ThemeEntry";
import PremiumLoader from "@/components/ui/PremiumLoader";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { HelmetProvider } from "react-helmet-async";

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProjectCategories = lazy(() => import("./pages/admin/ProjectCategories"));
const Projects = lazy(() => import("./pages/admin/Projects"));
const ProjectTags = lazy(() => import("./pages/admin/ProjectTags"));
const BlogPosts = lazy(() => import("./pages/admin/BlogPosts"));
const BlogCategories = lazy(() => import("./pages/admin/BlogCategories"));
const BlogTags = lazy(() => import("./pages/admin/BlogTags"));
const BlogPostEditor = lazy(() => import("./pages/admin/BlogPostEditor"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const AboutContentPage = lazy(() => import("./pages/admin/AboutContent"));
const AboutTags = lazy(() => import("./pages/admin/AboutTags"));
const Clients = lazy(() => import("./pages/admin/Clients"));
const Testimonials = lazy(() => import("./pages/admin/Testimonials"));
const PersonalInfo = lazy(() => import("./pages/admin/PersonalInfo"));
const ContactMessages = lazy(() => import("./pages/admin/ContactMessages"));
const SiteSettings = lazy(() => import("./pages/admin/SiteSettings"));
const HeroManagement = lazy(() => import("./pages/admin/HeroManagement"));
const ExpertiseManagement = lazy(() => import("./pages/admin/ExpertiseManagement"));
const StrategicSkillsManagement = lazy(() => import("./pages/admin/StrategicSkillsManagement"));
const ToolItemsManagement = lazy(() => import("./pages/admin/ToolItemsManagement"));
const TimelineManagement = lazy(() => import("./pages/admin/TimelineManagement"));
const TimelineSectionSettings = lazy(() => import("./pages/admin/TimelineSectionSettings"));
const SkillCategoriesAdmin = lazy(() => import("./pages/admin/SkillCategoriesAdmin"));
const SkillsAdmin = lazy(() => import("./pages/admin/SkillsAdmin"));
const SkillDetailsAdmin = lazy(() => import("./pages/admin/SkillDetailsAdmin"));
const SectionsPage = lazy(() => import("./pages/admin/sections/Sections"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const FaqManagement = lazy(() => import("./pages/admin/FaqManagement"));
const ContactConfig = lazy(() => import("./pages/admin/ContactConfig"));
const Stats = lazy(() => import("./pages/admin/Stats"));
const ThemeManagement = lazy(() => import("./pages/admin/ThemeManagement"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const AppContent = () => {
  const { lang, setLang } = useLang();

  // Globally disable browser scroll restoration to prevent conflicts with our custom logic
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useFontSettings();

  return (
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
  );
};

const AppRoutes = () => {
  usePortfolioAnalytics();
  const ThemePages = useThemePages();

  return (
    <Suspense fallback={<PremiumLoader text="Radiant Growth" />}>
      <ThemeInitializer />
      {/* ScrollToTop is now local to the theme */}
      <ThemePages.ScrollToTop />
      
      <Routes>
        <Route path="/" element={<ThemePages.Home />} />
        <Route path="/blog" element={<ThemePages.Blog />} />
        <Route path="/blog/:slug" element={<ThemePages.BlogDetail />} />
        <Route path="/portfolio" element={<ThemePages.Portfolio />} />
        <Route path="/projects" element={<ThemePages.Projects />} />
        <Route path="/contact" element={<ThemePages.Contact />} />
        <Route path="/privacy" element={<ThemePages.Privacy />} />
        <Route path="/project/:slug" element={<ThemePages.ProjectDetail />} />
        <Route path="/skills" element={<ThemePages.Skills />} />
        <Route path="/skills/:slug" element={<ThemePages.SkillCategory />} />
        <Route
          path="/skills/:categorySlug/:skillSlug"
          element={<ThemePages.SkillDetail />}
        />
        <Route
          path="/skill/:slug"
          element={<ThemePages.SkillDetail />}
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/project-categories"
          element={
            <ProtectedRoute>
              <ProjectCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/tags"
          element={
            <ProtectedRoute>
              <ProjectTags />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog/posts"
          element={
            <ProtectedRoute>
              <BlogPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog/posts/new"
          element={
            <ProtectedRoute>
              <BlogPostEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog/posts/edit/:id"
          element={
            <ProtectedRoute>
              <BlogPostEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog/categories"
          element={
            <ProtectedRoute>
              <BlogCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog/tags"
          element={
            <ProtectedRoute>
              <BlogTags />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/media"
          element={
            <ProtectedRoute>
              <MediaLibrary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/about-content"
          element={
            <ProtectedRoute>
              <AboutContentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/about-tags"
          element={
            <ProtectedRoute>
              <AboutTags />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/skills"
          element={
            <ProtectedRoute>
              <SkillsAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/testimonials"
          element={
            <ProtectedRoute>
              <Testimonials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/personal-info"
          element={
            <ProtectedRoute>
              <PersonalInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contact-messages"
          element={
            <ProtectedRoute>
              <ContactMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contact-config"
          element={
            <ProtectedRoute>
              <ContactConfig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/site-settings"
          element={
            <ProtectedRoute>
              <SiteSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/themes"
          element={
            <ProtectedRoute>
              <ThemeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hero-management"
          element={
            <ProtectedRoute>
              <HeroManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/expertise-management"
          element={
            <ProtectedRoute>
              <ExpertiseManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/strategic-skills"
          element={
            <ProtectedRoute>
              <StrategicSkillsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tool-items"
          element={
            <ProtectedRoute>
              <ToolItemsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/timeline-management"
          element={
            <ProtectedRoute>
              <TimelineManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/timeline-section-settings"
          element={
            <ProtectedRoute>
              <TimelineSectionSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/skill-categories"
          element={
            <ProtectedRoute>
              <SkillCategoriesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/skill-details"
          element={
            <ProtectedRoute>
              <SkillDetailsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sections"
          element={
            <ProtectedRoute>
              <SectionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/faq-management"
          element={
            <ProtectedRoute>
              <FaqManagement />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SiteProvider>
          <LangProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </LangProvider>
        </SiteProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
