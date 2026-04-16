import { Menu, X, ChevronRight, Globe } from "lucide-react";
import { NotificationBell } from "../NotificationBell";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  pathname: string;
  lang: string;
  setLang: (lang: string) => void;
  userEmail?: string;
}

export const AdminHeader = ({
  sidebarOpen,
  setSidebarOpen,
  pathname,
  lang,
  setLang,
  userEmail,
}: AdminHeaderProps) => {
  return (
    <header
      className="mx-4 md:mx-10 mt-4 mb-2 px-8 py-5 flex items-center justify-between flex-shrink-0 relative z-10 rounded-[2rem]"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-center gap-6">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-2xl text-slate-500 hover:text-sage hover:bg-white hover:shadow-sm transition-all duration-300 active:scale-90 border border-transparent hover:border-black/5"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden sm:flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
          <span className="text-slate-300">Space</span>
          <ChevronRight size={12} className="text-slate-300 opacity-50" />
          <span className="text-sage">
            {pathname === "/admin" 
              ? "Atrium" 
              : pathname.replace("/admin/", "").replace(/-/g, " ")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />

        <button
          onClick={() => {
            const langs: ("en" | "ja" | "vi")[] = ["en", "ja", "vi"];
            const currentIndex = langs.indexOf(lang as any);
            const nextLang = langs[(currentIndex + 1) % langs.length];
            setLang(nextLang);
          }}
          className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/50 hover:bg-white border border-black/[0.04] transition-all text-xs font-bold text-slate-600 shadow-sm"
        >
          <Globe size={16} className="text-sage group-hover:rotate-12 transition-transform" />
          <span className="opacity-70 group-hover:opacity-100 uppercase tracking-widest text-[10px]">
            {lang}
          </span>
        </button>

        <div className="p-1 px-2 flex items-center gap-3 bg-white/80 rounded-[1.25rem] border border-black/[0.04] shadow-sm">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-lg shadow-sage/20"
            style={{ background: "linear-gradient(135deg, hsl(var(--sage)), #2d5a3e)" }}
          >
            {userEmail?.[0]?.toUpperCase() ?? "A"}
          </div>
          <span className="hidden md:block text-xs text-slate-700 font-bold max-w-[140px] truncate pr-2">
            {userEmail?.split('@')[0]}
          </span>
        </div>
      </div>
    </header>
  );
};
