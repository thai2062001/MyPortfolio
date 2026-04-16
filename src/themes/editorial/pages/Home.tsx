import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Minus, Plus, Mail, Linkedin, Twitter, Github, Monitor, Zap, Layers, PlayCircle, Star } from 'lucide-react';
import { fadeIn, staggerContainer, textVariant } from '@/lib/animations';
import { 
  usePersonalInfo, 
  useSkills, 
  useProjects, 
  useTestimonials, 
  useFaqs,
  useHeroSettings
} from '@/core/hooks/usePortfolio';
import UsersRow from '../components/UsersRow';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Editorial.css';
import PremiumLoader from '@/components/ui/PremiumLoader';

const EditorialHome: React.FC = () => {
  const { data: personalInfo, isLoading: isPersonalLoading } = usePersonalInfo();
  const { data: heroSettings, isLoading: isHeroLoading } = useHeroSettings();
  const { data: skills, isLoading: isSkillsLoading } = useSkills();
  const { data: projects, isLoading: isProjectsLoading } = useProjects(true);
  const { data: testimonials, isLoading: isTestimonialsLoading } = useTestimonials();
  const { data: faqs, isLoading: isFaqsLoading } = useFaqs();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const imgY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const imgY2 = useTransform(scrollYProgress, [0, 1], [0, -180]);

  const isLoading = isPersonalLoading || isHeroLoading || isSkillsLoading || isProjectsLoading;

  if (isLoading) {
    return <PremiumLoader text="Initializing Editorial Experience" />;
  }

  // Data mapping for Editorial theme
  const heroData = {
    title: heroSettings?.title_en || "Business growth with expert consultancy",
    description: heroSettings?.subtitle_en || "Achieve sustainable growth through expert insights, tailored solutions, and trusted support.",
    image: heroSettings?.image_url || "https://framerusercontent.com/images/uebopcqP5TWBUShWaEHRDYQPg.png"
  };

  const services = skills?.slice(0, 3).map((s, idx) => ({
    number: `0${idx + 1}`,
    title: s.skill_name,
    description: s.short_description || "Expert architectural and strategic consulting driven by data and professional excellence."
  })) || [];

  const featuredProjects = projects?.slice(0, 3).map(p => ({
    slug: p.slug,
    title: p.title,
    category: p.project_categories?.name || "Strategy",
    image: p.cover_image_url || "https://framerusercontent.com/images/fDham0xmnMte0ldfxVqHyjIpe4Q.jpg",
    excerpt: p.short_description
  })) || [];

  return (
    <div className="editorial-theme" style={{ backgroundColor: 'var(--white)' }}>
      <Header />
      
      {/* 0. ENTRANCE CURTAIN */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed inset-0 z-[10000] bg-white pointer-events-none"
      />

      {/* 1. HERO SECTION */}
      <section id="hero" ref={heroRef} className="editorial-section hero-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="editorial-container">
          <motion.div 
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            animate="show"
            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px', alignItems: 'start', position: 'relative', zIndex: 2 }}
          >
            <div className="hero-left">
              <motion.div variants={fadeIn('up', 0.2)} className="badge editorial-body-small">AWARD-WINNING FIRM</motion.div>
              <motion.h1 variants={textVariant(0.3)} className="editorial-h1" style={{ marginTop: '24px' }}>
                {heroData.title}
              </motion.h1>
              <motion.p variants={fadeIn('up', 0.4)} className="editorial-body" style={{ marginTop: '32px', maxWidth: '580px' }}>
                {heroData.description}
              </motion.p>
              <motion.div variants={fadeIn('up', 0.5)} className="cta-group" style={{ display: 'flex', gap: '16px', marginTop: '48px', flexWrap: 'wrap' }}>
                <button className="editorial-button editorial-button-primary">Get Started <ArrowUpRight size={18} /></button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '24px' }}>
                   <UsersRow />
                   <span className="editorial-body-small" style={{ opacity: 0.6 }}>Loved by 200+ clients</span>
                </div>
              </motion.div>
            </div>

            <div className="hero-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="hero-images" style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <motion.img 
                  src={heroData.image} 
                  alt="Hero 1" 
                  style={{ y: imgY1, width: '100%', height: '399.5px', borderRadius: '16px', objectFit: 'cover', zIndex: 2 }} 
                />
                <motion.img 
                  src="https://framerusercontent.com/images/8vui7kvFF8MerNCeyyXWeVZRKZM.png" 
                  alt="Hero 2" 
                  style={{ y: imgY2, width: '100%', height: '399.5px', borderRadius: '16px', objectFit: 'cover', marginTop: '40px', zIndex: 1, opacity: 0.8 }} 
                />
              </div>
              
              <motion.div variants={fadeIn('up', 0.8)} className="separation-line" style={{ width: '100%', height: '2px', backgroundColor: 'var(--black-10)' }}></motion.div>
              <div style={{ display: 'flex', gap: '40px' }}>
                 <div className="hero-stat">
                    <h2 className="editorial-h2" style={{ fontSize: '32px' }}>15+</h2>
                    <p className="editorial-body-small">Years of Experience</p>
                 </div>
                 <div className="hero-stat">
                    <h2 className="editorial-h2" style={{ fontSize: '32px' }}>250+</h2>
                    <p className="editorial-body-small">Projects Completed</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="editorial-section" style={{ backgroundColor: 'var(--bg-color)', padding: '100px 0' }}>
        <div className="editorial-container">
          <motion.div 
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="section-header" 
            style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 64px' }}
          >
            <h2 className="editorial-h2">Solutions for Your Growth</h2>
            <p className="editorial-body" style={{ marginTop: '24px' }}>
              We provide tailored strategic consulting for modern lifestyle brands and professional firms.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer(0.1, 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="services-grid" 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}
          >
            {services.map((service, idx) => (
              <motion.div 
                key={idx}
                variants={fadeIn('up')}
                whileHover={{ y: -5, borderColor: 'var(--primary)' }}
                className="editorial-card service-card"
              >
                <div style={{ fontSize: '14px', opacity: 0.5, marginBottom: '16px', letterSpacing: '0.1em' }}>{service.number}</div>
                <h3 className="editorial-h3">{service.title}</h3>
                <p className="editorial-body" style={{ marginTop: '12px' }}>{service.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tickers */}
          <div className="ticker-wrapper" style={{ margin: '80px 0' }}>
            <div className="ticker-row ticker-left">
               <div className="ticker-content" style={{ '--speed': '40s' } as React.CSSProperties}>
                  <span>Cloud Solutions • </span><span>Digital Transformation • </span><span>Data Analytics • </span><span>UI/UX Design • </span>
                  <span>Cloud Solutions • </span><span>Digital Transformation • </span><span>Data Analytics • </span><span>UI/UX Design • </span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY US SECTION */}
      <section className="editorial-section why-us-section" style={{ padding: '100px 0' }}>
        <div className="editorial-container">
          <motion.div 
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="section-header" 
            style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 64px' }}
          >
            <h2 className="editorial-h2">Why Even Us ?</h2>
            <p className="editorial-body" style={{ marginTop: '24px' }}>
              We go beyond surface-level advice — our consulting approach is built on data, strategy, and execution.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer(0.1, 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="slideshow-row"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}
          >
            {[
              { title: "Strategic Design", img: "https://framerusercontent.com/images/fDham0xmnMte0ldfxVqHyjIpe4Q.jpg" },
              { title: "Market Analysis", img: "https://framerusercontent.com/images/Mv6LCBu2u0NNJ6etgLJlJonbc.jpg" },
              { title: "Growth Tactics", img: "https://framerusercontent.com/images/yytfO61OKnXXU50RYDAQeuwVGxc.jpg" }
            ].map((slide, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeIn('up')}
                whileHover={{ y: -10 }}
                className="editorial-card slideshow-card"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${slide.img})`, 
                  backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', minHeight: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px'
                }}
              >
                <div className="badge editorial-body-small" style={{ marginBottom: '12px', color: 'white', opacity: 0.9 }}>0{idx + 1} / EXPERTISE</div>
                <h3 className="editorial-h3" style={{ color: 'white' }}>{slide.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. PROCESS SECTION (Sticky Sidebar) */}
      <section className="editorial-section" style={{ backgroundColor: 'var(--bg-color)', padding: '100px 0' }}>
        <div className="editorial-container">
          <div className="process-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px', alignItems: 'start' }}>
            <motion.div 
              style={{ position: 'sticky', top: '100px' }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="sticky-sidebar"
            >
              <h2 className="editorial-h2" style={{ textAlign: 'left' }}>Proven Process for Your Goals</h2>
              <p className="editorial-body" style={{ marginTop: '24px' }}>
                Our step-by-step approach simplifies challenges, delivers tailored strategies, and drives measurable results.
              </p>
              <div className="cta-group" style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <button className="editorial-button editorial-button-primary">Get Started <ArrowUpRight size={18} /></button>
              </div>
            </motion.div>

            <motion.div 
              className="process-steps"
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {[
                { num: 1, title: "Hassle-Free Scheduling", text: "Book your consultation in just a few clicks. We make it easy to connect and start addressing your business needs right away." },
                { num: 2, title: "Personalized Plan", text: "Every business is unique. We craft a strategy tailored to your goals, ensuring measurable progress and fresh opportunities for growth." },
                { num: 3, title: "Ongoing Partnership", text: "We stay with you beyond strategy offering continuous support, refinements, and guidance to help your business scale with confidence." }
              ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="editorial-card step-card"
                  style={{ padding: '48px' }}
                >
                  <span style={{ fontSize: '48px', fontWeight: 700, opacity: 0.1, display: 'block', marginBottom: '16px' }}>0{step.num}</span>
                  <h3 className="editorial-h3">{step.title}</h3>
                  <p className="editorial-body" style={{ marginTop: '16px' }}>{step.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON TABLE */}
      <section className="editorial-section" style={{ padding: '100px 0' }}>
        <div className="editorial-container">
          <motion.div 
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="section-header" 
            style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 64px' }}
          >
            <h2 className="editorial-h2">Why consulting when I can figure it myself ?</h2>
            <p className="editorial-body" style={{ marginTop: '24px' }}>
              We bring years of hands-on expertise, an eye for detail, and a deep passion for strategic growth.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="editorial-table" 
            style={{ border: '1px solid var(--black-10)', borderRadius: '12px', overflow: 'hidden' }}
          >
            <div className="editorial-table-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', backgroundColor: 'var(--white)' }}>
              <div className="editorial-table-cell" style={{ padding: '24px', borderRight: '1px solid var(--black-10)', fontWeight: 600 }}>Benefits</div>
              <div className="editorial-table-cell" style={{ padding: '24px', borderRight: '1px solid var(--black-10)', textAlign: 'center' }}>Self Taught</div>
              <div className="editorial-table-cell" style={{ padding: '24px', backgroundColor: 'var(--primary)', color: 'white', textAlign: 'center' }}>Archio Expert</div>
            </div>
            {[
              "Direct answers and niche relevance.",
              "Answer any complex question.",
              "Real experience in niche.",
              "Track record of getting results."
            ].map((label, idx) => (
              <div key={idx} className="editorial-table-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', borderTop: '1px solid var(--black-10)' }}>
                <div className="editorial-table-cell" style={{ padding: '20px', borderRight: '1px solid var(--black-10)' }}>{label}</div>
                <div className="editorial-table-cell" style={{ padding: '20px', borderRight: '1px solid var(--black-10)', textAlign: 'center', opacity: 0.3 }}><Minus size={20} /></div>
                <div className="editorial-table-cell" style={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--bg-color)' }}><Check size={20} color="var(--primary)" /></div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. SIGNATURE PROJECTS SECTION */}
      <section id="works" className="editorial-section" style={{ backgroundColor: 'var(--bg-color)', padding: '100px 0' }}>
        <div className="editorial-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="editorial-h2">Signature Works</h2>
            <p className="editorial-body" style={{ marginTop: '24px' }}>Expertly curated selection of our most impactful strategic transformations.</p>
          </div>

          <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '48px' }}>
            {featuredProjects.map((post, idx) => (
              <motion.div key={idx} variants={fadeIn('up', 0.2)} initial="hidden" whileInView="show" viewport={{ once: true }} className="blog-card">
                <Link to={`/project/${post.slug}`} className="blog-image-wrapper" style={{ overflow: 'hidden', borderRadius: '24px', display: 'block' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '360px', objectFit: 'cover' }} />
                </Link>
                <div className="blog-content" style={{ marginTop: '32px' }}>
                  <span className="editorial-body-small" style={{ color: 'var(--primary)', fontWeight: 600 }}>{post.category.toUpperCase()}</span>
                  <Link to={`/project/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="editorial-h3" style={{ marginTop: '12px' }}>{post.title}</h3>
                  </Link>
                  <p className="editorial-body-small" style={{ marginTop: '16px', opacity: 0.7 }}>{post.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EditorialHome;
