import { motion } from "framer-motion";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { FADE_UP_VARIANTS, NORDIC_TRANSITION } from "../constants/animations";
import { MinimalButton } from "./shared/MinimalButton";

interface MinimalistHeroProps {
  tagline: string;
  title: string;
  subtitle: string;
  heroImage?: string;
}

export const MinimalistHero = ({ tagline, title, subtitle, heroImage }: MinimalistHeroProps) => {
  // Thay thế fallback bằng ảnh Unsplash cao cấp cho Marketing Executive
  const defaultHeroImage = "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="min-h-screen flex items-center pt-32 pb-20 px-6 md:px-10 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50vw] h-full bg-surface-sand/30 -z-10 rounded-l-[120px]" />
      
      <div className="max-w-[1320px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Content */}
        <div className="lg:col-span-7 relative z-10">
          <motion.div
            variants={FADE_UP_VARIANTS}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-10"
          >
            <span className="text-label inline-block px-4 py-2 bg-primary/10 text-primary rounded-full mb-8">
              {tagline}
            </span>
            <h1 className="text-display leading-[0.9] lg:text-[100px]">
              {title || "Architect of Digital Growth."}
            </h1>
          </motion.div>
          
          <motion.div
            variants={FADE_UP_VARIANTS}
            initial="hidden"
            animate="visible"
            custom={1}
            className="max-w-xl pl-12 border-l-2 border-primary/20"
          >
            <p className="text-body-large italic text-main/60">
              {subtitle || "Blending strategic marketing with technical precision to build enduring brands."}
            </p>
          </motion.div>

          <motion.div
            variants={FADE_UP_VARIANTS}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-12 flex gap-6"
          >
            <MinimalButton variant="primary" size="lg">
              Explore Projects
            </MinimalButton>
            <MinimalButton variant="outline" size="lg">
              Contact Me
            </MinimalButton>
          </motion.div>
        </div>

        {/* Visual - Floating Image with Nordic Shadow */}
        <div className="lg:col-span-5 relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ ...NORDIC_TRANSITION, delay: 0.5 }}
            className="relative w-full aspect-[4/5] max-w-[450px]"
          >
            {/* Organic Shape behind image */}
            <div className="absolute -inset-10 bg-primary/5 rounded-full blur-3xl opacity-50" />
            
            <div className="relative h-full w-full rounded-xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(140,166,147,0.3)]">
              <img 
                src={heroImage ? optimizeCloudinary(heroImage) : defaultHeroImage} 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                alt="Portrait"
                onError={(e) => {
                   // Fallback cuối cùng nếu Cloudinary lỗi
                   (e.target as HTMLImageElement).src = defaultHeroImage;
                }}
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl border border-main/5 max-w-[180px]">
               <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Based in</p>
               <p className="text-[16px] font-medium text-main">Ho Chi Minh, VN</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
