import { Link } from "react-router-dom";
import { useSiteSettings, usePersonalInfo, useSocialLinks } from "@/core/hooks/usePortfolio";

export const Footer = () => {
  const { data: settings } = useSiteSettings();
  const { data: personal } = usePersonalInfo();
  const { data: socialLinks } = useSocialLinks();

  return (
    <footer className="pt-24 pb-12 px-6 md:px-10 bg-canvas border-t border-border/10">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-display text-[32px] md:text-[40px] mb-8 block">
              {settings?.site_name || "Portfolio"}
              <span className="text-primary">.</span>
            </Link>
            <p className="text-body-large text-main/60 max-w-sm mb-8">
              {personal?.address || "Crafting intentional digital experiences with a Nordic touch."}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks?.map((social: any) => {
                const platform = social.platform || "link";
                return (
                  <a
                    key={social.id || platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-sand text-main hover:bg-primary hover:text-white transition-all ambient-shadow"
                  >
                    <i className={`fab fa-${platform.toLowerCase()}`}></i>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Nav Col */}
          <div className="flex flex-col gap-6">
            <h4 className="text-label text-main">Navigation</h4>
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-main/60 hover:text-primary transition-colors">Home</Link>
              <Link to="/portfolio" className="text-main/60 hover:text-primary transition-colors">Work</Link>
              <Link to="/skills" className="text-main/60 hover:text-primary transition-colors">Skills</Link>
              <Link to="/blog" className="text-main/60 hover:text-primary transition-colors">Blog</Link>
            </div>
          </div>

          {/* Contact Col */}
          <div className="flex flex-col gap-6">
            <h4 className="text-label text-main">Connect</h4>
            <div className="flex flex-col gap-4">
              <p className="text-main/60">{personal?.email || "hello@example.com"}</p>
              <p className="text-main/60">{personal?.phone_number || ""}</p>
              <Link to="/contact" className="text-primary font-medium hover:underline">Start a project →</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-main/5 gap-4">
          <p className="text-label text-main/30">
            &copy; {new Date().getFullYear()} {settings?.site_name}. Built with intention.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-label text-main/30 hover:text-main">Privacy Policy</Link>
            <span className="text-label text-main/30">Based in Vietnam & Scandinavia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
