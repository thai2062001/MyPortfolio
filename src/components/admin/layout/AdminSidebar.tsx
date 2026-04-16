import { motion } from "framer-motion";
import { LogOut, ChevronDown } from "lucide-react";
import { MenuItem } from "@/config/adminMenu";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  setSidebarOpen: (open: boolean) => void;
  menuItems: MenuItem[];
  expandedGroups: string[];
  toggleGroup: (groupId: string) => void;
  isActive: (path?: string) => boolean | string | undefined;
  isGroupActive: (children?: MenuItem[]) => boolean;
  handleLogout: () => void;
  translations: any;
  lang: string;
  navigate: (path: string) => void;
  navRef: React.RefObject<HTMLDivElement>;
}

export const AdminSidebar = ({
  sidebarOpen,
  isMobile,
  setSidebarOpen,
  menuItems,
  expandedGroups,
  toggleGroup,
  isActive,
  isGroupActive,
  handleLogout,
  translations,
  lang,
  navigate,
  navRef,
}: AdminSidebarProps) => {
  const renderMenuItem = (item: MenuItem) => {
    const IconComponent = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const groupId = item.groupId || "";
    const isGroupExpanded = expandedGroups.includes(groupId);
    const itemIsActive = isActive(item.path);
    const groupIsActive = isGroupActive(item.children);

    const handleNavigate = (path: string) => {
      navigate(path);
      if (isMobile) setSidebarOpen(false);
    };

    if (hasChildren) {
      return (
        <div key={item.labelKey} className="px-2.5">
          <button
            onClick={() => {
              toggleGroup(groupId);
              if (isMobile && !sidebarOpen) setSidebarOpen(true);
            }}
            title={!sidebarOpen ? item.labelKey : ""}
            className={`
              w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold
              transition-all duration-200 group
              ${
                groupIsActive
                  ? "bg-sage/15 text-sage"
                  : "text-slate-600 hover:bg-black/5 hover:text-slate-800"
              }
              ${!sidebarOpen && "justify-center px-0"}
            `}
          >
            <span
              className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
                groupIsActive
                  ? "bg-sage/20 text-sage"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
              }`}
            >
              <IconComponent size={14} />
            </span>
            {sidebarOpen && (
              <>
                <span className="flex-1 text-left truncate">{item.labelKey}</span>
                <ChevronDown
                  size={12}
                  className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                    isGroupExpanded ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {sidebarOpen && isGroupExpanded && (
            <div className="mt-0.5 ml-2.5 pl-3 border-l-2 border-sage/10 space-y-0.5 mb-0.5">
              {item.children!.map((child) => (
                <button
                  key={child.path}
                  onClick={() => handleNavigate(child.path!)}
                  className={`
                    w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] font-bold
                    transition-all duration-200
                    ${
                      isActive(child.path)
                        ? "bg-sage text-white shadow-sm shadow-sage/30"
                        : "text-slate-500 hover:bg-black/5 hover:text-slate-700"
                    }
                  `}
                >
                  <child.icon size={13} className="flex-shrink-0 opacity-70" />
                  <span className="truncate">{child.labelKey}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.path} className="px-2.5">
        <button
          onClick={() => handleNavigate(item.path!)}
          title={!sidebarOpen ? item.labelKey : ""}
          className={`
            w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold
            transition-all duration-200 group
            ${
              itemIsActive
                ? "bg-sage text-white shadow-md shadow-sage/30"
                : "text-slate-600 hover:bg-black/5 hover:text-slate-800"
            }
            ${!sidebarOpen && "justify-center px-0"}
          `}
        >
          <span
            className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
              itemIsActive
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
            }`}
          >
            <IconComponent size={14} />
          </span>
          {sidebarOpen && <span className="truncate">{item.labelKey}</span>}
        </button>
      </div>
    );
  };

  return (
    <div
      className={`
        ${
          sidebarOpen
            ? "w-64 translate-x-0"
            : isMobile
              ? "w-64 -translate-x-full"
              : "w-[80px] translate-x-0"
        }
        flex-shrink-0 transition-all duration-500 ease-[0.22,1,0.36,1] flex flex-col fixed md:relative h-full z-40 top-0 left-0
      `}
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderRight: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "10px 0 40px rgba(0,0,0,0.02)",
      }}
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none" />
      
      <div
        className={`flex items-center gap-2.5 px-4 py-6 border-b border-black/5 ${
          !sidebarOpen && !isMobile && "justify-center px-0"
        }`}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-white text-xs shadow-sm shadow-sage/30"
          style={{ background: "hsl(var(--sage))" }}
        >
          AP
        </div>
        {(sidebarOpen || (isMobile && sidebarOpen)) && (
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">
              Admin Panel
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Perspective
            </p>
          </div>
        )}
      </div>

      <nav
        ref={navRef}
        className="flex-1 overflow-y-auto py-4 space-y-1 hide-scrollbar"
      >
        {sidebarOpen && (
          <p className="px-5 pb-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">
            Interface
          </p>
        )}
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      <div className="border-t border-black/5 p-3">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold
            text-rose-500 hover:bg-rose-50 border border-rose-100/60 hover:border-rose-200
            transition-all duration-300 group
            ${!sidebarOpen && !isMobile && "justify-center"}
          `}
          title={!sidebarOpen && !isMobile ? "Logout" : ""}
        >
          <LogOut
            size={14}
            className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform"
          />
          {(sidebarOpen || (isMobile && sidebarOpen)) && (
            <span className="uppercase tracking-widest">{translations[lang].logout}</span>
          )}
        </button>
      </div>
    </div>
  );
};
