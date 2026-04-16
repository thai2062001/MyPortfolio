import { motion } from "framer-motion";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { FADE_UP_VARIANTS, NORDIC_TRANSITION } from "../constants/animations";
import { MinimalButton } from "./shared/MinimalButton";

interface MinimalistAboutProps {
  title: string;
  description: string;
  aboutData?: any;
}

export const MinimalistAbout = ({ title, description, aboutData }: MinimalistAboutProps) => {
  // Trích xuất ảnh bìa thực tế từ database
  const images = (aboutData as any)?.about_images || [];
  const coverObj = images.find((img: any) => img.is_cover) || images[0];
  const realImage = coverObj ? optimizeCloudinary(coverObj.image_url) : "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1467&auto=format&fit=crop";

  return (
    <section className="py-48 px-6 md:px-10 bg-white relative overflow-hidden">
      
      {/* Background Decor: Soft Circle */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        
        {/* Visual Column - Refined */}
        <div className="lg:col-span-5 relative order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={NORDIC_TRANSITION}
            className="relative"
          >
            {/* Outline box decor */}
            <div className="absolute -top-6 -left-6 w-full h-full border border-primary/20 rounded-xl -z-10" />
            
            <div className="rounded-xl overflow-hidden aspect-[3/4] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">
               <img 
                 src={realImage} 
                 className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000" 
                 alt="Professional Atmosphere" 
               />
            </div>

            {/* Floating text - Nordic touch */}
            <div className="absolute -bottom-10 -right-10 bg-surface-sand p-8 rounded-lg shadow-lg max-w-[200px] border border-white">
               <p className="text-label text-primary mb-2">Philosophy</p>
               <p className="text-[14px] leading-relaxed text-main/80 italic">
                 Intentionality is the heart of enduring design.
               </p>
            </div>
          </motion.div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <motion.div
            variants={FADE_UP_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-label text-primary mb-8 block font-black">About the craft</span>
            <h2 className="text-display font-display text-main mb-12">
              {title || "Harmonizing strategy with aesthetic soul."}
            </h2>
            
            <div className="max-w-2xl">
               <p className="text-body-large text-main/60 leading-[1.8] italic mb-12">
                 {description || "Modern marketing requires more than just creativity; it demands a structured, technological approach that leverages data and psychology in equal measure."}
               </p>
               
               <div className="mb-14">
                  <MinimalButton variant="outline" size="md">
                    Explore My Philosophy
                  </MinimalButton>
               </div>

               {/* Site Stats / Quick Info in About */}
               <div className="grid grid-cols-2 gap-12 pt-12 border-t border-main/5">
                  <div>
                    <h4 className="text-[32px] font-display text-main">8+ Years</h4>
                    <p className="text-label text-main/40 mt-2">Marketing Expertise</p>
                  </div>
                  <div>
                    <h4 className="text-[32px] font-display text-main">50+ Projects</h4>
                    <p className="text-label text-main/40 mt-2">Brand Acceleration</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
