import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const InlineArticleCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-10 md:my-16 p-6 md:p-10 rounded-3xl md:rounded-[2rem] bg-stone-100 border border-stone-200/60 relative overflow-hidden group transition-colors hover:bg-stone-200/40"
    >
      {/* Decorative Icon */}
      <div className="absolute -top-4 -right-4 md:top-0 md:right-0 p-6 md:p-8 text-sage/10 group-hover:text-sage/20 transition-all duration-500 pointer-events-none group-hover:rotate-12 group-hover:scale-110">
        <Sparkles size={80} className="md:w-[120px] md:h-[120px]" />
      </div>

      <div className="relative z-10 space-y-3 md:space-y-4 max-w-lg">
        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-sage">Partner with me</span>
        <h3 className="font-display text-xl md:text-3xl text-heading italic leading-tight">
          Need support with <span className="text-sage not-italic font-artistic lowercase">marketing strategy?</span>
        </h3>
        <p className="font-body text-xs md:text-sm text-muted-foreground leading-relaxed">
          I help brands build meaningful digital presences that drive real results. Let's talk about how I can help you.
        </p>
        
        <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
          <Button 
            onClick={() => navigate("/portfolio#contact")}
            size="sm"
            className="rounded-full bg-heading text-white hover:bg-sage px-5 md:px-6 h-9 md:h-10 text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95"
          >
            Let's Talk
            <ArrowRight size={14} className="ml-2" />
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => navigate("/portfolio")}
            className="rounded-full text-muted-foreground hover:text-heading h-9 md:h-10 text-[9px] font-bold uppercase tracking-widest px-5 md:px-6 transition-all hover:bg-white active:scale-95"
          >
            See My Work
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(InlineArticleCTA);
