import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ArrowRight, Share2, Calendar, Tag } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Editorial.css';

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Mock project data - normally this would come from a CMS/API
  const project = {
    title: slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || "Modern Loft Renovation",
    description: "We transformed this outdated loft into an open-concept living space featuring exposed textures, natural light, and warm industrial finishes.",
    category: "Strategy & Design",
    date: "January 24, 2026",
    heroImage: "https://framerusercontent.com/images/fDham0xmnMte0ldfxVqHyjIpe4Q.jpg",
    gallery: [
      "https://framerusercontent.com/images/Mv6LCBu2u0NNJ6etgLJlJonbc.jpg",
      "https://framerusercontent.com/images/yytfO61OKnXXU50RYDAQeuwVGxc.jpg"
    ],
    content: {
      introduction: "Modern Loft Renovation is a transformation of an outdated industrial space into a warm, open-concept home. The design goal was to retain the authentic character of the original loft — exposed brick, tall ceilings, and natural light — while bringing in the softness, function, and comfort of contemporary living.",
      mainBody: "The design opens up the floor plan to enhance flow and light throughout the space. Key elements include reclaimed wood flooring, steel-framed interior windows, and custom cabinetry to maximize function without compromising on aesthetics. A neutral color palette allows the architectural textures — brick, concrete, and wood — to take center stage. Soft lighting, natural textiles, and built-in furniture introduce comfort and subtle luxury throughout the space. To meet the client’s lifestyle needs, a flexible live-work area was introduced, along with a reimagined kitchen featuring an oversized island for hosting and daily meals."
    }
  };

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

      <main className="editorial-section" style={{ padding: '160px 20px 100px' }}>
        <div className="editorial-container">
          {/* Back Link */}
          <Link to="/portfolio" className="editorial-body-small" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'rgba(0,0,0,0.5)', marginBottom: '48px' }}>
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 300px', gap: '80px', alignItems: 'start' }}>
            {/* Main Content */}
            <div className="project-detail-main">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="editorial-h1" style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>{project.title}</h1>
                <p className="editorial-body" style={{ marginTop: '24px', opacity: 0.8, maxWidth: '640px', fontSize: '20px', lineHeight: '1.6' }}>
                  {project.description}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ marginTop: '64px', borderRadius: '32px', overflow: 'hidden', backgroundColor: 'var(--bg-color)', padding: '12px' }}
              >
                <img src={project.heroImage} alt={project.title} style={{ width: '100%', height: 'auto', borderRadius: '24px', display: 'block' }} />
              </motion.div>

              <div className="project-rich-content" style={{ marginTop: '80px' }}>
                 <div id="introduction" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '44px', marginBottom: '64px' }}>
                    <span className="editorial-badge-inline" style={{ backgroundColor: 'var(--bg-color)', padding: '8px 16px', borderRadius: '100px', width: 'fit-content', height: 'fit-content', fontWeight: 600, fontSize: '13px' }}>Introduction</span>
                    <p className="editorial-body" style={{ fontSize: '18px', lineHeight: '1.8' }}>{project.content.introduction}</p>
                 </div>

                 <div style={{ padding: '40px 0', borderTop: '1px solid var(--black-10)', borderBottom: '1px solid var(--black-10)', marginBottom: '64px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                       {project.gallery.map((img, i) => (
                         <img key={i} src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '16px' }} />
                       ))}
                    </div>
                 </div>

                 <div id="content" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '44px', marginBottom: '80px' }}>
                    <span className="editorial-badge-inline" style={{ backgroundColor: 'var(--bg-color)', padding: '8px 16px', borderRadius: '100px', width: 'fit-content', height: 'fit-content', fontWeight: 600, fontSize: '13px' }}>Content</span>
                    <p className="editorial-body" style={{ fontSize: '18px', lineHeight: '1.8' }}>{project.content.mainBody}</p>
                 </div>

                 {/* Let's work together section */}
                 <div id="cta" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '44px', padding: '64px 0', borderTop: '1px solid var(--black-10)' }}>
                    <span className="editorial-badge-inline" style={{ backgroundColor: 'var(--bg-color)', padding: '8px 16px', borderRadius: '100px', width: 'fit-content', height: 'fit-content', fontWeight: 600, fontSize: '13px' }}>Let's Work Together</span>
                    <div>
                       <h3 className="editorial-h3" style={{ fontSize: '28px' }}>Love what you see? Let’s create something exceptional together.</h3>
                       <p className="editorial-body" style={{ marginTop: '16px', opacity: 0.7 }}>
                          Whether you’re renovating a single room or planning a full transformation, our team is ready to bring your vision to life.
                       </p>
                       <div className="cta-group" style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                          <Link to="/contact" className="editorial-button editorial-button-primary">Get Started <ArrowUpRight size={18} /></Link>
                          <Link to="/portfolio" className="editorial-button editorial-button-secondary">See All Posts <ArrowRight size={18} /></Link>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Sidebar / Info */}
            <aside className="project-sidebar" style={{ position: 'sticky', top: '120px' }}>
               <div className="editorial-card" style={{ padding: '32px', backgroundColor: 'var(--bg-color)', border: 'none' }}>
                  <h4 className="editorial-h4" style={{ marginBottom: '24px' }}>Project Info</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div>
                        <span className="editorial-body-small" style={{ opacity: 0.5, display: 'block', marginBottom: '4px' }}>Category</span>
                        <span className="editorial-body" style={{ fontWeight: 600 }}>{project.category}</span>
                     </div>
                     <div>
                        <span className="editorial-body-small" style={{ opacity: 0.5, display: 'block', marginBottom: '4px' }}>Date</span>
                        <span className="editorial-body" style={{ fontWeight: 600 }}>{project.date}</span>
                     </div>
                     <div style={{ marginTop: '12px' }}>
                        <button className="editorial-button editorial-button-secondary" style={{ width: '100%', justifyContent: 'center', backgroundColor: 'white' }}>
                          <Share2 size={16} /> Share Project
                        </button>
                     </div>
                  </div>
               </div>

               <div className="editorial-card" style={{ marginTop: '24px', padding: '32px', border: '2px solid var(--bg-color)' }}>
                  <h4 className="editorial-h4" style={{ marginBottom: '16px' }}>Table of contents</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <a href="#introduction" className="editorial-body-small" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>Introduction</a>
                     <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)' }}></div>
                     <a href="#content" className="editorial-body-small" style={{ textDecoration: 'none', color: 'inherit' }}>Content Details</a>
                     <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)' }}></div>
                     <a href="#cta" className="editorial-body-small" style={{ textDecoration: 'none', color: 'inherit' }}>Get Started</a>
                  </div>
               </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
