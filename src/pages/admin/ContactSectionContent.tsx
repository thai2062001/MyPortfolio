"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLang } from "@/contexts/LangContext";
import { translateFields } from "@/lib/translate";
import { 
  Wand2, MessageSquare, Type, Layout, Image as ImageIcon, 
  Settings2, Sparkles, Save, X, ChevronRight, Globe2, Eye, EyeOff,
  SlidersHorizontal, Zap, ShieldCheck, Mail, Send, Badge, Palette
} from "lucide-react";
import {
  getContactSection,
  upsertContactSection,
} from "@/lib/supabase-queries";
import type { ContactSection } from "@/types/admin";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MediaInput } from "@/components/admin/media/MediaInput";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ContactSectionContent = () => {
  const { lang, translations } = useLang();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("branding");

  const [formData, setFormData] = useState<Partial<ContactSection>>({
    eyebrow_en: "",
    eyebrow_ja: "",
    title_line_1_en: "",
    title_line_1_ja: "",
    title_line_2_en: "",
    title_line_2_ja: "",
    title_line_2_html: "",
    description_en: "",
    description_ja: "",
    primary_button_label_en: "",
    primary_button_label_ja: "",
    primary_button_url: "",
    background_image_url: "",
    overlay_opacity: 0.5,
    is_published: true,
  });

  useEffect(() => {
    fetchContactSection();
  }, []);

  const fetchContactSection = async () => {
    try {
      setLoading(true);
      const data = await getContactSection();
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      toast.error("Failed to sync Contact Protocol.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await upsertContactSection(formData);
      toast.success("Contact Sphere updated successfully.");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error during save.");
    } finally {
      setSaving(false);
    }
  };

  const handleAutoTranslate = async () => {
    try {
      setIsTranslating(true);
      const sourceFields = {
        eyebrow: formData.eyebrow_en,
        title_line_1: formData.title_line_1_en,
        title_line_2: formData.title_line_2_en,
        description: formData.description_en,
        primary_button_label: formData.primary_button_label_en,
      };

      if (!sourceFields.title_line_1) {
          toast.error("English parameters required for translation.");
          return;
      }

      const translated = await translateFields(sourceFields as any, "ja");
      setFormData({
        ...formData,
        eyebrow_ja: translated.eyebrow,
        title_line_1_ja: translated.title_line_1,
        title_line_2_ja: translated.title_line_2,
        description_ja: translated.description,
        primary_button_label_ja: translated.primary_button_label,
      });

      toast.success("Magic! Contact synchronization complete.");
    } catch (error) {
      toast.error("Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
         <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin"></div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage animate-pulse">Syncing Contact Sphere...</p>
         </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-12 animate-in fade-in duration-700 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
             <h1 className="text-4xl font-serif font-bold text-heading tracking-tight">Contact Sphere</h1>
             <p className="text-muted-foreground mt-2 text-sm tracking-wide">Refining the final invitation — the closing protocol of the professional journey.</p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="h-14 px-10 bg-sage hover:bg-sage/90 text-white rounded-2xl shadow-xl shadow-sage/20 font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group"
          >
            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
            Modify Invitation
          </Button>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div className="grid grid-cols-1 gap-12">
           <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3.5rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden relative group">
              <div className="absolute top-10 right-10 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border shadow-sm ${formData.is_published ? 'bg-sage text-white border-sage' : 'bg-white text-muted-foreground border-border'}`}>
                     {formData.is_published ? <Globe2 size={12} /> : <EyeOff size={12} />}
                     {formData.is_published ? 'Protocol Live' : 'Protocol Shadowed'}
                  </div>
              </div>

              <div className="relative rounded-[2.5rem] overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-14 space-y-8">
                 {formData.background_image_url && (
                    <div className="absolute inset-0 z-0">
                       <img src={formData.background_image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className="absolute inset-0 bg-black" style={{ opacity: formData.overlay_opacity || 0.5 }}></div>
                    </div>
                 )}
                 <div className="relative z-10 max-w-3xl space-y-6">
                    <p className={`text-xs tracking-[0.3em] uppercase font-bold ${formData.background_image_url ? 'text-white/80' : 'text-sage'}`}>{formData.eyebrow_en || "GET IN TOUCH"}</p>
                    <h2 className={`text-4xl md:text-5xl font-serif leading-tight ${formData.background_image_url ? 'text-white' : 'text-heading'}`}>
                       {formData.title_line_1_en}
                       <br />
                       <span className="italic text-sage">{formData.title_line_2_en}</span>
                    </h2>
                    <p className={`max-w-lg mx-auto font-light leading-relaxed font-serif italic ${formData.background_image_url ? 'text-white/60' : 'text-muted-foreground'}`}>{formData.description_en}</p>
                    <div className="pt-6">
                       <Button className="h-14 px-12 bg-sage hover:bg-sage/90 text-white rounded-xl shadow-2xl shadow-sage/30 font-bold uppercase tracking-widest text-xs">{formData.primary_button_label_en || "Start Conversation"}</Button>
                    </div>
                 </div>
              </div>
           </div>
        </div>        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[100vw] w-full h-full md:h-[92vh] md:max-w-6xl p-0 overflow-hidden bg-white md:bg-white/95 md:backdrop-blur-2xl border-none md:border-white/40 rounded-none md:rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row gap-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Contact Conversion Architect</DialogTitle>
              <DialogDescription>
                Refine and architect the final contact engagement and brand
                invitation matrix.
              </DialogDescription>
            </DialogHeader>

            {/* MOBILE CLOSE BUTTON */}
            <div className="absolute right-6 top-6 z-[60] md:hidden">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-heading active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* LEFT SIDEBAR NAVIGATION - Responsive */}
              <div className="w-full md:w-80 bg-sage/[0.03] border-b md:border-b-0 md:border-r border-sage/10 p-6 md:p-10 flex flex-col md:gap-10 overflow-hidden">
                <div className="mb-4 md:mb-2">
                  <h2 className="text-xl md:text-3xl font-serif font-bold text-heading">
                    Contact Config
                  </h2>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1 md:mt-2">
                    Closing Protocol
                  </p>
                </div>

                <nav className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 no-scrollbar -mx-2 md:mx-0 px-2 md:px-0">
                  {[
                    {
                      id: "branding",
                      label: "Core",
                      fullLabel: "Core Branding",
                      icon: Badge,
                    },
                    {
                      id: "narrative",
                      label: "Strategic",
                      fullLabel: "Content",
                      icon: Type,
                    },
                    {
                      id: "cta",
                      label: "Actions",
                      fullLabel: "Action Protocol",
                      icon: Send,
                    },
                    {
                      id: "ambience",
                      label: "Ambience",
                      fullLabel: "Visual Ambience",
                      icon: Palette,
                    },
                    {
                      id: "localization",
                      label: "i18n",
                      fullLabel: "Global Sync",
                      icon: Globe2,
                    },
                    {
                      id: "status",
                      label: "Status",
                      fullLabel: "Deploy Config",
                      icon: ShieldCheck,
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex-shrink-0 flex items-center gap-3 md:gap-5 px-4 md:px-7 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] font-bold text-xs md:text-sm transition-all duration-500 whitespace-nowrap ${
                        activeSection === item.id
                          ? "bg-sage text-white shadow-xl shadow-sage/20 scale-[1.03] active:scale-95"
                          : "bg-white/50 md:bg-transparent text-muted-foreground hover:bg-sage/5 hover:text-sage active:scale-95"
                      }`}
                    >
                      <item.icon size={16} className="md:w-5 md:h-5" />
                      <span className="md:hidden">{item.label}</span>
                      <span className="hidden md:inline">{item.fullLabel}</span>
                      {activeSection === item.id && (
                        <ChevronRight
                          size={16}
                          className="ml-auto hidden md:block"
                        />
                      )}
                    </button>
                  ))}
                </nav>

                <div className="hidden md:block mt-auto p-8 bg-black/5 rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-sage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl relative z-10">
                    <Mail className="text-sage" size={24} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-sage mb-2 relative z-10">
                    Conversion Core
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed relative z-10">
                    Optimizing final user interactions for maximum impact.
                  </p>
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 flex flex-col min-h-0 bg-white/40 relative">
                <div className="flex-1 overflow-y-auto p-6 md:p-14 space-y-8 md:space-y-12 custom-scrollbar pb-32 md:pb-14 font-bold text-left">
                  <div className="flex md:flex-row flex-col-reverse md:items-center justify-between border-b border-border/40 pb-6 md:pb-10 gap-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-heading capitalize flex items-center gap-3 md:gap-4">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-sage shadow-[0_0_15px_rgba(132,153,137,0.5)]"></span>
                        {activeSection} Framework
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 md:mt-2 font-serif italic tracking-wide truncate max-w-[250px] md:max-w-none">
                        Syncing Protocol:{" "}
                        {formData.title_line_1_en || "Main Invitation"}
                      </p>
                    </div>
                  </div>

                  <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {activeSection === "branding" && (
                      <div className="space-y-8 md:space-y-12 max-w-2xl">
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                            Atmosphere Eyebrow (Badge)
                          </label>
                          <Input
                            value={formData.eyebrow_en || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                eyebrow_en: e.target.value,
                              })
                            }
                            placeholder="GET IN TOUCH"
                            className="h-14 md:h-16 px-6 md:px-8 bg-muted/20 border-none rounded-xl md:rounded-2xl text-base font-bold shadow-sm"
                          />
                        </div>
                        <div className="p-6 md:p-8 bg-sage/5 border border-sage/10 rounded-2xl md:rounded-[2.5rem] flex items-center gap-4 md:gap-6">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sage shadow-md flex-shrink-0 animate-pulse">
                            <Sparkles size={20} />
                          </div>
                          <p className="text-[10px] text-sage font-bold uppercase tracking-widest leading-relaxed">
                            System-wide invitation protocol. Ensure alignment
                            with the Hero brand atmosphere.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeSection === "narrative" && (
                      <div className="space-y-8 md:space-y-12 max-w-3xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                          <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                              Primary Heading
                            </label>
                            <Input
                              value={formData.title_line_1_en || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title_line_1_en: e.target.value,
                                })
                              }
                              placeholder="Let's build something"
                              className="h-14 md:h-16 px-6 md:px-8 bg-muted/20 border-none rounded-xl md:rounded-2xl text-lg md:text-xl font-serif font-bold shadow-sm"
                            />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                              Italic Emphasis (Line 2)
                            </label>
                            <Input
                              value={formData.title_line_2_en || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title_line_2_en: e.target.value,
                                })
                              }
                              placeholder="remarkable together."
                              className="h-14 md:h-16 px-6 md:px-8 bg-muted/20 border-none rounded-xl md:rounded-2xl text-lg md:text-xl font-serif italic text-sage font-bold shadow-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                            Advanced Styling (HTML Override)
                          </label>
                          <Textarea
                            value={formData.title_line_2_html || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title_line_2_html: e.target.value,
                              })
                            }
                            placeholder="<span class='italic text-sage'>remarkable together.</span>"
                            rows={3}
                            className="p-4 md:p-6 bg-muted/20 border-none rounded-xl md:rounded-2xl text-xs font-mono shadow-sm"
                          />
                        </div>
                        <div className="space-y-4 pt-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                            Supporting Narrative (Description)
                          </label>
                          <Textarea
                            value={formData.description_en || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description_en: e.target.value,
                              })
                            }
                            placeholder="Invitation text focusing on collaboration and impact..."
                            rows={5}
                            className="p-6 md:p-8 bg-muted/20 border-none rounded-2xl md:rounded-[2.5rem] text-sm leading-relaxed shadow-sm font-serif italic text-heading/80 resize-none focus:ring-2 focus:ring-sage/20 transition-all font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {activeSection === "cta" && (
                      <div className="space-y-8 md:space-y-12 max-w-2xl">
                        <div className="p-6 md:p-10 bg-white border border-border/20 rounded-[2rem] md:rounded-[3rem] shadow-sm space-y-8">
                          <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                              Action Identifier (Label)
                            </label>
                            <Input
                              value={formData.primary_button_label_en || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  primary_button_label_en: e.target.value,
                                })
                              }
                              placeholder="Engage Conversation"
                              className="h-14 md:h-16 px-6 md:px-8 bg-muted/10 border-none rounded-xl md:rounded-2xl text-sm font-bold active:ring-1 active:ring-sage/20"
                            />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                              Deployment URI (Destination)
                            </label>
                            <div className="relative">
                              <Zap
                                className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                                size={18}
                              />
                              <Input
                                value={formData.primary_button_url || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    primary_button_url: e.target.value,
                                  })
                                }
                                placeholder="mailto:hello@example.com"
                                className="h-14 md:h-16 pl-14 pr-6 md:pr-8 bg-muted/10 border-none rounded-xl md:rounded-2xl text-xs font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === "ambience" && (
                      <div className="space-y-8 md:space-y-12 max-w-xl animate-in slide-in-from-right-8 duration-700">
                        <div className="space-y-6">
                          <MediaInput 
                            label="Atmospheric Backdrop"
                            value={formData.background_image_url || ""}
                            onChange={(url) => setFormData({...formData, background_image_url: url})}
                            placeholder="Select or upload background atmosphere..."
                            description="Cinematic backdrop for the contact section. Recommended: High-resolution editorial photography."
                          />
                        </div>

                        <div className="p-6 md:p-10 bg-muted/10 rounded-2xl md:rounded-[3rem] border border-border/20 space-y-8">
                          <div className="flex items-center justify-between px-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Overlay Intensity
                            </label>
                            <span className="text-sm font-bold text-sage">
                              {Math.round((formData.overlay_opacity || 0.5) * 100)}
                              %
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={formData.overlay_opacity || 0.5}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                overlay_opacity: parseFloat(e.target.value),
                              })
                            }
                            className="w-full h-2 bg-white rounded-full appearance-none accent-sage cursor-pointer"
                          />
                          <p className="text-[9px] text-muted-foreground italic leading-relaxed text-center px-4">
                            Calibrating the light ratio for optimal legibility
                            vs atmospheric impact.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeSection === "localization" && (
                      <div className="space-y-8 md:space-y-12 max-w-4xl animate-in slide-in-from-right-8 duration-700">
                        <div className="flex md:flex-row flex-col items-start md:items-center justify-between bg-sage/5 p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-sage/10 relative overflow-hidden group shadow-sm gap-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                          <div className="flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-sage shadow-xl group-hover:rotate-[360deg] transition-transform duration-1000">
                              <Globe2 size={32} />
                            </div>
                            <h4 className="text-sm font-bold text-sage uppercase tracking-[0.2em]">
                              Pacific linguistic protocol
                            </h4>
                          </div>
                          <Button
                            onClick={handleAutoTranslate}
                            disabled={isTranslating}
                            className="w-full md:w-auto h-16 px-12 bg-sage text-white rounded-[1.5rem] font-bold text-xs uppercase tracking-widest shadow-2xl shadow-sage/30 flex items-center gap-4 hover:scale-105 active:scale-95 transition-all relative z-10"
                          >
                            {isTranslating ? (
                              <LoadingSpinner />
                            ) : (
                              <Wand2 size={20} />
                            )}
                            {isTranslating ? "SYNCING..." : "MAGIC AUTO-SYNC"}
                          </Button>
                        </div>

                        <div className="space-y-8 md:space-y-10 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                            <div className="space-y-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                                Eyebrow (JP)
                              </label>
                              <Input
                                value={formData.eyebrow_ja || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    eyebrow_ja: e.target.value,
                                  })
                                }
                                placeholder="お問い合わせ"
                                className="h-14 px-6 bg-muted/20 border-none rounded-xl md:rounded-2xl text-base font-bold"
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                                Call to Action (JP)
                              </label>
                              <Input
                                value={formData.primary_button_label_ja || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    primary_button_label_ja: e.target.value,
                                  })
                                }
                                placeholder="会話を始める"
                                className="h-14 px-6 bg-muted/20 border-none rounded-xl md:rounded-2xl text-xs font-bold"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                              Primary Heading (JP)
                            </label>
                            <Input
                              value={formData.title_line_1_ja || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title_line_1_ja: e.target.value,
                                })
                              }
                              placeholder="一緒に素晴らしいもの..."
                              className="h-14 px-6 bg-muted/20 border-none rounded-xl md:rounded-2xl text-base font-bold"
                            />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                              Synthesis Narrative (JP)
                            </label>
                            <Textarea
                              value={formData.description_ja || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description_ja: e.target.value,
                                })
                              }
                              placeholder="コラボレーションとインパクト..."
                              rows={5}
                              className="p-6 md:p-8 bg-muted/20 border-none rounded-2xl md:rounded-[2.5rem] text-sm font-serif italic font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === "status" && (
                      <div className="space-y-12 max-w-2xl animate-in slide-in-from-right-8 duration-700">
                        <div
                          className={`flex md:flex-row flex-col items-center gap-6 md:gap-10 p-8 md:p-14 rounded-2xl md:rounded-[3.5rem] border transition-all cursor-pointer ${formData.is_published ? "bg-sage/5 border-sage/20 shadow-2xl" : "bg-muted/30 border-border/40"}`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              is_published: !formData.is_published,
                            })
                          }
                        >
                          <div
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-[1.8rem] flex items-center justify-center transition-all shadow-xl ${formData.is_published ? "bg-sage text-white animate-pulse" : "bg-muted-foreground/20 text-muted-foreground"}`}
                          >
                            {formData.is_published ? (
                              <Globe2 size={32} />
                            ) : (
                              <EyeOff size={32} />
                            )}
                          </div>
                          <div className="text-center md:text-left flex-1">
                            <h4 className="text-lg md:text-xl font-bold text-heading">
                              Public Publish Settings
                            </h4>
                            <p className="text-xs text-muted-foreground mt-2 md:mt-3 leading-relaxed">
                              {formData.is_published
                                ? "Final invitation is live and accessible at the conclusion of the portfolio."
                                : "Invitation archived in shadow mode. Section suppressed from global grid."}
                            </p>
                          </div>
                          <div className="hidden md:block">
                            <div
                              className={`w-14 h-8 rounded-full relative transition-all duration-500 ${formData.is_published ? "bg-sage" : "bg-muted-foreground/30"}`}
                            >
                              <div
                                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-md ${formData.is_published ? "left-7" : "left-1"}`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* FOOTER - Responsive sticky/fixed for mobile */}
                <DialogFooter className="md:h-32 bg-white/80 md:bg-sage/[0.03] p-6 md:p-10 flex flex-row items-center justify-end gap-3 md:gap-6 border-t border-sage/10 backdrop-blur-md md:backdrop-blur-none absolute bottom-0 left-0 right-0 md:relative">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-6 md:px-10 h-12 md:h-16 text-muted-foreground hover:bg-black/5 font-bold rounded-xl md:rounded-2xl transition-all text-xs md:text-sm"
                  >
                    Abort
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-sage hover:bg-sage/90 text-white rounded-xl md:rounded-[2rem] px-8 md:px-14 h-12 md:h-18 shadow-lg md:shadow-2xl shadow-sage/30 font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3 md:gap-4 flex-1 md:flex-none justify-center"
                  >
                    {saving ? <LoadingSpinner /> : <Save size={18} className="md:w-5 md:h-5" />}
                    <span className="uppercase tracking-[0.15em] text-xs md:text-sm">
                      {saving ? "SYNC..." : "Publish"}
                    </span>
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ContactSectionContent;
