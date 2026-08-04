import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useIsMobile } from "@/hooks/use-mobile";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

interface TestimonialData {
  quote: string;
  name: string;
  title: string;
  company: string;
  avatar_url?: string;
  video_url?: string;
}

interface ProjectVideoTestimonialProps {
  testimonial: TestimonialData | null;
  t: (key: string, defaultValue: string) => string;
}

// Helper to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Helper to extract Vimeo video ID
const getVimeoVideoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
};

const VideoPlayer = ({ url, poster }: { url: string; poster?: string }) => {
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return (
      <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube testimonial video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  const vimeoId = getVimeoVideoId(url);
  if (vimeoId) {
    return (
      <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title="Vimeo testimonial video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <video
      src={optimizeCloudinary(url, { quality: "best" })}
      controls
      className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
      poster={optimizeCloudinary(poster, { quality: "best" })}
    >
      Your browser does not support the video tag.
    </video>
  );
};



export const ProjectVideoTestimonial = ({ testimonial, t }: ProjectVideoTestimonialProps) => {
  const isMobile = useIsMobile();
  if (!testimonial) return null;

  if (isMobile) {
    return (
      <section className="py-16 relative overflow-hidden bg-white/40">
        <div className="container mx-auto px-6 max-w-3xl relative z-10 text-center space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <span className="font-artistic text-3xl text-vibe-pink/40">Words of Trust</span>
              <div className="w-px h-8 bg-gradient-to-b from-vibe-pink/40 to-transparent" />
            </div>

            <blockquote className="font-display text-3xl text-heading tracking-tight leading-tight italic selection:bg-vibe-pink/20">
              "{testimonial.quote}"
            </blockquote>

            <div className="flex flex-col items-center gap-2">
              <p className="font-display text-xl text-heading">
                {testimonial.name}
              </p>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase font-black text-heading/30">
                {testimonial.title} / {testimonial.company}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden bg-white/40">
      {/* Soft Atmosphere Accents */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vibe-pink/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
           className="text-center space-y-12"
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
               <span className="font-artistic text-4xl text-vibe-pink/40">Words of Trust</span>
               <div className="w-px h-8 bg-gradient-to-b from-vibe-pink/40 to-transparent" />
            </div>
            
            <blockquote className="font-display text-4xl md:text-5xl text-heading tracking-tight leading-tight italic selection:bg-vibe-pink/20">
              "{testimonial.quote}"
            </blockquote>
            
            <div className="flex flex-col items-center gap-2">
              <p className="font-display text-2xl text-heading">
                {testimonial.name}
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-6 h-px bg-heading/10" />
                 <p className="font-sans text-[10px] tracking-[0.3em] uppercase font-black text-heading/30">
                   {testimonial.title} / {testimonial.company}
                 </p>
                 <div className="w-6 h-px bg-heading/10" />
              </div>
            </div>
          </div>

          {testimonial.video_url && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2, duration: 1.2 }}
               className="relative ethereal-glass p-4 rounded-[3rem] border-white shadow-2xl overflow-hidden"
            >
              <VideoPlayer
                url={testimonial.video_url}
                poster={testimonial.avatar_url}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
