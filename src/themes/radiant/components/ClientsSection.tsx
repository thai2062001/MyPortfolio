import { motion } from "framer-motion";
import { useMemo, memo, useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { formatUrl } from "@/lib/utils";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { useClients } from "@/core/hooks/usePortfolio";
import { fadeIn, staggerContainer } from "@/lib/animations";

const ClientsSection = memo(() => {
  const { lang, t } = useLang();
  const { data: clients = [], isLoading: loading } = useClients();
  
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Optimized for CSS Marquee - only 2 copies needed for seamless loop
  const desktopMarqueeItems = useMemo(() => {
    if (clients.length === 0) return [];
    return [...clients, ...clients];
  }, [clients]);

  if (loading && clients.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-center gap-12 animate-pulse py-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-48 h-24 bg-black/5 rounded-[2rem] flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (clients.length === 0) return null;

  return (
    <section ref={containerRef} className="py-16 md:py-32 lg:py-56 bg-white relative overflow-hidden" id="clients">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vibe-sky/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-sage/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 mb-10 md:mb-28 relative z-10">
        <motion.div
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-4xl"
        >
          <motion.div variants={fadeIn("up", 0.1, isMobile)} className="flex items-center gap-4 mb-10">
             <div className="w-12 h-px bg-vibe-pink/30" />
             <span className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold text-vibe-pink">
                {t("Partnerships", "パートナーシップ", "Đối tác chiến lược")}
             </span>
          </motion.div>
          
          <motion.h2 variants={fadeIn("up", 0.2, isMobile)} className="font-display text-5xl md:text-7xl lg:text-[7.5rem] xl:text-[8.5rem] text-heading leading-[0.85] tracking-[-0.04em] font-medium">
            {lang === "ja" 
              ? "共鳴する 価値観、 確固たる信頼。"
              : "Trusted by visionaries & creative brands."}
          </motion.h2>

          <motion.p variants={fadeIn("up", 0.3, isMobile)} className="mt-12 font-body text-lg md:text-2xl text-foreground/40 font-light max-w-2xl leading-relaxed italic">
            {lang === "ja"
              ? "世界中の情熱的なチームと共に、新しいスタンダードを創り上げます。"
              : "Collaborating with ambitious teams to redefine digital standards through precision and purpose."}
          </motion.p>
        </motion.div>
      </div>

      <div className="relative pt-8 md:pt-12">
        {/* Cinematic Fade Masks - Stronger on Desktop */}
        {!isMobile && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-48 md:w-[30vw] bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-48 md:w-[30vw] bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />
          </>
        )}

        {isTablet ? (
          /* MOBILE & TABLET SOLUTION: Clean, Non-Laggy Glass Grid */
          <div className="container mx-auto px-6">
            <motion.div 
              variants={staggerContainer(0.05, 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            >
              {clients.map((client: any) => (
                <motion.a
                  key={client.id}
                  href={formatUrl(client.website_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeIn("up", 0, true)}
                  className="ethereal-glass rounded-[2rem] p-8 flex items-center justify-center aspect-[1.5/1] shadow-sm active:scale-95 transition-transform"
                >
                  <img
                    src={optimizeCloudinary(client.logo_url, { width: 200 })}
                    alt={client.name}
                    loading="lazy"
                    className="h-8 md:h-10 w-auto object-contain opacity-60 grayscale hover:grayscale-0 transition-all will-change-transform"
                  />
                </motion.a>
              ))}
            </motion.div>
          </div>
        ) : (
          /* DESKTOP SOLUTION: Ultra-smooth CSS Marquee */
          <div className="flex w-full overflow-hidden select-none marquee-container py-12">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes marquee {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-50%, 0, 0); }
              }
              .marquee-inner {
                display: flex;
                flex-shrink: 0;
                align-items: center;
                gap: 3rem;
                padding: 0 1.5rem;
                animation: marquee 60s linear infinite;
                will-change: transform;
              }
              .marquee-inner:hover {
                animation-play-state: paused;
              }
            `}} />
            <div className="marquee-inner">
              {desktopMarqueeItems.map((client: any, index: number) => (
                <a
                  key={`${client.id}-${index}`}
                  href={formatUrl(client.website_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 group relative"
                >
                  <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[3.5rem] lg:rounded-[4.5rem] p-12 lg:p-16 w-80 lg:w-96 h-52 lg:h-64 flex items-center justify-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] hover:bg-white/80 transition-all duration-700 overflow-hidden group-hover:scale-[1.03] group-hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <img
                      src={optimizeCloudinary(client.logo_url, { width: 300 })}
                      alt={client.name}
                      loading="lazy"
                      className="h-14 lg:h-18 w-auto object-contain transition-all duration-700 opacity-60 group-hover:opacity-100 group-hover:grayscale-0 grayscale will-change-transform"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

ClientsSection.displayName = "ClientsSection";
export default ClientsSection;
