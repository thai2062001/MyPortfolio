import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { FADE_UP_VARIANTS, NORDIC_TRANSITION } from "../constants/animations";

interface Faq {
  id: string;
  question_en: string;
  question_vi?: string;
  answer_en: string;
  answer_vi?: string;
  category?: string;
}

interface MinimalistFaqProps {
  title: string;
  faqs: Faq[];
  lang?: string;
}

export const MinimalistFaq = ({ title, faqs, lang = 'en' }: MinimalistFaqProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-48 px-6 md:px-12 bg-white relative overflow-hidden" id="faq">
      
      {/* Absolute Decorative Element */}
      <div className="absolute top-1/2 left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-start">
          
          {/* Left Side: Header */}
          <div className="lg:col-span-5">
            <motion.div
              variants={FADE_UP_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="text-label text-primary mb-8 block font-black">Architecture FAQ</span>
              <h2 className="text-display font-display text-main mb-12">
                {title || "Strategic Nuances."}
              </h2>
              <p className="text-body-large text-main/60 italic leading-relaxed">
                Clarifying the methodologies and frameworks that drive high-growth brand acceleration.
              </p>
              
              <div className="mt-16 pt-16 border-t border-main/5 hidden lg:block">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-surface-sand flex items-center justify-center text-primary">
                       <HelpCircle size={32} />
                    </div>
                    <p className="text-label text-main font-bold">More Questions? <br /> <span className="text-primary italic">Get in touch directly.</span></p>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Accordion */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {faqs?.map((faq, idx) => {
                const isActive = activeIndex === idx;
                const question = lang === 'vi' ? (faq.question_vi || faq.question_en) : faq.question_en;
                const answer = lang === 'vi' ? (faq.answer_vi || faq.answer_en) : faq.answer_en;

                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...NORDIC_TRANSITION, delay: idx * 0.1 }}
                    className={`rounded-[32px] overflow-hidden transition-all duration-700 border ${
                      isActive ? 'bg-surface-sand/40 border-primary/20 shadow-xl' : 'bg-white border-main/5 hover:border-primary/10'
                    }`}
                  >
                    <button
                      onClick={() => setActiveIndex(isActive ? null : idx)}
                      className="w-full text-left p-10 lg:p-12 flex items-center gap-8 group"
                    >
                      {/* Large Index - Sync with Skills */}
                      <span className={`text-[32px] font-display transition-colors duration-500 ${
                        isActive ? 'text-primary' : 'text-main/10 group-hover:text-primary/40'
                      }`}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      
                      <h3 className={`text-[20px] md:text-[24px] font-display flex-grow transition-colors duration-500 ${
                        isActive ? 'text-main' : 'text-main/80 group-hover:text-primary'
                      }`}>
                        {question}
                      </h3>

                      <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${
                        isActive ? 'bg-primary text-white border-primary rotate-180' : 'bg-white text-main/20 border-main/5 group-hover:border-primary/20 group-hover:text-primary'
                      }`}>
                        {isActive ? <Minus size={18} /> : <Plus size={18} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="px-10 lg:px-12 pb-12 lg:pb-16 pl-[96px] lg:pl-[120px]">
                            <p className="text-[17px] md:text-[18px] text-main/60 leading-[1.8] italic">
                              {answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
