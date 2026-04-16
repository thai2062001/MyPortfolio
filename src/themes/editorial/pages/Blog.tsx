import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Tag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeIn, staggerContainer } from '@/lib/animations';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Editorial.css';

const articles = [
  {
    slug: "design-thinking-in-architecture",
    title: "Design Thinking in Modern Architecture",
    excerpt: "How we apply strategic design principles to create spaces that are both beautiful and functional for the digital age.",
    category: "Insights",
    date: "Mar 12, 2026",
    readTime: "5 min read",
    image: "https://framerusercontent.com/images/fDham0xmnMte0ldfxVqHyjIpe4Q.jpg"
  },
  {
    slug: "sustainable-materials-guide",
    title: "The Ultimate Guide to Sustainable Materials",
    excerpt: "Exploring the latest innovations in eco-friendly building materials and how they affect the longevity of your home.",
    category: "Sustainability",
    date: "Feb 28, 2026",
    readTime: "8 min read",
    image: "https://framerusercontent.com/images/Mv6LCBu2u0NNJ6etgLJlJonbc.jpg"
  },
  {
    slug: "minimalism-at-home",
    title: "Minimalism at Home: Less is More",
    excerpt: "A deep dive into why minimalist design is more than just a trend—it's a lifestyle that promotes peace and focus.",
    category: "Lifestyle",
    date: "Jan 15, 2026",
    readTime: "4 min read",
    image: "https://framerusercontent.com/images/yytfO61OKnXXU50RYDAQeuwVGxc.jpg"
  },
  {
    slug: "future-of-workspace",
    title: "The Future of Workspace Design",
    excerpt: "How the shift to hybrid work is redefining the corporate office and the rise of the specialized home studio.",
    category: "Future",
    date: "Dec 10, 2025",
    readTime: "6 min read",
    image: "https://framerusercontent.com/images/6zzldyoWPmdGGaVoCWQRX6Qdbyw.jpg"
  }
];

const Blog: React.FC = () => {
  return (
    <div className="editorial-theme" style={{ backgroundColor: 'var(--white)', minHeight: '100vh' }}>
      <Header />
      
      {/* 0. ENTRANCE CURTAIN */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed inset-0 z-[10000] bg-white pointer-events-none"
      />

      {/* 1. HERO SECTION */}
      <section className="editorial-section" style={{ padding: '160px 20px 80px' }}>
        <div className="editorial-container">
          <motion.div 
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate="show"
            style={{ maxWidth: '840px' }}
          >
            <motion.span 
              variants={fadeIn('up', 0.1)}
              className="editorial-body-small" 
              style={{ letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.5, fontWeight: 600 }}
            >
              The Journal
            </motion.span>
            <motion.h1 
              variants={fadeIn('up', 0.2)} 
              className="editorial-h1"
              style={{ fontSize: 'clamp(44px, 10vw, 84px)', marginTop: '16px' }}
            >
              Insights & <br/>Editorial Articles
            </motion.h1>
            <motion.p 
              variants={fadeIn('up', 0.4)} 
              className="editorial-body" 
              style={{ marginTop: '32px', maxWidth: '540px' }}
            >
              Explore our latest thoughts on architecture, design strategy, and the future of living spaces.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. ARTICLES FEED */}
      <section className="editorial-section" style={{ padding: '40px 20px 160px' }}>
        <div className="editorial-container" style={{ maxWidth: '1000px' }}>
          <div className="articles-feed" style={{ display: 'flex', flexDirection: 'column' }}>
            {articles.map((article, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                style={{ 
                  borderTop: '1px solid rgba(0,0,0,0.1)', 
                  padding: '48px 0',
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr auto',
                  gap: '40px',
                  alignItems: 'start'
                }}
                className="article-row"
              >
                {/* Meta Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span className="editorial-body-small" style={{ opacity: 0.5, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> {article.date}
                  </span>
                  <span className="editorial-body-small" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={14} /> {article.category}
                  </span>
                </div>

                {/* Content Column */}
                <div>
                   <Link to={`/project/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h2 className="editorial-h3" style={{ fontSize: '28px', transition: 'color 0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                        {article.title}
                      </h2>
                   </Link>
                   <p className="editorial-body" style={{ marginTop: '16px', fontSize: '16px', opacity: 0.7, maxWidth: '600px' }}>
                     {article.excerpt}
                   </p>
                   <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.4 }}>
                      <span className="editorial-body-small" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {article.readTime}</span>
                   </div>
                </div>

                {/* Arrow / Link */}
                <Link to={`/project/${article.slug}`} style={{ color: 'var(--black)', opacity: 0.3 }}>
                   <ArrowRight size={24} />
                </Link>
              </motion.div>
            ))}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}></div>
          </div>

          <div style={{ marginTop: '80px', textAlign: 'center' }}>
             <button className="editorial-button editorial-button-secondary" style={{ padding: '16px 40px' }}>Load More Articles</button>
          </div>
        </div>
      </section>

      <Footer />
      
      <style>{`
        .article-row {
          transition: all 0.3s ease;
        }
        .article-row:hover {
          background-color: rgba(0,0,0,0.02);
          padding-left: 20px;
          padding-right: 20px;
          margin-left: -20px;
          margin-right: -20px;
        }
        @media (max-width: 768px) {
          .article-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Blog;
