import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { Sparkles, ArrowRight } from "lucide-react";
import AmbientAccent from "./shared/AmbientAccent";

const BlogCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.section 
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="relative mt-20 md:mt-32 overflow-hidden bg-heading py-20 md:py-32 px-6 text-center w-full min-w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
    >
      {/* Background Accents - Optimized for performance */}
      <AmbientAccent position="top-right" color="bg-sage" size={400} opacity={0.1} />
      <AmbientAccent position="bottom-left" color="bg-sage" size={300} opacity={0.05} />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-sage">
          <Sparkles size={12} />
          Collaborate with me
        </div>
        
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-white leading-[1.2] md:leading-[1.1] italic">
          Interested in working <span className="font-artistic text-sage lowercase not-italic">together?</span>
        </h2>
        
        <p className="font-body text-white/50 text-sm md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
          Whether you have a specific project in mind or just want to explore how I can help your brand grow, I'm always open to new creative opportunities.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            onClick={() => navigate("/portfolio#contact")}
            className="w-full sm:w-auto rounded-full bg-sage hover:bg-sage/90 text-white px-8 md:px-10 h-12 md:h-14 text-[10px] md:text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-sage/20 transition-all hover:scale-105 active:scale-95"
          >
            Start a Project
            <ArrowRight size={16} className="ml-2" />
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate("/portfolio")}
            className="w-full sm:w-auto rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-heading px-8 md:px-10 h-12 md:h-14 text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
          >
            View Projects
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default memo(BlogCTA);
