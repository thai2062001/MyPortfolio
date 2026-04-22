import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
}

const SEO = ({ title, description, image, article }: SEOProps) => {
  const { pathname } = useLocation();
  
  const defaultTitle = "Thái Phạm | Full Stack Developer & Digital Architect";
  const defaultDescription = "Crafting high-performance web applications and digital solutions. Portfolio of Thái Phạm, Full Stack Developer specializing in modern web ecosystems.";
  const siteUrl = "https://ba-thai-portfolio.site";
  const fixedImage = "https://res.cloudinary.com/dpdzbuiml/image/upload/v1776841852/common/s8bn1t36h2eleg9jn9i6.webp";

  const seo = {
    title: title ? `${title} | Thái Phạm` : defaultTitle,
    description: description || defaultDescription,
    image: fixedImage,
    url: `${siteUrl}${pathname}`,
  };

  useEffect(() => {
    document.title = seo.title;
    
    const updateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        if (property) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    updateMeta("description", seo.description);
    updateMeta("og:title", seo.title, true);
    updateMeta("og:description", seo.description, true);
    updateMeta("og:image", seo.image, true);
    updateMeta("og:url", seo.url, true);
    updateMeta("og:type", article ? "article" : "website", true);
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", seo.title);
    updateMeta("twitter:description", seo.description);
    updateMeta("twitter:image", seo.image);

  }, [seo.title, seo.description, seo.image, seo.url, article]);

  return null;
};

export default SEO;
