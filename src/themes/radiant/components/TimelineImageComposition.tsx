import { TimelinePhaseImage } from "@/types/admin";
import { optimizeCloudinary } from "@/lib/cloudinary";

interface TimelineImageCompositionProps {
  images: TimelinePhaseImage[];
  fallbackImage?: string;
  title: string;
  isReversed: boolean; // true = images on left, false = images on right
}

interface NormalizedImage extends TimelinePhaseImage {
  alt_text?: string;
  caption?: string;
}

/**
 * Editorial image composition for timeline milestones
 * Adapts layout based on image count and side orientation
 */
const TimelineImageComposition = ({
  images,
  fallbackImage,
  title,
  isReversed,
}: TimelineImageCompositionProps) => {
  // Normalize images: sort by order_index
  const allImages: NormalizedImage[] =
    images && images.length > 0
      ? [...images].sort((a, b) => a.order_index - b.order_index)
      : fallbackImage
        ? [
            {
              id: "fallback",
              phase_id: "",
              image_url: fallbackImage,
              alt_text: title,
              caption: undefined,
              image_orientation: 'landscape',
              is_cover: true,
              order_index: 0,
              created_at: "",
              updated_at: "",
            },
          ]
        : [];

  if (allImages.length === 0) {
    return null;
  }

  const landscapeImages = allImages.filter(img => !img.image_orientation || img.image_orientation === 'landscape');
  const portraitImages = allImages.filter(img => img.image_orientation === 'portrait');

  return (
    <div className="w-full space-y-10">
      {/* Landscape Section - Individual Rows */}
      {landscapeImages.length > 0 && (
        <div className="flex flex-col gap-8 w-full">
          {landscapeImages.map((img) => (
            <div key={img.id} className="overflow-hidden aspect-video w-full rounded-[2rem] md:rounded-[2.5rem] bg-sage/5 border border-sage/10 shadow-sm group">
              <img
                src={optimizeCloudinary(img.image_url)}
                alt={img.alt_text || title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          ))}
        </div>
      )}

      {/* Portrait Section - Paired Clusters or Single Standalone */}
      {portraitImages.length > 0 && (
        <div className="w-full">
          {portraitImages.length === 1 ? (
             // Single Portrait: Vertical aspect to show full subject without crop
             <div className="overflow-hidden aspect-[3/4.5] w-full rounded-[2rem] md:rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 shadow-sm group">
                <img
                  src={optimizeCloudinary(portraitImages[0].image_url)}
                  alt={portraitImages[0].alt_text || title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
             </div>
          ) : (
            // Multiple Portraits: Paired in 2 columns from md upwards, 1 column on mobile
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 auto-rows-fr">
              {portraitImages.map((img) => (
                <div 
                  key={img.id} 
                  className="overflow-hidden aspect-[3/4.2] rounded-[2rem] md:rounded-[2.5rem] xl:rounded-[3.5rem] bg-indigo-500/5 border border-indigo-500/10 shadow-sm group"
                >
                  <img
                    src={optimizeCloudinary(img.image_url)}
                    alt={img.alt_text || title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimelineImageComposition;
