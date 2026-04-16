import { useLayoutEffect, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href?: string;
  ariaLabel?: string;
  onClick?: () => void;
  active?: boolean;
}

interface NavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: NavLink[];
}

interface CardNavProps {
  logo?: React.ReactNode;
  logoAlt?: string;
  items: NavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  onLinkClick?: (href: string) => void;
  ctaAction?: () => void;
  ctaText?: string;
  onToggle?: (isOpen: boolean) => void;
}

const CardNav = ({
  logo,
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#fff',
  menuColor,
  buttonBgColor,
  buttonTextColor,
  onLinkClick,
  ctaAction,
  ctaText = 'Get Started',
  onToggle
}: CardNavProps) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const heightCacheRef = useRef<number | null>(null);

  // Sync isExpanded with parent
  useEffect(() => {
    onToggle?.(isExpanded);
  }, [isExpanded, onToggle]);

  const calculateHeight = () => {
    if (heightCacheRef.current !== null) return heightCacheRef.current;
    
    const navEl = navRef.current;
    if (!navEl) return 380;

    const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
    if (contentEl) {
      const wasVisible = contentEl.style.visibility;
      const wasPosition = contentEl.style.position;
      const wasHeight = contentEl.style.height;
      const wasDisplay = contentEl.style.display;
      const wasBottom = contentEl.style.bottom;

      contentEl.style.visibility = 'hidden';
      contentEl.style.position = 'absolute';
      contentEl.style.display = 'flex';
      contentEl.style.height = 'auto';
      contentEl.style.bottom = 'auto'; // Important: remove constraint to measure true scroll height

      // Trigger reflow
      void contentEl.offsetHeight;

      const topBar = 60;
      const padding = 24; // Compact padding
      const contentHeight = contentEl.scrollHeight; // Use scrollHeight for full content

      contentEl.style.visibility = wasVisible;
      contentEl.style.position = wasPosition;
      contentEl.style.height = wasHeight;
      contentEl.style.display = wasDisplay;
      contentEl.style.bottom = wasBottom;

      const h = Math.max(topBar + contentHeight + padding, 320);
      heightCacheRef.current = h;
      return h;
    }
    return 380;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
    if (!contentEl) return null;

    // Reset items to initial state for the timeline
    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(contentEl, { opacity: 0, pointerEvents: 'none' });
    gsap.set(cardsRef.current, { y: 20, opacity: 0 });

    const tl = gsap.timeline({ 
      paused: true,
      onReverseComplete: () => {
        setIsHamburgerOpen(false);
      }
    });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.5,
      ease: 'expo.inOut' // Smoother premium ease
    });

    tl.to(contentEl, {
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.4');

    tl.to(cardsRef.current, { 
      y: 0, 
      opacity: 1, 
      duration: 0.4, 
      ease: 'power3.out', 
      stagger: 0.05 
    }, '-=0.3');

    return tl;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const wasExpanded = isExpanded;
      const tl = createTimeline();
      tlRef.current = tl;

      if (wasExpanded && tl) {
        tl.progress(1);
      }
    }, navRef);
    
    return () => ctx.revert();
  }, [items, ease]);

  useEffect(() => {
    heightCacheRef.current = null; // Clear cache when items change
  }, [items]);

  useEffect(() => {
    if (!isExpanded) return;

    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    
    // On Desktop: Close menu on substantial scroll
    if (!isMobile) {
      const startScroll = window.scrollY;
      const handleScroll = () => {
        if (Math.abs(window.scrollY - startScroll) > 50) {
          toggleMenu();
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } 
    
    // On Mobile/Tablet: Lock body scroll while menu is open
    else {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        heightCacheRef.current = null; // Flush cache on resize
        if (!tlRef.current) return;
        const wasExpanded = isExpanded;
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          if (wasExpanded) {
            gsap.set(navRef.current, { height: calculateHeight() });
            newTl.progress(1);
          }
          tlRef.current = newTl;
        }
      }, 250); 
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play();
    } else {
      setIsExpanded(false);
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`card-nav-container fixed left-1/2 -translate-x-1/2 w-[90%] max-w-[900px] z-[200] top-[1.2rem] md:top-[1.5rem]`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? 'open' : ''} block h-[60px] p-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden will-change-[height] border border-white/20 backdrop-blur-md ${className}`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          <motion.div
            className="hamburger-menu relative group flex items-center justify-center cursor-pointer order-2 md:order-none w-11 h-11 z-[3]"
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            whileHover="hover"
          >
            {/* Hover Background Layer - Solid Framer Motion logic */}
            <motion.div 
              className="absolute inset-0 rounded-xl bg-[#1c1c19]"
              initial={{ opacity: 0 }}
              variants={{
                hover: { opacity: 1 }
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Icon Layer - Click animation (rotation & morph) */}
            <motion.div 
              className="relative z-10 flex items-center justify-center w-full h-full text-heading group-hover:text-white transition-colors duration-300"
              animate={{ rotate: isHamburgerOpen ? 90 : 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {isHamburgerOpen ? (
                  <motion.div
                    key="close-icon"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <X size={20} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu-icon"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Menu size={20} strokeWidth={2.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none scale-90 md:scale-100">
             {logo}
          </div>

          <button
            type="button"
            onClick={ctaAction}
            className="card-nav-cta-button hidden md:inline-flex border-0 rounded-xl px-6 items-center h-[44px] font-bold text-xs uppercase tracking-[0.2em] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/5"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            {ctaText}
          </button>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-3 flex flex-col items-stretch gap-3 justify-start z-[1] md:flex-row md:items-stretch md:gap-[12px] opacity-0 pointer-events-none`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 p-6 rounded-xl min-w-0 flex-[1_1_auto] h-auto min-h-[80px] md:min-h-0 md:flex-[1_1_0%] transition-transform duration-300 hover:scale-[0.99]"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label font-serif font-bold tracking-tight text-[20px] md:text-[24px]">
                {item.label}
              </div>
              <div className="nav-card-links flex flex-col gap-1.5 mt-2">
                {item.links?.map((lnk, i) => (
                  <div
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-all duration-300 hover:translate-x-1 group/link text-[14px] md:text-[15px] opacity-80 hover:opacity-100 font-medium"
                    onClick={() => {
                       if (lnk.onClick) lnk.onClick();
                       if (lnk.href && onLinkClick) onLinkClick(lnk.href);
                       toggleMenu();
                    }}
                    role="link"
                  >
                    <ArrowUpRight size={14} className="nav-card-link-icon shrink-0 transition-transform duration-300 group-hover/link:rotate-45" aria-hidden="true" />
                    {lnk.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
