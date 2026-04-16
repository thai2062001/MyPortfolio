import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/lib/animations';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Editorial.css';

const blogPosts = [
  {
    title: "Why Good Design is Business",
    excerpt: "Good design goes beyond looks—it builds trust, strengthens branding, and drives growth. Discover how design can turn into a powerful business strategy.",
    category: "Strategy",
    image: "https://framerusercontent.com/images/fDham0xmnMte0ldfxVqHyjIpe4Q.jpg",
    slug: "why-good-design-is-good-business"
  },
  {
    title: "The Rise of No-Code",
    excerpt: "No-code platforms are transforming how businesses build. Learn how no-code saves time, reduces costs, and fuels innovation.",
    category: "Technology",
    image: "https://framerusercontent.com/images/Mv6LCBu2u0NNJ6etgLJlJonbc.jpg",
    slug: "the-rise-of-no-code"
  },
  {
    title: "Content That Converts",
    excerpt: "Web copy isn’t filler—it’s strategy. Learn how the right words build trust, guide visitors, and boost conversions.",
    category: "Marketing",
    image: "https://framerusercontent.com/images/yytfO61OKnXXU50RYDAQeuwVGxc.jpg",
    slug: "content-that-converts"
  },
  {
    title: "Building Trust with Social Proof",
    excerpt: "Social proof is the shortcut to credibility. Discover how testimonials, reviews, and case studies boost trust and sales.",
    category: "Psychology",
    image: "https://framerusercontent.com/images/6zzldyoWPmdGGaVoCWQRX6Qdbyw.jpg",
    slug: "building-trust-with-social-proof"
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
            style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto', position: 'relative', zIndex: 2 }}
          >
            <motion.h1 
              variants={fadeIn('up', 0.2)} 
              className="editorial-h1"
              style={{ fontSize: 'clamp(40px, 8vw, 70px)' }}
            >
              Explore Our Signature Projects
            </motion.h1>
            <motion.p 
              variants={fadeIn('up', 0.4)} 
              className="editorial-body" 
              style={{ marginTop: '32px', maxWidth: '640px', margin: '32px auto 0' }}
            >
              Our works are a blend of innovative thinking and practical solutions, ensuring they are both unique and effective.
            </motion.p>
          </motion.div>
        </div>

        {/* Floating Shapes */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="hero-shapes" 
          style={{ position: 'absolute', right: '-10%', top: '20%', zIndex: 0, pointerEvents: 'none' }}
        >
           <div style={{ width: '500px', height: '640px', borderRadius: '1000px', backgroundColor: 'var(--bg-color)', filter: 'blur(80px)' }}></div>
        </motion.div>
      </section>

      {/* 2. BLOG GRID */}
      <section className="editorial-section" style={{ padding: '0 20px 160px' }}>
        <div className="editorial-container">
          <motion.div 
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="blog-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '44px',
              maxWidth: '1320px',
              margin: '0 auto'
            }}
          >
            {blogPosts.map((post, idx) => (
              <Link 
                key={idx} 
                to={`/project/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <motion.div 
                  variants={fadeIn('up')}
                  whileHover={{ y: -10 }}
                  className="editorial-card post-card"
                  style={{ overflow: 'hidden', padding: '0', height: '100%' }}
                >
                  <div style={{ 
                    height: '320px', 
                    backgroundImage: `url(${post.image})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                  }}></div>
                  <div style={{ padding: '40px' }}>
                    <div className="badge editorial-body-small" style={{ marginBottom: '20px', opacity: 0.6 }}>{post.category}</div>
                    <h3 className="editorial-h3" style={{ fontSize: '28px' }}>{post.title}</h3>
                    <p className="editorial-body" style={{ marginTop: '20px', fontSize: '16px', color: 'rgba(0,0,0,0.7)', lineClamp: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ marginTop: '32px' }}>
                      <span 
                        className="editorial-button editorial-button-secondary"
                        style={{ padding: '12px 0', border: 'none', background: 'none' }}
                      >
                        View Project Details <ArrowUpRight size={18} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Blog;
