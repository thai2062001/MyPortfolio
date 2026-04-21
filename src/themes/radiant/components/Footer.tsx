import { Linkedin, Mail, ArrowUpRight, Github, Instagram, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { useSocialLinks, usePersonalInfo } from "@/core/hooks/usePortfolio";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { Link } from "react-router-dom";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import * as React from "react";
import { memo } from "react";

export const Footer = memo(() => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { data: socialLinks = [], isLoading: loading } = useSocialLinks();
  const { data: personalInfo } = usePersonalInfo();
  
  const [hasVisited, setHasVisited] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState("");
  const footerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasVisited(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const footerLinks = [
    { label: t("Home", "ホーム"), to: "/" },
    { label: t("Portfolio", "ポートフォリオ"), to: "/portfolio" },
    { label: t("About", "私について"), to: "/#about" },
    { label: t("Contact", "お問い合わせ"), to: "/portfolio#contact" },
  ];

  return (
    <footer ref={footerRef} className="relative bg-background pt-32 pb-12 overflow-hidden border-t border-heading/5 min-h-[400px]">
      {!hasVisited ? (
        <div className="container mx-auto px-6 h-40 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-sage/10 border-t-sage rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sage/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-vibe-sky/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16 mb-24 md:mb-32">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-4xl"
              >
                <h2 className="text-6xl md:text-8xl lg:text-9xl font-display text-heading leading-[0.85] tracking-tight mb-10">
                  Let's craft <br />
                  <span className="italic text-sage/60">the next era</span> together.
                </h2>
                <p className="font-body text-xl md:text-2xl text-heading/40 max-w-lg font-light leading-relaxed">
                  {t(
                    "Blending strategic precision with high-end digital craft to curate experiences that last.",
                    "戦略的な精密さとハイエンドなデジタル・クラフトを融合させ、永続的な体験を創造します。"
                  )}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link 
                  to="/portfolio#contact"
                  className={`group relative inline-flex items-center gap-6 bg-heading text-white px-12 py-7 md:px-14 md:py-8 rounded-full font-sans text-[11px] tracking-[0.4em] uppercase font-black overflow-hidden transition-all duration-700 shadow-2xl shadow-heading/10 ${
                    !isTablet ? "hover:scale-105 active:scale-95" : "active:scale-95"
                  }`}
                >
                  <span className="relative z-10">{t("Start a Project", "プロジェクトを開始")}</span>
                  <ArrowUpRight size={20} className="relative z-10 group-hover:rotate-45 transition-transform duration-700" />
                  {!isTablet && (
                    <div className="absolute inset-0 bg-sage scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
                  )}
                </Link>
              </motion.div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-heading/20 via-heading/5 to-transparent mb-20" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
              <div className="space-y-8">
                <Link to="/" className="font-artistic text-4xl text-heading block transition-opacity hover:opacity-70">
                  {personalInfo?.full_name || "Pham Ba thai"}
                </Link>
                <p className="text-sm md:text-base text-heading/40 font-light leading-relaxed max-w-xs">
                  {t(
                    "International Business professional & Digital Strategist based in Vietnam. Specializing in high-end brand curation.",
                    "ベトナムを拠点とする国際ビジネスプロフェッショナル兼デジタル戦略家。ハイエンドなブランドキュレーションを専門としています。"
                  )}
                </p>
              </div>

              <div>
                <h4 className="font-sans text-[10px] tracking-[0.5em] uppercase font-black text-heading/20 mb-10">{t("Navigation", "ナビゲーション")}</h4>
                <ul className="space-y-5">
                  {footerLinks.map((link) => (
                    <li key={link.to}>
                      <Link 
                        to={link.to}
                        className="group flex items-center gap-2 text-heading/50 hover:text-heading transition-all duration-300 font-sans text-[12px] tracking-[0.2em] uppercase font-bold"
                      >
                        <span className="w-0 group-hover:w-4 h-px bg-sage transition-all duration-300 overflow-hidden" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-sans text-[10px] tracking-[0.5em] uppercase font-black text-heading/20 mb-10">{t("Connect", "接続")}</h4>
                <div className="flex flex-wrap gap-5">
                  {!loading && socialLinks.length > 0 ? (
                    socialLinks.map((link: any) => (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={!isTablet ? { y: -8, scale: 1.05 } : undefined}
                        className={`w-14 h-14 rounded-full border border-heading/10 flex items-center justify-center bg-white transition-all duration-500 group shadow-sm relative ${
                          !isTablet ? "hover:bg-sage hover:border-sage hover:shadow-xl hover:shadow-sage/20" : ""
                        }`}
                      >
                        {link.icon_url ? (
                          <img
                            src={optimizeCloudinary(link.icon_url)}
                            alt={link.display_name}
                            className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-500 relative z-10"
                          />
                        ) : (
                          <ArrowUpRight size={20} className="text-heading/40 group-hover:text-white transition-colors relative z-10" />
                        )}
                      </motion.a>
                    ))
                  ) : (
                    [Linkedin, Instagram, Github, Mail].map((Icon, i) => (
                      <motion.a
                        key={i}
                        href="#"
                        whileHover={!isTablet ? { y: -8, scale: 1.05 } : undefined}
                        className={`w-14 h-14 rounded-full border border-heading/10 flex items-center justify-center bg-white transition-all duration-500 group shadow-sm ${
                          !isTablet ? "hover:bg-sage hover:border-sage hover:shadow-xl hover:shadow-sage/20" : ""
                        }`}
                      >
                        <Icon size={20} strokeWidth={1.5} className="text-heading/40 group-hover:text-white transition-all duration-500" />
                      </motion.a>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-sans text-[10px] tracking-[0.5em] uppercase font-black text-heading/20 mb-10">{t("Status", "ステータス")}</h4>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                       <div className="w-2.5 h-2.5 rounded-full bg-sage" />
                       <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-sage animate-ping opacity-40" />
                    </div>
                    <span className="text-sm text-heading/60 font-medium tracking-wide">
                      {t("Available for projects", "プロジェクト対応可能")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-heading font-bold tracking-widest uppercase">Ho Chi Minh, Vietnam</p>
                    <p className="text-[11px] text-heading/40 font-light tracking-widest uppercase italic">GMT +7 • Local Time {currentTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-12 border-t border-heading/5">
              <div className="flex items-center gap-8">
                <div className="w-12 h-12 rounded-full bg-heading/5 border border-heading/10 flex items-center justify-center text-heading font-display text-xl shadow-inner italic">
                  {(personalInfo?.full_name || "P")[0]}
                </div>
                <div className="flex flex-col gap-1">
                   <span className="font-sans text-[10px] tracking-[0.4em] uppercase font-black text-heading/40">
                     © 2026 {personalInfo?.full_name || "Pham Ba thai"}
                   </span>
                   <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-heading/20">All Rights Reserved • Curated Excellence</span>
                </div>
              </div>

              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex flex-col items-center gap-3 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-full border border-heading/10 flex items-center justify-center group-hover:bg-heading group-hover:text-white group-hover:border-heading transition-all duration-700 shadow-xl shadow-heading/5">
                   <ArrowUp size={20} strokeWidth={1.5} />
                </div>
                <span className="font-sans text-[8px] tracking-[0.6em] uppercase font-black text-heading/20 group-hover:text-heading/60 transition-colors">
                   {t("Rise to Sky", "トップへ")}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </footer>
  );
});

Footer.displayName = "Footer";
