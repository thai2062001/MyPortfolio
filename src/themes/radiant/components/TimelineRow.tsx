import { memo } from "react";
import { motion } from "framer-motion";
import { TimelinePhaseImage } from "@/types/admin";
import TimelineTextBlock from "@/themes/radiant/components/TimelineTextBlock";
import TimelineImageComposition from "@/themes/radiant/components/TimelineImageComposition";
import { fadeIn } from "@/lib/animations";

interface TimelineRowProps {
  period: string;
  location: string;
  title: string;
  company?: string;
  description: string;
  images?: TimelinePhaseImage[];
  image?: string; // legacy fallback
  tag?: string;
  index: number;
  isLast?: boolean;
}

const TimelineRow = memo(({
  period,
  location,
  title,
  company,
  description,
  images,
  image,
  tag,
  index,
  isLast = false,
}: TimelineRowProps) => {
  const isTextLeft = index % 2 === 0;

  return (
    <motion.div
      variants={fadeIn("up", 0)} // Stagger handled by parent
      className="w-full"
    >
      {/* MOBILE LAYOUT */}
      <div className="md:hidden relative pl-12 pr-4 mb-12">
        <div className="absolute left-4 top-0 bottom-[-96px] w-px bg-gradient-to-b from-sage/10 via-sage/40 to-sage/10 pointer-events-none" />
        
        <div className="absolute left-4 top-[2.2rem] -translate-x-1/2 flex items-center justify-center z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-vibe-pink border-2 border-white shadow-lg" />
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-vibe-pink animate-ping opacity-20" />
        </div>

        <div className="pt-6">
           <TimelineTextBlock
             period={period}
             location={location}
             title={title}
             company={company}
             description={description}
             tag={tag}
             isReversed={false}
           />

           <div className="mt-12">
              <TimelineImageComposition
                images={images || []}
                fallbackImage={image}
                title={title}
                isReversed={false}
              />
           </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:block relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
           <div className="w-16 h-16 rounded-full bg-white/80 border border-sage/40 flex items-center justify-center shadow-sm backdrop-blur-md group-hover:scale-110 transition-all duration-700">
              <div className="w-3 h-3 rounded-full bg-vibe-pink" />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-12 lg:gap-20 xl:gap-32 2xl:gap-52 py-12 lg:py-24 px-6 lg:px-12 xl:px-24">
          <div className={`${isTextLeft ? 'order-first' : 'order-last'} flex flex-col justify-center`}>
            <TimelineTextBlock
              period={period}
              location={location}
              title={title}
              company={company}
              description={description}
              tag={tag}
              isReversed={!isTextLeft}
            />
          </div>

          <div className={`${isTextLeft ? 'order-last' : 'order-first'} flex items-center justify-center`}>
            <TimelineImageComposition
              images={images || []}
              fallbackImage={image}
              title={title}
              isReversed={!isTextLeft}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

TimelineRow.displayName = "TimelineRow";
export default TimelineRow;
