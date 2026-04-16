
import { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { PageSectionsList } from "./components/PageSectionsList";
import { WholePagePreview } from "./components/WholePagePreview";
import { useSectionReorder } from "@/hooks/useSectionReorder";
import { moveSection } from "@/core/api/sections";
import type { PageSection, PageType } from "@/core/types/sections";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Monitor, Laptop, Smartphone, X, ChevronLeft, Maximize2 } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { isSectionImplemented } from "@/lib/sectionRenderer";

function SectionsPageContent() {
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const { lang, translations } = useLang();
  const homeReorder = useSectionReorder("home");
  const portfolioReorder = useSectionReorder("portfolio");
  const { toast } = useToast();
  
  const [showHidden, setShowHidden] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "portfolio">("home");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"pc" | "sp">("sp");

  // Reset scroll positions
  useEffect(() => {
    if (previewScrollRef.current) previewScrollRef.current.scrollTop = 0;
  }, [activeTab, isFullScreen]);

  useEffect(() => {
    homeReorder.fetchSections();
    portfolioReorder.fetchSections();
  }, [homeReorder.fetchSections, portfolioReorder.fetchSections]);

  const handleMoveSection = async (sectionId: string, fromPage: PageType, toPage: PageType) => {
    try {
      const result = await moveSection({ section_id: sectionId, to_page_type: toPage });
      if (!result.success) throw new Error(result.error || "Failed to move section");
      await Promise.all([homeReorder.fetchSections(), portfolioReorder.fetchSections()]);
      toast({ title: "Success", description: result.message || "Section moved successfully" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to move section";
      await Promise.all([homeReorder.fetchSections(), portfolioReorder.fetchSections()]);
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const isLoading = homeReorder.isLoading || portfolioReorder.isLoading;
  const rawSections = activeTab === "home" ? homeReorder.sections : portfolioReorder.sections;
  const activeSections = rawSections.filter((s) => isSectionImplemented(s.section_key));
  const visibleSections = [...activeSections].filter((s) => s.is_visible).sort((a, b) => a.order_index - b.order_index);

  // FULL SCREEN MODE RENDERING
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Floating Control Bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl shadow-2xl">
           <div className="flex bg-slate-100 p-1 rounded-xl">
             <button onClick={() => setPreviewDevice("sp")} className={`p-2 rounded-lg transition-all ${previewDevice === "sp" ? "bg-white text-sage shadow-sm" : "text-slate-400"}`}>
               <Smartphone size={18} />
             </button>
             <button onClick={() => setPreviewDevice("pc")} className={`p-2 rounded-lg transition-all ${previewDevice === "pc" ? "bg-white text-sage shadow-sm" : "text-slate-400"}`}>
               <Laptop size={18} />
             </button>
           </div>
           <div className="w-px h-6 bg-black/10 mx-1" />
           <button 
             onClick={() => setIsFullScreen(false)}
             className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
           >
             <X size={14} /> Close
           </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#fcfaf7] flex flex-col items-center">
           {previewDevice === "sp" ? (
              <div className="mx-auto w-full max-w-[375px] min-h-screen bg-white shadow-2xl relative">
                <div className="sticky top-0 z-[100] h-6 bg-white flex items-center justify-center border-b">
                   <div className="w-12 h-1.5 rounded-full bg-slate-200" />
                </div>
                <WholePagePreview sections={visibleSections} scale={1} />
              </div>
           ) : (
             <div className="w-full min-h-screen bg-white shadow-2xl">
                <WholePagePreview sections={visibleSections} />
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-140px)] gap-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-2">
        <div>
          <h1 className="text-3xl font-serif text-heading tracking-tight">
            {translations[lang].sectionManagement}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            {translations[lang].sectionManagementDescription}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHidden((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              showHidden ? "bg-sage/10 text-sage border-sage/30" : "bg-white/70 text-slate-500 border-black/5 hover:bg-black/5"
            }`}
          >
            {showHidden ? <Eye size={15} /> : <EyeOff size={15} />}
            <span className="hidden sm:inline">{showHidden ? "Hide invisible" : "Show hidden"}</span>
          </button>

          <button 
            onClick={() => setIsFullScreen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-sage text-white shadow-md shadow-sage/20 border border-sage/50 active:scale-95 transition-all"
          >
            <Maximize2 size={15} />
            Live Preview
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex flex-col w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "home" | "portfolio")} className="flex flex-col h-full">
            <div className="p-1.5 rounded-2xl mb-3 bg-white/60 backdrop-blur-md border border-black/5">
              <TabsList className="w-full bg-transparent gap-1">
                <TabsTrigger value="home" className="flex-1 rounded-xl data-[state=active]:bg-sage data-[state=active]:text-white transition-all text-xs sm:text-sm">Home</TabsTrigger>
                <TabsTrigger value="portfolio" className="flex-1 rounded-xl data-[state=active]:bg-sage data-[state=active]:text-white transition-all text-xs sm:text-sm">Portfolio</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl border border-black/5 shadow-2xl shadow-black/5">
              <div className="p-4 h-full overflow-y-auto hide-scrollbar">
                <PageSectionsList
                  sections={activeTab === "home" ? homeReorder.sections : portfolioReorder.sections}
                  pageType={activeTab}
                  otherPageType={activeTab === "home" ? "portfolio" : "home"}
                  isLoading={isLoading}
                  onReorder={activeTab === "home" ? homeReorder.handleReorder : portfolioReorder.handleReorder}
                  onMove={(id, to) => handleMoveSection(id, activeTab, to)}
                  onToggleVisibility={activeTab === "home" ? homeReorder.handleToggleVisibility : portfolioReorder.handleToggleVisibility}
                />
              </div>
            </div>
          </Tabs>
        </div>

        {/* Desktop Split Preview (always visible on LG) */}
        <div className="hidden lg:flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 border border-black/5 text-xs font-medium text-slate-500">
                <Monitor size={13} className="text-sage" /> Live Preview
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-sage/10 text-sage text-[10px] font-bold uppercase">{activeTab}</span>
              </div>
              <button 
                onClick={() => setIsFullScreen(true)}
                className="p-1.5 hover:bg-black/5 rounded-lg text-slate-400 transition-colors"
                title="Full Screen"
              >
                <Maximize2 size={14} />
              </button>
            </div>
            <span className="text-[11px] text-slate-400">{visibleSections.length} sections</span>
          </div>

          <div className="flex-1 rounded-3xl overflow-hidden relative bg-white/40 backdrop-blur-xl border border-black/5 shadow-2xl shadow-black/5 flex flex-col">
            <div className="w-full flex items-center gap-1.5 px-4 py-3 border-b border-black/5 bg-white/80">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" /><div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
              <div className="flex-1 mx-3 px-3 py-1 bg-black/5 rounded-lg text-[10px] text-slate-400 font-mono truncate">
                {typeof window !== "undefined" ? window.location.host : "localhost:8080"}/{activeTab === "home" ? "" : "portfolio"}
              </div>
            </div>

            <div ref={previewScrollRef} className="flex-1 overflow-y-auto hide-scrollbar bg-white">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage" /><p className="text-sm text-muted-foreground animate-pulse">Loading...</p></div>
              ) : visibleSections.length === 0 ? (
                <div className="py-24 text-center"><EyeOff size={32} className="mx-auto text-slate-300 mb-3" /><p className="text-slate-400 text-sm">No visible sections</p></div>
              ) : (
                <WholePagePreview sections={visibleSections} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SectionsPage() {
  return (
    <AdminLayout>
      <SectionsPageContent />
    </AdminLayout>
  );
}
