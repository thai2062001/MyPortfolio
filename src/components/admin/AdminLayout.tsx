import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminHeader } from "./layout/AdminHeader";
import { AdminSidebar } from "./layout/AdminSidebar";
import { getAdminMenu, MenuItem } from "@/config/adminMenu";
import { useQuery } from "@tanstack/react-query";
import { getMediaFolders } from "@/lib/supabase-media";
import { Folder } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const isMobile = useIsMobile();
  const [isLaptop, setIsLaptop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const { user, signOut } = useAuth();
  const { lang, setLang, translations } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  const { data: folders = [] } = useQuery({
    queryKey: ["media-folders"],
    queryFn: getMediaFolders,
  });

  const menuItems = useMemo(() => {
    const baseMenu = getAdminMenu(translations, lang);
    const mediaIndex = baseMenu.findIndex((item) => item.path === "/admin/media");
    if (mediaIndex !== -1 && folders.length > 0) {
      const mediaItem = baseMenu[mediaIndex];
      baseMenu[mediaIndex] = {
        labelKey: mediaItem.labelKey,
        icon: mediaItem.icon,
        groupId: "media",
        children: [
          {
            labelKey: translations[lang].allResources || (lang === "vi" ? "Tất cả tài nguyên" : lang === "ja" ? "すべてのリソース" : "All Resources"),
            path: "/admin/media",
            icon: mediaItem.icon,
          },
          ...folders.map((f) => ({
            labelKey: f.name,
            path: `/admin/media?folder=${f.id}`,
            icon: Folder,
          })),
        ],
      };
    }
    return baseMenu;
  }, [translations, lang, folders]);

  // Sync with window size for Laptop breakpoint
  useEffect(() => {
    const checkLaptop = () => setIsLaptop(window.innerWidth >= 768 && window.innerWidth < 1280);
    checkLaptop();
    window.addEventListener("resize", checkLaptop);
    return () => window.removeEventListener("resize", checkLaptop);
  }, []);

  // Auto-manage sidebar based on breakpoints
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else if (isLaptop) {
      setSidebarOpen(false); // Mini mode for laptop
    } else {
      setSidebarOpen(true); // Default open for large screens
    }
  }, [isMobile, isLaptop]);

  // Sidebar Scroll Management
  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;
    const savedScroll = sessionStorage.getItem("admin-sidebar-scroll");
    if (savedScroll) {
      requestAnimationFrame(() => { navElement.scrollTop = parseInt(savedScroll, 10); });
    }
    const handleScroll = () => sessionStorage.setItem("admin-sidebar-scroll", navElement.scrollTop.toString());
    navElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => navElement.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync expanded groups with current route
  useEffect(() => {
    const activeGroup = menuItems.find(item => 
      item.children?.some(child => {
        if (!child.path) return false;
        if (child.path.includes("?")) {
          return child.path.split("?")[0] === location.pathname;
        }
        return child.path === location.pathname;
      })
    )?.groupId;

    if (activeGroup && !expandedGroups.includes(activeGroup)) {
      setExpandedGroups(prev => [...prev, activeGroup]);
    }
  }, [location.pathname, menuItems]);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path.includes("?")) {
      const [pathname, search] = path.split("?");
      return location.pathname === pathname && location.search.includes(search);
    }
    if (path === "/admin/media") {
      return location.pathname === "/admin/media" && !location.search.includes("folder=");
    }
    return location.pathname === path;
  };
  const isGroupActive = (children?: MenuItem[]) => children?.some((child) => isActive(child.path)) ?? false;
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]);
  };

  return (
    <div className="flex h-screen bg-[#fcfaf7]">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        expandedGroups={expandedGroups}
        toggleGroup={toggleGroup}
        isActive={isActive}
        isGroupActive={isGroupActive}
        handleLogout={handleLogout}
        translations={translations}
        lang={lang}
        navigate={navigate}
        navRef={navRef}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-vibe-pink/5 opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.01] pointer-events-none" />
        
        <AdminHeader 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          pathname={location.pathname}
          lang={lang}
          setLang={setLang}
          userEmail={user?.email}
        />

        <main className="flex-1 overflow-auto hide-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="px-6 pt-2 pb-6 md:px-10 md:pt-4 md:pb-10 lg:px-12 lg:pt-4 min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
