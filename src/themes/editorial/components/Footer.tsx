import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Twitter, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="editorial-footer-section">
      <div className="editorial-container">
        <div className="footer-top">
          <div className="footer-mail-row">
            <a href="mailto:archio@mail.com" className="footer-mail-link">
              archio@mail.com
            </a>
            <div className="footer-line"></div>
          </div>
        </div>

        <div className="footer-main-grid">
          <div className="footer-brand-col">
            <h2 className="editorial-h2">Archio</h2>
            <p className="editorial-body" style={{ marginTop: '24px', opacity: 0.7 }}>
              Achieve sustainable growth through expert insights, tailored solutions, and trusted support.
            </p>
          </div>

          <div className="footer-nav-col">
            <h4 className="editorial-h4">Navigation</h4>
            <div className="footer-links">
              <Link to="/">Home <ArrowRight size={16} /></Link>
              <Link to="/portfolio">Portfolio <ArrowRight size={16} /></Link>
              <Link to="/blog">Blog <ArrowRight size={16} /></Link>
              <Link to="/contact">Get Started <ArrowRight size={16} /></Link>
            </div>
          </div>

          <div className="footer-social-col">
            <h4 className="editorial-h4">Social</h4>
            <div className="footer-social-icons">
               <Twitter size={20} /> <Linkedin size={20} /> <Github size={20} />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="editorial-body-small">© 2026 Archio. All Rights Reserved.</p>
          <div className="footer-legal-links">
            <Link to="/privacy" className="editorial-body-small">Privacy Policy</Link>
          </div>
        </div>
      </div>

      <style>{`
        .editorial-footer-section {
          background-color: var(--bg-color);
          padding: 100px 0 60px;
          position: relative;
          overflow: hidden;
        }

        .footer-mail-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 80px;
        }

        .footer-mail-link {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: var(--black);
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .footer-mail-link:hover {
          opacity: 0.6;
        }

        .footer-line {
          height: 2px;
          background: var(--white);
          flex: 1;
        }

        .footer-main-grid {
          display: grid;
          gridTemplateColumns: 2fr 1fr 1fr;
          gap: 80px;
          padding-bottom: 80px;
          border-bottom: 2px solid var(--white);
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
        }

        .footer-links a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          color: var(--black);
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          transition: transform 0.3s ease;
        }

        .footer-links a:hover {
          transform: translateX(10px);
          color: var(--primary);
        }

        .footer-social-icons {
          display: flex;
          gap: 20px;
          margin-top: 24px;
          color: var(--black);
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 40px;
          opacity: 0.6;
        }

        .footer-legal-links {
          display: flex;
          gap: 24px;
        }

        .footer-legal-links a {
          text-decoration: none;
          color: inherit;
        }

        @media (max-width: 992px) {
          .footer-main-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
