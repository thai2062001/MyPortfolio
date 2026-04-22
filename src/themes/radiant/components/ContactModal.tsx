import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ChevronDown } from "lucide-react";
import { useState, useCallback, useRef, useEffect, memo } from "react";
import { useLang } from "@/contexts/LangContext";
import { portfolioApi } from "@/core/api/portfolio";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { useIsTablet } from "@/hooks/use-mobile";

// --- CUSTOM SELECT COMPONENT ---
const CustomPurposeSelect = ({ 
  options, 
  value, 
  placeholder, 
  lang, 
  onChange,
  required 
}: { 
  options: any[], 
  value: string, 
  placeholder: string, 
  lang: string, 
  onChange: (val: string) => void,
  required: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const listener = (event: any) => {
      const el = containerRef?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const getLabel = (option: any) => {
    if (lang === "ja") return option.label_ja || option.label_en;
    if (lang === "vi") return option.label_vi || option.label_en;
    return option.label_en;
  };
  
  const displayLabel = selectedOption ? getLabel(selectedOption) : placeholder;

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border-b border-heading/20 py-3 md:py-4 text-base md:text-xl text-heading font-light transition-all duration-500 hover:border-sage cursor-pointer !outline-none focus:!outline-none focus:!ring-0"
        style={{ outline: 'none', boxShadow: 'none' }}
      >
        <span className={!selectedOption ? "text-heading/30" : ""}>{displayLabel}</span>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronDown className="text-heading/20" size={20} strokeWidth={1.5} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full mt-4 z-[100] bg-white border border-black/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden p-3"
          >
            <div className="max-h-[300px] overflow-y-auto thin-scrollbar space-y-1">
              {options.map((option, idx) => (
                <motion.button
                  key={option.id || idx}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-4 rounded-2xl text-base md:text-lg transition-all duration-300 ${
                    value === option.value 
                      ? "bg-sage/10 text-sage font-medium" 
                      : "text-heading/70 hover:bg-black/5 hover:text-heading"
                  }`}
                >
                  {getLabel(option)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="hidden" 
        value={value} 
        required={required} 
        name="purpose" 
        autoComplete="off"
      />
    </div>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  formSettings: any;
  purposeOptions: any[];
}

export const ContactModal = memo(({ isOpen, onClose, formSettings, purposeOptions }: ContactModalProps) => {
  const { lang, t } = useLang();
  const isTablet = useIsTablet();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    purpose: "",
    message: "",
  });

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.name || !formData.email || !formData.message || (formSettings?.is_purpose_required && !formData.purpose)) {
        alert(lang === "ja" ? "すべての必須項目を入力してください" : "Please fill in all required fields");
        setLoading(false);
        return;
      }

      const { success, error } = await portfolioApi.submitContactMessage({
        name: formData.name,
        email: formData.email,
        company: formData.company || null,
        purpose: formData.purpose || null,
        message: formData.message,
        is_read: false,
        is_replied: false,
      });

      if (!success) throw error;

      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", purpose: "", message: "" });
      setTimeout(() => {
        onClose();
        setTimeout(() => setSubmitted(false), 300);
      }, 2500);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert(lang === "ja" ? "メッセージの送信中にエラーが発生しました。再試行してください。" : "Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, formSettings, lang, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-0 lg:p-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-white/40 lg:bg-white/40 backdrop-blur-2xl"
            onClick={() => !submitted && onClose()}
          />
          <motion.div
            className="relative w-full h-full lg:h-auto lg:max-h-[92vh] lg:max-w-4xl ethereal-glass lg:border-white rounded-none lg:rounded-[5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col will-change-transform"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 300, delay: 0.05 }}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 md:top-12 md:right-12 text-heading/20 hover:text-heading hover:bg-black/5 transition-all duration-300 p-2 md:p-4 rounded-full z-50 bg-white/50 backdrop-blur-md"
            >
              <X size={20} className="md:w-8 md:h-8" strokeWidth={1.5} />
            </button>

            <div className="flex-1 overflow-y-auto thin-scrollbar p-6 pt-12 pb-24 md:px-16 md:pt-14 md:pb-40">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6 md:space-y-8 relative z-10"
                    variants={staggerContainer(0.08, 0.1)}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="space-y-1 md:space-y-2 text-left">
                       <motion.span variants={fadeIn("up")} className="font-artistic text-xl md:text-2xl text-vibe-pink">{lang === "ja" ? "ご挨拶" : "Greetings."}</motion.span>
                       <motion.h3 variants={fadeIn("up")} className="font-display text-4xl md:text-5xl text-heading font-light tracking-tighter leading-none">
                          Inquiry <br/>
                          <span className="italic opacity-60">Archive.</span>
                       </motion.h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6">
                      {[
                        { name: "name", label: t("Name", "お名前"), type: "text", placeholder: "Full Name" },
                        { name: "email", label: t("Email", "メール"), type: "email", placeholder: "Email Address" },
                        { name: "company", label: t("Company", "会社名"), type: "text", placeholder: "Optional" },
                      ].map((field) => (
                        <motion.div key={field.name} variants={fadeIn("up")} className="space-y-1.5">
                           <label className="font-sans text-[9px] tracking-[0.4em] uppercase text-heading/70 font-bold ml-1">
                              {field.label}
                           </label>
                           <input
                             type={field.type}
                             name={field.name}
                             placeholder={field.placeholder}
                             required={field.name !== "company"}
                             value={(formData as any)[field.name]}
                             onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                             className="w-full bg-transparent border-b border-heading/20 px-0 py-2 md:py-3 text-base md:text-lg text-heading font-light placeholder:text-heading/30 !outline-none focus:!outline-none focus:border-sage focus:!ring-0 focus-visible:!ring-0 transition-all duration-500"
                           />
                        </motion.div>
                      ))}

                      {formSettings?.is_purpose_enabled && (
                        <motion.div variants={fadeIn("up")} className="space-y-1.5 relative group">
                          <label className="font-sans text-[9px] tracking-[0.4em] uppercase text-heading/70 font-bold ml-1">
                            {t("Purpose", "目的")}
                          </label>
                          <CustomPurposeSelect 
                            options={purposeOptions}
                            value={formData.purpose}
                            placeholder={
                              lang === "ja" ? formSettings.purpose_placeholder_ja : 
                              lang === "vi" ? formSettings.purpose_placeholder_vi : 
                              formSettings.purpose_placeholder_en
                            }
                            lang={lang}
                            onChange={(val) => setFormData(prev => ({ ...prev, purpose: val }))}
                            required={formSettings.is_purpose_required}
                          />
                        </motion.div>
                      )}
                    </div>

                    <motion.div 
                      variants={fadeIn("up")}
                      className="space-y-1.5"
                    >
                       <label className="font-sans text-[9px] tracking-[0.4em] uppercase text-heading/70 font-bold ml-1">
                          {t("Message", "メッセージ")}
                       </label>
                       <textarea
                         rows={2}
                         placeholder="The vision for your next monumental chapter..."
                         required
                         value={formData.message}
                         onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                         className="w-full bg-transparent border-b border-heading/20 px-0 py-2 md:py-3 text-base md:text-lg text-heading font-light placeholder:text-heading/30 !outline-none focus:!outline-none focus:border-sage focus:!ring-0 focus-visible:!ring-0 transition-all duration-500 resize-none min-h-[50px] md:min-h-[70px]"
                       />
                    </motion.div>

                    <motion.div 
                      variants={fadeIn("up")}
                      className="pt-2"
                    >
                       <button
                         type="submit"
                         disabled={loading}
                         className={`relative group w-full py-5 rounded-full bg-heading text-white shadow-2xl transition-all duration-500 disabled:opacity-50 ${
                           !isTablet ? "hover:scale-[1.01] active:scale-[0.99]" : "active:scale-[0.98]"
                         }`}
                       >
                          <span className="relative z-10 flex items-center justify-center gap-6 text-[11px] tracking-[0.5em] uppercase font-black">
                            {loading ? (
                              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : <Send size={18} strokeWidth={2} />}
                            {loading ? "SUMMONING..." : "SEND INQUIRY"}
                          </span>
                       </button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-32 space-y-12"
                  >
                    <div className="w-32 h-32 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center mx-auto mb-8 shadow-inner">
                       <Send size={48} className="text-sage" strokeWidth={1} />
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                       <h3 className="font-display text-4xl md:text-7xl text-heading font-light tracking-tighter">
                          Archive <br/>
                          <span className="font-artistic italic text-sage lowercase opacity-80">Synchronized.</span>
                       </h3>
                       <p className="font-body text-base md:text-lg text-foreground/40 max-w-sm mx-auto leading-relaxed">
                          The message has reached the archive. I shall be in touch shortly.
                       </p>
                    </div>

                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-sage/40 to-transparent mx-auto pt-8 md:pt-12" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ContactModal.displayName = "ContactModal";
