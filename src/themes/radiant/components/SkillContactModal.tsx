import { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioData } from "@/core/hooks/usePortfolio";
import { portfolioApi } from "@/core/api/portfolio";

interface SkillContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName?: string;
}

// --- INTERNAL HOOK ---
const useOnClickOutside = (ref: React.RefObject<any>, handler: (event: any) => void) => {
  useEffect(() => {
    const listener = (event: any) => {
      const el = ref?.current;
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// --- CUSTOM SELECT COMPONENT ---
const CustomPurposeSelect = ({ 
  options, 
  value, 
  placeholder, 
  onChange,
  required 
}: { 
  options: any[], 
  value: string, 
  placeholder: string, 
  onChange: (val: string) => void,
  required: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(containerRef, () => setIsOpen(false));

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label_en : placeholder;

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border-b border-gray-300 py-3 text-gray-900 font-body transition-all duration-500 hover:border-primary cursor-pointer !outline-none focus:!outline-none focus:!ring-0"
        style={{ outline: 'none', boxShadow: 'none' }}
      >
        <span className={!selectedOption ? "text-gray-400" : ""}>{displayLabel}</span>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronDown className="text-gray-400" size={18} strokeWidth={1.5} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full mt-2 z-[110] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-2"
          >
            <div className="max-h-[250px] overflow-y-auto thin-scrollbar space-y-1">
              {options.map((option, idx) => (
                <motion.button
                  key={option.id}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                    value === option.value 
                      ? "bg-primary/5 text-primary font-medium" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option.label_en}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <input type="hidden" value={value} required={required} name="purpose" />
    </div>
  );
};

export default function SkillContactModal({
  isOpen,
  onClose,
  skillName = "",
}: SkillContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    purpose: "",
    message: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { contactSettings, contactPurposeOptions } = usePortfolioData();
  const formSettings = contactSettings?.data?.form_settings || {};
  const purposeOptions = contactPurposeOptions?.data || [];

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.name || !formData.email || !formData.message || (formSettings?.is_purpose_required && !formData.purpose)) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const { success, error } = await portfolioApi.submitContactMessage({
        name: formData.name,
        email: formData.email,
        company: formData.company || null,
        purpose: formData.purpose || null,
        subject: `Inquiry about ${skillName}`,
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
      console.error("Error:", error);
      alert("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full h-full md:h-auto md:max-w-lg bg-white rounded-none md:rounded-2xl shadow-2xl p-6 md:p-10 md:border md:border-gray-200 my-auto flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 flex-1 overflow-y-auto thin-scrollbar pb-10">
            <div className="space-y-2 mb-4 md:mb-8 pr-12">
              <h3 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                Let&apos;s Connect
              </h3>
              <p className="font-body text-gray-600 text-xs md:text-sm">
                Discussing <span className="text-primary font-bold">{skillName}</span>. 
                I&apos;ll get back to you within 24 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-gray-300 px-0 py-3 text-gray-900 font-body placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors !outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-gray-300 px-0 py-3 text-gray-900 font-body placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors !outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-widest text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-gray-300 px-0 py-3 text-gray-900 font-body placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors !outline-none"
                  />
                </div>

                {/* Purpose Field */}
                {formSettings?.is_purpose_enabled && (
                  <div className="space-y-2">
                    <label className="font-label text-xs uppercase tracking-widest text-gray-700">
                      Purpose
                    </label>
                    <CustomPurposeSelect 
                      options={purposeOptions}
                      value={formData.purpose}
                      placeholder={formSettings.purpose_placeholder_en || "Select a purpose"}
                      onChange={(val) => setFormData(prev => ({ ...prev, purpose: val }))}
                      required={formSettings.is_purpose_required}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs uppercase tracking-widest text-gray-700">
                  Message
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell me about your project or goals..."
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-gray-300 px-0 py-2 md:py-3 text-sm md:text-base text-gray-900 font-body placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors resize-none !outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 md:py-5 rounded-2xl bg-sage text-white font-body font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 mt-4 border-2 md:border-4 border-sage/30"
            >
              {loading ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </form>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mx-auto">
              <span className="text-3xl text-primary font-bold">✓</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-primary">
              Message Sent!
            </h3>
            <p className="font-body text-gray-600">
              Thank you for reaching out. I&apos;ll be in touch soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
