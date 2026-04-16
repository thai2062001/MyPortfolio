import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`editorial-nav-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <div className="editorial-nav-container">
        {/* Logo */}
        <Link to="/" className="editorial-logo">
          Archio
        </Link>

        {/* Desktop Navigation */}
        <div className="editorial-nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`editorial-nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/blog" className="editorial-footer-link">Blog</Link>
          <Link to="/contact" className="editorial-button editorial-button-primary nav-cta">
            Get Started <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="editorial-mobile-menu"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/contact" 
              className="editorial-button editorial-button-primary"
              onClick={() => setMobileMenuOpen(false)}
              style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
            >
              Get Started <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .editorial-nav-wrapper {
          position: fixed;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          width: 90%;
          max-width: 1200px;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .editorial-nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 100px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
        }

        .editorial-nav-wrapper.scrolled {
          top: 16px;
        }

        .editorial-nav-wrapper.scrolled .editorial-nav-container {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .editorial-logo {
          font-family: 'Crimson Pro', serif;
          font-size: 24px;
          font-weight: 700;
          text-decoration: none;
          color: var(--primary);
        }

        .editorial-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .editorial-nav-link {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          color: rgba(0, 0, 0, 0.6);
          transition: color 0.3s ease;
        }

        .editorial-nav-link:hover, .editorial-nav-link.active {
          color: var(--primary);
        }

        .nav-cta {
          padding: 10px 24px !important;
          font-size: 14px !important;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--black);
        }

        .editorial-mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 12px;
          padding: 24px;
          background: white;
          border-radius: 24px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .editorial-nav-links {
            display: none;
          }
          .mobile-menu-toggle {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
};

export default Header;
