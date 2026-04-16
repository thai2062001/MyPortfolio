import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Type, Terminal } from "lucide-react";
import { Font } from "@/types/admin";
import { cn } from "@/lib/utils";

interface SiteSettingsFormProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  fonts: Font[];
}

export const SiteSettingsForm = ({
  formData,
  setFormData,
  activeSection,
  fonts,
}: SiteSettingsFormProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      {activeSection === "general" && (
        <div className="space-y-12 max-w-2xl text-left">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Site Name
            </label>
            <Input
              value={formData.site_name || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  site_name: e.target.value,
                })
              }
              placeholder="My Portfolio"
              className="h-18 px-8 bg-muted/20 border-none rounded-2xl text-xl font-serif font-bold shadow-sm"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Default Language
            </label>
            <select
              className="w-full h-18 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-sage/20 outline-none appearance-none"
              value={formData.default_language}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  default_language: e.target.value,
                })
              }
            >
              <option value="en">English</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>
      )}

      {activeSection === "typography" && (
        <div className="space-y-12 max-w-3xl text-left">
          <div className="bg-sage/5 p-10 rounded-[3rem] border border-sage/10 mb-8">
            <div className="flex items-center gap-6 text-sage mb-6">
              <Type size={32} />
              <h4 className="text-lg font-serif font-bold">
                Typography Settings
              </h4>
            </div>
            <p className="text-xs text-muted-foreground italic font-serif leading-relaxed">
              Configure your site's fonts. Changes apply globally to your website's appearance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                Heading Font
              </label>
              <select
                className="w-full h-14 px-7 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-sage/20 outline-none appearance-none"
                value={formData.heading_font_id || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heading_font_id: e.target.value || null,
                  })
                }
              >
                <option value="">Default (Theme)</option>
                {fonts.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                Body Font
              </label>
              <select
                className="w-full h-14 px-7 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-sage/20 outline-none appearance-none"
                value={formData.body_font_id || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    body_font_id: e.target.value || null,
                  })
                }
              >
                <option value="">Default (Theme)</option>
                {fonts.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-8 space-y-8 border-t border-border/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  Font Family
                </label>
                <Input
                  value={formData.global_font_family}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      global_font_family: e.target.value,
                    })
                  }
                  placeholder="Inter"
                  className="h-14 px-7 bg-muted/10 border-none rounded-2xl text-sm italic"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                  Font Fallback
                </label>
                <Input
                  value={formData.global_font_fallback}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      global_font_fallback: e.target.value,
                    })
                  }
                  placeholder="sans-serif"
                  className="h-14 px-7 bg-muted/10 border-none rounded-2xl text-sm italic"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
                Google Font Import URL
              </label>
              <Input
                value={formData.global_font_import_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    global_font_import_url: e.target.value,
                  })
                }
                placeholder="https://fonts.googleapis.com/..."
                className="h-14 px-7 bg-muted/5 border-none rounded-xl text-[10px] font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === "advanced" && (
        <div className="space-y-10 max-w-4xl text-left">
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
              Custom CSS Overrides
            </label>
            <div className="relative group">
              <div className="absolute top-6 left-6 w-2 h-2 rounded-full bg-sage shadow-[0_0_10px_rgba(132,153,137,0.5)] animate-pulse"></div>
              <Textarea
                value={formData.global_custom_css || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    global_custom_css: e.target.value,
                  })
                }
                placeholder="/* System Overrides */"
                rows={12}
                className="p-14 bg-black/90 text-sage font-mono text-xs border-none rounded-[3rem] shadow-2xl resize-none focus:ring-2 focus:ring-sage/20 transition-all font-bold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
