interface TimelineTextBlockProps {
  period: string;
  location: string;
  title: string;
  company?: string;
  description: string;
  tag?: string;
  isReversed: boolean; // true = text on right, false = text on left
}

/**
 * Editorial text block for timeline milestone
 * Refined typography and spacing for editorial feel
 */
const TimelineTextBlock = ({
  period,
  location,
  title,
  company,
  description,
  tag,
  isReversed,
}: TimelineTextBlockProps) => {
  const textAlign = isReversed ? "text-left" : "text-left";
  const flexOrder = isReversed ? "order-last" : "order-first";

  return (
    <div className={`flex flex-col ${isReversed ? 'items-start md:items-end md:text-right' : 'items-start'} space-y-6 md:space-y-8`}>
      {/* Period & Tag Cluster */}
      <div className={`flex flex-row flex-wrap items-start md:items-center gap-4 md:gap-6 ${isReversed ? 'flex-row-reverse md:text-right' : ''}`}>
        <span className="font-artistic text-2xl md:text-3xl xl:text-5xl text-vibe-pink drop-shadow-sm leading-none pt-1">
          {period}
        </span>
        {tag && (
          <span className="inline-flex items-center text-[9px] md:text-[10px] xl:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.4em] px-3 md:px-4 py-1.5 bg-sage/5 text-sage border border-sage/20 rounded-full font-bold whitespace-nowrap mt-1 md:mt-0">
            {tag}
          </span>
        )}
      </div>

      {/* Main Title & Metadata */}
      <div className="space-y-3 md:space-y-4">
        <div className={`flex items-center gap-4 ${isReversed ? 'flex-row-reverse' : 'flex-row'} opacity-70 uppercase tracking-[0.3em] font-sans text-[10px] xl:text-[11px] font-black text-heading`}>
           <span className="w-8 md:w-12 h-px bg-heading/30" />
           {location}
        </div>
        <h3 className="font-headline italic font-normal text-3xl md:text-5xl lg:text-4xl xl:text-6xl 2xl:text-7xl text-heading leading-[1.05] tracking-tight">
          {title}
        </h3>
        {company && (
          <p className="font-display text-lg md:text-xl xl:text-3xl text-sage italic leading-none">
            {company}
          </p>
        )}
      </div>

      {/* Narrative Body */}
      <div className={`relative ${isReversed ? 'md:pr-0' : 'md:pl-0'}`}>
        <p className={`font-body text-sm md:text-base xl:text-lg text-foreground/80 leading-relaxed max-w-lg whitespace-pre-wrap ${isReversed ? 'md:text-right ml-auto' : 'text-left'}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default TimelineTextBlock;
