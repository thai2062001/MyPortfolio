import React, { useState, memo, useCallback, useMemo } from "react";
import { useLang } from "@/contexts/LangContext";
import { usePortfolioData } from "@/core/hooks/usePortfolio";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { fadeIn, staggerContainer } from "@/lib/animations";
import SectionHeader from "./shared/SectionHeader";
import { getLocalizedField, getLocalizedFields, SupportedLang } from "@/lib/content-utils";
import { useIsTablet, useIsMobile } from "@/hooks/use-mobile";

const FaqSection = memo(() => {
  const { lang, t } = useLang();
  const currentLang = lang as SupportedLang;
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { faqs: faqsQuery, faqSettings: settingsQuery } = usePortfolioData();
  
  const faqs = faqsQuery.data || [];
  const settings = settingsQuery.data || null;
  const loading = faqsQuery.isLoading || settingsQuery.isLoading;
  const [openId, setOpenId] = useState<string | null>(null);

  const localizationData = useMemo(() => {
    if (!settings) return null;
    return getLocalizedFields(settings, ['title', 'eyebrow', 'description'], currentLang);
  }, [settings, currentLang]);

  const toggleFaq = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  if (loading && faqs.length === 0) {
    return (
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 md:py-48 relative overflow-hidden bg-white">
      {/* Background Decor - Optimized opacity */}
      <div className="hidden md:block absolute top-0 right-0 w-[600px] h-[600px] bg-sage/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <SectionHeader
           align="center"
           eyebrow={
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/10 text-sage text-[10px] font-black uppercase tracking-widest">
               <HelpCircle size={14} />
               <span>{localizationData?.eyebrow || t("Inquiries", "お問い合わせ", "Thắc mắc")}</span>
             </div>
           }
           title={localizationData?.title || t("Got Questions?", "よくあるご質問", "Câu hỏi thường gặp")}
           description={localizationData?.description || t(
             "Find answers to common questions about my services and workflow.",
             "サービスやお仕事に関するよくある質問にお答えします。",
             "Tìm câu trả lời cho những thắc mắc phổ biến về dịch vụ và quy trình làm việc."
           )}
           className="mb-16 md:mb-24"
           titleClassName="font-display text-4xl md:text-6xl font-bold text-heading tracking-tight"
           descriptionClassName="font-body text-base text-muted-foreground/60 max-w-md mx-auto italic font-light"
        />

        <motion.div 
          variants={staggerContainer(0.05, 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-4 md:space-y-6"
        >
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const question = lang === "ja" && faq.question_ja ? faq.question_ja : faq.question_en;
            const answer = lang === "ja" && faq.answer_ja ? faq.answer_ja : faq.answer_en;

            if (isMobile) {
              return (
                <div
                  key={faq.id}
                  className={`group rounded-2xl transition-all duration-300 ${
                    isOpen
                      ? "bg-gray-50 border-sage/20 ring-1 ring-sage/10"
                      : "bg-white border border-gray-100"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left focus:outline-none"
                  >
                    <span className={`text-base font-bold transition-colors duration-200 ${
                      isOpen ? "text-sage" : "text-gray-900"
                    }`}>
                      {question}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      isOpen ? "bg-sage text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                      <div className="h-px w-full bg-gray-200/50 mb-4" />
                      <p className="whitespace-pre-line text-sm leading-relaxed opacity-85">{answer}</p>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <motion.div
                key={faq.id}
                variants={fadeIn("up", 0)}
                className={`group rounded-2xl transition-all duration-500 ${
                  isOpen 
                    ? "bg-gray-50 border-sage/20 ring-1 ring-sage/10" 
                    : "bg-white border border-gray-100 hover:border-sage/30 hover:shadow-lg hover:shadow-sage/5"
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 md:py-6 flex items-center justify-between gap-4 text-left focus:outline-none"
                >
                  <span className={`text-base md:text-lg font-bold transition-colors duration-300 ${
                    isOpen ? "text-sage" : "text-gray-900 group-hover:text-sage"
                  }`}>
                    {question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? "bg-sage text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-sage/10 group-hover:text-sage"
                  }`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed max-w-3xl">
                        <div className="h-px w-full bg-gray-200/50 mb-4" />
                        <p className="whitespace-pre-line text-sm md:text-base leading-relaxed opacity-80">{answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
        
        <motion.div
          variants={fadeIn("up", 0.6)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-400">
            {lang === "ja" ? "他に質問がありますか？" : "Still have questions?"}{" "}
            <a 
              href="/portfolio#contact"
              className="text-sage font-bold hover:underline transition-colors hover:text-sage-dark"
            >
               {lang === "ja" ? "お問い合わせください" : "Contact me here"}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
});

FaqSection.displayName = "FaqSection";
export default FaqSection;
