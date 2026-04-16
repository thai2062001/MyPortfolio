import React, { memo } from "react";
import { usePersonalInfo, useAboutContent } from "@/core/hooks/usePortfolio";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { User, MessageSquare, ArrowUpRight } from "lucide-react";
import { optimizeCloudinary } from "@/lib/cloudinary";

const BlogAuthorBox: React.FC = () => {
  const { data: personalInfo } = usePersonalInfo();
  const { data: aboutContent = [] } = useAboutContent();
  const navigate = useNavigate();

  const aboutImage = aboutContent[0]?.about_images?.[0]?.image_url;
  const authorName = personalInfo?.full_name || "Radiant Author";
  const authorBio = personalInfo?.bio || "A creative strategist and developer dedicated to crafting premium digital experiences.";
  const authorAvatar = aboutImage || personalInfo?.avatar_url;

  return (
    <motion.div 
      variants={fadeIn("up", 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mt-16 md:mt-24 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-stone-100/50 border border-stone-200/60 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 transition-all duration-300 hover:bg-stone-100"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-stone-200">
          {authorAvatar ? (
            <img 
              src={optimizeCloudinary(authorAvatar, { width: 300, height: 300, crop: 'fill' })} 
              alt={authorName}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              <User size={32} />
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-sage text-white p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg">
          <User size={12} className="md:w-3.5 md:h-3.5" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4">
        <div className="space-y-1">
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-sage block">About the Author</span>
          <h3 className="font-display text-xl md:text-3xl text-heading italic">{authorName}</h3>
        </div>
        
        <p className="font-body text-xs md:text-sm text-muted-foreground/80 leading-relaxed max-w-2xl">
          {authorBio}
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/#about")}
            className="rounded-full px-4 h-9 text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-sage gap-2 transition-all hover:bg-white border border-transparent hover:border-stone-200"
          >
            About Me
            <ArrowUpRight size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/portfolio#contact")}
            className="rounded-full px-4 h-9 text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-sage gap-2 transition-all hover:bg-white border border-transparent hover:border-stone-200"
          >
            <MessageSquare size={14} />
            Contact Me
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(BlogAuthorBox);
