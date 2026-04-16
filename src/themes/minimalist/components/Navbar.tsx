import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/core/hooks/usePortfolio";
import { NORDIC_TRANSITION } from "../constants/animations";
import { MinimalButton } from "./shared/MinimalButton";

export const Navbar = () => {
  const { data: settings } = useSiteSettings();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/portfolio" },
    { name: "Skills", path: "/skills" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6 md:px-10">
      <div className="max-w-[1320px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-h1 text-[24px] md:text-[28px] hover:opacity-70 transition-opacity"
        >
          {settings?.site_name || "Portfolio"}
          <span className="text-primary">.</span>
        </Link>

        {/* Desktop Menu */}
        <div 
          className={`hidden md:flex items-center gap-1 p-1 rounded-full transition-all duration-700 ${
            isScrolled 
              ? "bg-white/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(140,166,147,0.15)] border border-white/50" 
              : "bg-surface-sand/30 backdrop-blur-md border border-white/20"
          }`}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[12px] font-bold uppercase tracking-[0.15em] px-8 py-3 rounded-full transition-all duration-500 relative ${
                  isActive ? "text-white" : "text-main/50 hover:text-main"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_4px_12px_rgba(138,164,147,0.4)]"
                    transition={NORDIC_TRANSITION}
                  />
                )}
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Contact Button (Desktop) */}
        <Link to="/contact">
           <MinimalButton variant="primary" size="sm" showIcon={false}>
             Contact me
           </MinimalButton>
        </Link>

        {/* Mobile Menu Button (Placeholder for now) */}
        <button className="md:hidden w-10 h-10 flex flex-col items-end justify-center gap-1.5">
          <div className="w-8 h-0.5 bg-main rounded-full"></div>
          <div className="w-5 h-0.5 bg-main rounded-full"></div>
        </button>
      </div>
    </nav>
  );
};
