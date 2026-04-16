import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/lib/animations';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Editorial.css';

const Contact: React.FC = () => {
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

      <section className="editorial-section" style={{ padding: '160px 20px 100px' }}>
        <div className="editorial-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'start' }}>
            
            {/* Left Column: Info & Details */}
            <motion.div 
              variants={staggerContainer(0.1, 0.2)}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeIn('up', 0.2)}>
                <h1 className="editorial-h1" style={{ fontSize: 'clamp(40px, 6vw, 60px)' }}>Get in Touch with Our Experts</h1>
                <p className="editorial-body" style={{ marginTop: '24px', maxWidth: '580px', opacity: 0.8 }}>
                  Whether you need clarity, strategy, or a fresh perspective, our team is ready to assist. Let’s drive results together.
                </p>
              </motion.div>

              <motion.div 
                variants={fadeIn('up', 0.4)} 
                style={{ display: 'flex', gap: '24px', marginTop: '48px' }}
              >
                <div className="editorial-card" style={{ flex: 1, padding: '32px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <Mail size={24} color="var(--primary)" />
                  </div>
                  <h4 className="editorial-h4">Reach Out to Us</h4>
                  <p className="editorial-body-small" style={{ marginTop: '12px', opacity: 0.7 }}>Drop us a message anytime.</p>
                  <p className="editorial-body" style={{ marginTop: '16px', fontWeight: 600 }}>archio@mail.com</p>
                </div>
                <div className="editorial-card" style={{ flex: 1, padding: '32px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <Phone size={24} color="var(--primary)" />
                  </div>
                  <h4 className="editorial-h4">Call Us</h4>
                  <p className="editorial-body-small" style={{ marginTop: '12px', opacity: 0.7 }}>We're here for you.</p>
                  <p className="editorial-body" style={{ marginTop: '16px', fontWeight: 600 }}>+123 456 7890</p>
                </div>
              </motion.div>

              {/* Business Hours & Map Link */}
              <motion.div 
                variants={fadeIn('up', 0.6)}
                className="editorial-card" 
                style={{ marginTop: '32px', padding: '32px', backgroundColor: 'var(--bg-color)', border: 'none' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                  <div>
                    <h4 className="editorial-h4" style={{ marginBottom: '20px' }}>Business Hours</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--black-10)' }}>
                        <span className="editorial-body-small">MON - FRI</span>
                        <span className="editorial-body-small" style={{ fontWeight: 600 }}>9:00am - 7:00pm</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--black-10)' }}>
                        <span className="editorial-body-small">SATURDAY</span>
                        <span className="editorial-body-small" style={{ fontWeight: 600 }}>9:00am - 5:00pm</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="editorial-body-small">SUNDAY</span>
                        <span className="editorial-body-small" style={{ fontWeight: 600 }}>9:00am - 12:30pm</span>
                      </div>
                    </div>
                    <button className="editorial-button editorial-button-secondary" style={{ marginTop: '32px', width: '100%', justifyContent: 'center', backgroundColor: 'var(--white)' }}>
                      <MapPin size={18} /> Maps Location
                    </button>
                  </div>
                  <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <img 
                      src="https://framerusercontent.com/images/NAqgMFdFPXuXhUVH4zjvGxY.png" 
                      alt="Office" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="editorial-card" 
              style={{ padding: '48px', border: 'none', backgroundColor: 'var(--bg-color)' }}
            >
              <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="form-group">
                  <label className="editorial-body-small" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Name*</label>
                  <input type="text" className="editorial-input" placeholder="Your full name" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--black-10)', outline: 'none' }} />
                </div>
                <div className="form-group">
                  <label className="editorial-body-small" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email*</label>
                  <input type="email" className="editorial-input" placeholder="Your email address" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--black-10)', outline: 'none' }} />
                </div>
                <div className="form-group">
                  <label className="editorial-body-small" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Subject</label>
                  <input type="text" className="editorial-input" placeholder="How can we help?" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--black-10)', outline: 'none' }} />
                </div>
                <div className="form-group">
                  <label className="editorial-body-small" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Message*</label>
                  <textarea rows={5} className="editorial-input" placeholder="Tell us more about your inquiry" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--black-10)', outline: 'none', resize: 'none' }}></textarea>
                </div>
                <button type="submit" className="editorial-button editorial-button-primary" style={{ width: '100%', justifyContent: 'center', height: '56px', fontSize: '18px' }}>
                  Send Message <ArrowUpRight size={20} />
                </button>
                
                <div style={{ marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--black-10)', textAlign: 'center' }}>
                   <p className="editorial-body-small" style={{ fontWeight: 600 }}>archio@mail.com</p>
                   <p className="editorial-body-small" style={{ opacity: 0.6 }}>we reply within 24 hrs</p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Contact;
