import { useState, useEffect, memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { usePortfolioData } from "@/core/hooks/usePortfolio";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { useIsTablet } from "@/hooks/use-mobile";
import { ContactModal } from "./ContactModal";
import { getLocalizedFields, SupportedLang } from "@/lib/content-utils";

interface ContactSectionProps {
  customTitle?: string;
  customDescription?: string;
  customEyebrow?: string;
}

const ContactSection = memo(({ customTitle, customDescription, customEyebrow }: ContactSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { lang } = useLang();
  const currentLang = lang as SupportedLang;
  const isTablet = useIsTablet();
  
  const { 
    contactSettings, 
    contactFormSettings,
    contactPurposeOptions 
  } = usePortfolioData();

  const contactContent = contactSettings?.data || {};
  const purposeOptions = contactPurposeOptions?.data || [];
  const formSettings = contactFormSettings?.data || {};
  
  useEffect(() => {
    const handleOpenModal = () => setModalOpen(true);
    window.addEventListener("open-contact-modal", handleOpenModal);
    return () => window.removeEventListener("open-contact-modal", handleOpenModal);
  }, []);

  const fields = useMemo(() => {
    const defaultFields = getLocalizedFields(contactContent, [
      'eyebrow',
      'title_line_1',
      'title_line_2',
      'description',
      'primary_button_label'
    ], currentLang);
    
    return {
      ...defaultFields,
      eyebrow: customEyebrow || defaultFields.eyebrow,
      title_line_1: customTitle || defaultFields.title_line_1,
      title_line_2: customTitle ? "" : defaultFields.title_line_2, // Clear line 2 if custom title provided
      description: customDescription || defaultFields.description
    };
  }, [contactContent, currentLang, customTitle, customDescription, customEyebrow]);

  if (!contactSettings.data) return null;

  return (
    <>
      <section className="py-24 md:py-48 bg-background relative overflow-hidden" id="contact">
        {/* Daylight Atmosphere Decor - Optimized with pointer-events-none */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-vibe-pink/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-vibe-sky/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <motion.div
            variants={staggerContainer(0.2, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-12 md:space-y-20"
          >
            <motion.div variants={fadeIn("up", 0.1)} className="flex flex-col items-center gap-8">
              <div className="w-px h-32 bg-gradient-to-b from-transparent via-sage/30 to-transparent" />
              <span className="font-artistic text-3xl text-vibe-pink block italic">
                {fields.eyebrow}
              </span>
            </motion.div>

            <motion.h2 variants={fadeIn("up", 0.2)} className="font-display text-5xl md:text-7xl lg:text-[8rem] text-heading leading-[0.95] tracking-tighter">
              {fields.title_line_1}
              {fields.title_line_2 && (
                <>
                  <br/>
                  <span className="font-artistic italic text-sage lowercase opacity-80 block mt-6">{fields.title_line_2}</span>
                </>
              )}
            </motion.h2>

            <motion.p variants={fadeIn("up", 0.3)} className="font-body text-lg md:text-2xl text-foreground/50 font-light max-w-3xl mx-auto leading-relaxed italic">
              {fields.description}
            </motion.p>

            <motion.div
              variants={fadeIn("up", 0.4)}
              className="pt-12"
            >
              <button
                onClick={() => setModalOpen(true)}
                className={`relative group px-10 py-6 md:px-16 md:py-8 rounded-full overflow-hidden transition-all duration-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] ${
                  !isTablet ? "hover:scale-105 active:scale-95 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]" : "active:scale-95"
                }`}
              >
                <div className="absolute inset-0 bg-heading transition-all duration-500" />
                <span className="relative z-10 text-white text-[12px] md:text-[14px] tracking-[0.4em] uppercase font-display font-bold">
                   {fields.primary_button_label}
                </span>
                <div className="absolute inset-0 bg-sage translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ContactModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        formSettings={formSettings} 
        purposeOptions={purposeOptions} 
      />
    </>
  );
});

ContactSection.displayName = "ContactSection";
export default ContactSection;
