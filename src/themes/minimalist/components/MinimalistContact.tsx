import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { SocialLink } from "@/core/types/database";
import { FADE_UP_VARIANTS, NORDIC_TRANSITION } from "../constants/animations";
import { MinimalButton } from "./shared/MinimalButton";

interface MinimalistContactProps {
  titleLight: string;
  titleDark: string;
  description: string;
  email: string;
  phone?: string;
  address?: string;
  socialLinks?: SocialLink[];
}

const PURPOSE_OPTIONS = [
  "Strategic Consultation",
  "Brand Identity",
  "Digital Marketing",
  "Web Architecture",
  "System Audit",
  "Speaking/Media"
];

export const MinimalistContact = ({ 
  titleLight, 
  titleDark, 
  description, 
  email,
  phone,
  address,
  socialLinks 
}: MinimalistContactProps) => {
  const [selectedPurpose, setSelectedPurpose] = useState<string[]>([]);

  const togglePurpose = (purpose: string) => {
    setSelectedPurpose(prev => 
      prev.includes(purpose) 
        ? prev.filter(p => p !== purpose) 
        : [...prev, purpose]
    );
  };

  return (
    <section className="py-48 px-6 md:px-12 bg-white relative overflow-hidden" id="contact">
      
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-surface-sand/10 -z-10" />

      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-start relative z-10">
          
          {/* Left Side: Text & Contact Info */}
          <div className="lg:col-span-12 xl:col-span-5">
            <motion.div
              variants={FADE_UP_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="text-label text-primary mb-8 block font-black text-[12px]">Get in touch</span>
              <h2 className="text-display font-display leading-[0.9] text-main mb-12">
                {titleLight} <br />
                <span className="opacity-40 italic">{titleDark}</span>
              </h2>
              <p className="text-body-large text-main/60 italic mb-16 max-w-lg leading-relaxed text-[17px]">
                {description || "Let's architect solutions that define the next generation of growth."}
              </p>

              {/* Direct Contact Info */}
              <div className="space-y-10 mb-16">
                 {email && (
                   <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-main/5">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-main/30 font-black mb-1">Email</p>
                        <p className="text-main font-display text-[18px]">{email}</p>
                      </div>
                   </div>
                 )}
                 {phone && (
                   <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-main/5">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-main/30 font-black mb-1">Direct Line</p>
                        <p className="text-main font-display text-[18px]">{phone}</p>
                      </div>
                   </div>
                 )}
                 {address && (
                   <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 rounded-full bg-white shadow-soft flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-main/5">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-main/30 font-black mb-1">Office</p>
                        <p className="text-main font-body text-[16px]">{address}</p>
                      </div>
                   </div>
                 )}
              </div>

              {/* Social Links Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {socialLinks?.filter(s => s.is_published).map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 group rounded-[32px] bg-white border border-main/10 hover:border-primary/40 hover:bg-surface-sand transition-all duration-700 shadow-sm hover:shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                         {(social as any).icon_url ? (
                           <img src={(social as any).icon_url} className="w-5 h-5 object-contain group-hover:brightness-0 group-hover:invert transition-all" alt="" />
                         ) : (
                           <i className={`fab fa-${(social.platform || "link").toLowerCase()} text-[18px]`}></i>
                         )}
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-main/60 group-hover:text-main transition-colors">
                         {social.platform}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side: High-End Form */}
          <div className="lg:col-span-12 xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={NORDIC_TRANSITION}
              className="bg-white p-10 md:p-16 rounded-[64px] shadow-elevated border border-main/5 relative"
            >
              <div className="absolute top-0 right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-0" />

              <form className="space-y-12 relative z-10" onSubmit={(e) => e.preventDefault()}>
                
                {/* Visual Purpose Selector */}
                <div className="space-y-6">
                  <label className="text-label text-main pl-2">What is the purpose of your contact?</label>
                  <div className="flex flex-wrap gap-3">
                    {PURPOSE_OPTIONS.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => togglePurpose(option)}
                        className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-500 border ${
                          selectedPurpose.includes(option)
                            ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105'
                            : 'bg-transparent text-main/40 border-main/10 hover:border-primary/40 hover:text-primary'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-label text-main pl-2 font-black">Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Alex Johnson"
                      className="w-full text-[17px] bg-surface-sand/20 border border-main/10 rounded-[24px] p-7 focus:ring-0 focus:outline-none focus:border-primary focus:bg-white transition-all duration-500 placeholder:text-main/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-label text-main pl-2 font-black">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g., alex@company.com"
                      className="w-full text-[17px] bg-surface-sand/20 border border-main/10 rounded-[24px] p-7 focus:ring-0 focus:outline-none focus:border-primary focus:bg-white transition-all duration-500 placeholder:text-main/20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="text-label text-main pl-2 font-black">Your Vision</label>
                   <textarea 
                     rows={4}
                     placeholder="Tell me about your project or next big idea..."
                     className="w-full text-[17px] bg-surface-sand/20 border border-main/10 rounded-[32px] p-8 focus:ring-0 focus:outline-none focus:border-primary focus:bg-white transition-all duration-500 placeholder:text-main/20 resize-none"
                   />
                </div>

                <MinimalButton variant="primary" size="lg" className="w-full py-8 text-[13px]" showIcon={true}>
                  Initiate Collaboration
                </MinimalButton>
                
                <p className="text-[10px] text-center text-main/30 uppercase tracking-[0.3em] font-bold">
                  Usually replies within 24-48 hours.
                </p>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
