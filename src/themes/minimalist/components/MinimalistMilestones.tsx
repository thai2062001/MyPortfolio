import { motion } from "framer-motion";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { FADE_UP_VARIANTS, NORDIC_TRANSITION } from "../constants/animations";

interface MilestoneImage {
  id: string;
  image_url: string;
  alt_text?: string;
  is_cover?: boolean;
}

interface Milestone {
  id: string;
  period: string;
  title_en: string;
  company_en: string;
  description_en: string;
  images?: MilestoneImage[];
  tag_en?: string;
}

interface MinimalistMilestonesProps {
  title: string;
  milestones: Milestone[];
}

export const MinimalistMilestones = ({ title, milestones }: MinimalistMilestonesProps) => {
  return (
    <section className="py-48 px-6 md:px-12 bg-surface-sand/20 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(140,166,147,0.05)_0%,transparent_50%)] -z-10" />

      <div className="max-w-[1320px] mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-24"
        >
          <span className="text-label text-primary mb-6 block font-black">Professional Journey</span>
          <h2 className="text-display font-display text-main">{title}</h2>
        </motion.div>

        <div className="space-y-12">
          {milestones?.map((item, idx) => {
            const hasImages = item.images && item.images.length > 0;
            const coverImage = item.images?.find(img => img.is_cover) || item.images?.[0];

            return (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={FADE_UP_VARIANTS}
                custom={idx}
                className="group nordic-card flex flex-col lg:flex-row gap-12 p-10 lg:p-14 bg-white"
              >
                {/* Visual Side - Gallery Slider Placeholder (Can be interactive Swiper) */}
                <div className={`lg:w-2/5 shrink-0 relative rounded-3xl overflow-hidden aspect-[4/3] bg-surface-sand ${!hasImages && 'hidden lg:block opacity-20'}`}>
                  {hasImages ? (
                    <div className="w-full h-full relative group/gallery">
                      <img 
                        src={optimizeCloudinary(coverImage?.image_url || "")} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        alt={item.title_en} 
                      />
                      {/* Sub-gallery indicator if multiple images */}
                      {item.images && item.images.length > 1 && (
                        <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                           {item.images.slice(0, 3).map((_, i) => (
                             <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />
                           ))}
                           {item.images.length > 3 && <span className="text-[10px] text-white font-bold">+{item.images.length - 3}</span>}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-main/10 opacity-0 group-hover/gallery:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center italic text-main/20">
                       No visual assets mapped.
                    </div>
                  )}
                </div>

                {/* Content Side */}
                <div className="flex-grow flex flex-col">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                    <div>
                      <span className="text-primary font-bold tracking-widest text-[12px] uppercase block mb-2">
                        {item.period}
                      </span>
                      <h3 className="text-[32px] font-display text-main leading-tight mb-2">
                        {item.title_en}
                      </h3>
                      <p className="text-[18px] text-main/40 font-bold">
                        {item.company_en}
                      </p>
                    </div>
                    {item.tag_en && (
                      <span className="px-6 py-2 rounded-full border border-main/10 text-[10px] uppercase font-black tracking-widest text-main/40">
                        {item.tag_en}
                      </span>
                    )}
                  </div>

                  <p className="text-main/60 leading-relaxed italic mb-auto">
                    {item.description_en}
                  </p>

                  <div className="mt-12 pt-8 border-t border-main/5 flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     <span className="text-label text-primary/60">Verified Experience</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
