import React from "react";
import { AdminField } from "../shared/AdminFormSection";
import { AdminStatusToggle } from "../shared/AdminStatusToggle";
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface FaqFormProps {
  formData: any;
  setFormData: (data: any) => void;
  activeSection: string;
  isTranslating: boolean;
  onAutoTranslate: () => void;
}

export const FaqForm = ({
  formData,
  setFormData,
  activeSection,
  isTranslating,
  onAutoTranslate,
}: FaqFormProps) => {
  return (
    <div className="space-y-10 text-left">
      {activeSection === "identity" && (
        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminField label="Cluster Category">
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm appearance-none outline-none"
            >
              <option value="general">General Narrative</option>
              <option value="technical">Technical Support</option>
              <option value="strategic">Strategic Intelligence</option>
              <option value="process">Operational Flow</option>
            </select>
          </AdminField>
          <AdminField label="Sequence Priority">
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order_index: parseInt(e.target.value),
                })
              }
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
            />
          </AdminField>
        </div>
      )}

      {activeSection === "content" && (
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminField label="Primary Enquiry Question (EN)">
            <input
              value={formData.question_en || ""}
              onChange={(e) =>
                setFormData({ ...formData, question_en: e.target.value })
              }
              placeholder="What is your core methodology?"
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-lg font-serif font-bold shadow-sm mb-6"
            />
          </AdminField>
          <AdminField label="Primary Enquiry Question (VI)">
            <input
              value={formData.question_vi || ""}
              onChange={(e) =>
                setFormData({ ...formData, question_vi: e.target.value })
              }
              placeholder="Phương pháp cốt lõi của bạn là gì?"
              className="w-full h-16 px-8 bg-muted/20 border-none rounded-2xl text-lg font-serif font-bold shadow-sm"
            />
          </AdminField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdminField label="Strategic Technical Answer (EN)">
              <textarea
                value={formData.answer_en || ""}
                onChange={(e) =>
                  setFormData({ ...formData, answer_en: e.target.value })
                }
                placeholder="Narration of the intelligence-driven response..."
                rows={8}
                className="w-full p-8 bg-muted/20 border-none rounded-[2rem] text-sm leading-relaxed shadow-sm font-serif italic font-bold resize-none"
              />
            </AdminField>
            <AdminField label="Strategic Technical Answer (VI)">
              <textarea
                value={formData.answer_vi || ""}
                onChange={(e) =>
                  setFormData({ ...formData, answer_vi: e.target.value })
                }
                placeholder="Mô tả về phản hồi dựa trên trí tuệ..."
                rows={8}
                className="w-full p-8 bg-muted/20 border-none rounded-[2rem] text-sm leading-relaxed shadow-sm font-serif italic font-bold resize-none"
              />
            </AdminField>
          </div>
        </div>
      )}

      {activeSection === "localization" && (
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between bg-sage/5 p-6 rounded-[2rem] border border-sage/10 mb-8">
            <div className="flex items-center gap-4">
              <Globe2 className="text-sage" size={24} />
              <div>
                <h4 className="text-xs font-bold text-sage uppercase tracking-widest">
                  Pacific linguistic protocol
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Synchronizing narrative for global impact.
                </p>
              </div>
            </div>
            <Button
              onClick={onAutoTranslate}
              disabled={isTranslating}
              className="bg-sage text-white rounded-xl px-6 h-12 font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2"
            >
              {isTranslating ? <LoadingSpinner /> : <Globe2 size={14} />}
              MAGIC SYNC
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdminField label="Enquiry Question (JP)">
              <input
                value={formData.question_ja || ""}
                onChange={(e) =>
                  setFormData({ ...formData, question_ja: e.target.value })
                }
                placeholder="質問を入力..."
                className="w-full h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </AdminField>
            <AdminField label="Enquiry Question (VI)">
              <input
                value={formData.question_vi || ""}
                onChange={(e) =>
                  setFormData({ ...formData, question_vi: e.target.value })
                }
                placeholder="Câu hỏi tiếng Việt..."
                className="w-full h-14 px-6 bg-muted/20 border-none rounded-2xl text-sm font-bold shadow-sm"
              />
            </AdminField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdminField label="Strategic Answer (JP)">
              <textarea
                value={formData.answer_ja || ""}
                onChange={(e) =>
                  setFormData({ ...formData, answer_ja: e.target.value })
                }
                placeholder="日本語の回答を入力..."
                rows={8}
                className="w-full p-8 bg-muted/20 border-none rounded-[2rem] text-sm leading-relaxed shadow-sm font-serif italic font-bold resize-none"
              />
            </AdminField>
            <AdminField label="Strategic Answer (VI)">
              <textarea
                value={formData.answer_vi || ""}
                onChange={(e) =>
                  setFormData({ ...formData, answer_vi: e.target.value })
                }
                placeholder="Câu trả lời tiếng Việt..."
                rows={8}
                className="w-full p-8 bg-muted/20 border-none rounded-[2rem] text-sm leading-relaxed shadow-sm font-serif italic font-bold resize-none"
              />
            </AdminField>
          </div>
        </div>
      )}

      {activeSection === "deployment" && (
        <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AdminStatusToggle
            label="Interface Exposure"
            isPublished={formData.is_published ?? false}
            onToggle={(val) =>
              setFormData({ ...formData, is_published: val })
            }
            description={{
              active: "This Enquiry is published to the public intelligence cluster.",
              inactive: "Enquiry currently in encrypted vault mode.",
            }}
          />
        </div>
      )}
    </div>
  );
};
