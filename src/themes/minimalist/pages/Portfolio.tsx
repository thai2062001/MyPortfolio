import { useLang } from "@/contexts/LangContext";
import MinimalistLayout from "@/themes/minimalist/components/MinimalistLayout.tsx";
import { useProjects, useExpertiseSkills, usePersonalInfo, useSocialLinks } from "@/core/hooks/usePortfolio";
import { Loader2 } from "lucide-react";

import { MinimalistPortfolioHeader } from "../components/MinimalistPortfolioHeader";
import { MinimalistProjectGrid } from "../components/MinimalistProjectGrid";
import { MinimalistStrategicLeadership } from "../components/MinimalistStrategicLeadership";
import { MinimalistContact } from "../components/MinimalistContact";

const MinimalistPortfolio = () => {
  const { lang } = useLang();
  
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: expertise, isLoading: expertiseLoading } = useExpertiseSkills();
  const { data: personal } = usePersonalInfo();
  const { data: socialLinks } = useSocialLinks();

  const isLoading = projectsLoading || expertiseLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f1] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#000000]" />
      </div>
    );
  }

  return (
    <MinimalistLayout
      isLoading={false}
      loaderText="Minimalist Portfolio"
      seoTitle={lang === 'en' ? "Portfolio | Modern Portfolio System" : "Dự án | Modern Portfolio System"}
    >
      <MinimalistPortfolioHeader 
        categoryLabel="Portfolio"
        titleLight="High-Impact"
        titleDark="Curation."
        description={lang === 'en' 
          ? "A curated selection of projects focusing on high-impact architectural innovation and strategic design systems."
          : "Bộ sưu tập các dự án được tinh lọc, tập trung vào đổi mới kiến trúc và các hệ thống thiết kế chiến lược hiệu quả cao."
        }
      />

      <MinimalistProjectGrid 
        projects={projects}
        lang={lang}
      />

      <MinimalistStrategicLeadership 
        titleLight={lang === 'en' ? "Beyond the blueprint:" : "Hơn cả một bản thiết kế:"}
        titleDark={lang === 'en' ? "Strategic Leadership." : "Lãnh đạo Chiến lược."}
        description={lang === 'en'
          ? "Architecture is as much about human systems as it is about physical structures. My approach integrates executive-level strategy with spatial innovation."
          : "Kiến trúc nói về hệ thống con người cũng nhiều như cấu trúc vật lý. Cách tiếp cận của tôi tích hợp chiến lược cấp điều hành với sự đổi mới không gian."
        }
        expertise={expertise}
      />

      <MinimalistContact 
        titleLight={lang === 'en' ? "Ready to architect" : "Sẵn sàng kiến tạo"}
        titleDark={lang === 'en' ? "your next vision?" : "tầm nhìn tiếp theo?"}
        description={lang === 'en' 
          ? "Let's build systems that don't just solve problems, but define new standards."
          : "Hãy xây dựng những hệ thống không chỉ giải quyết vấn đề, mà còn thiết lập các tiêu chuẩn mới."
        }
        email={personal?.email || "contact@minimalist.sys"}
        socialLinks={socialLinks}
      />
    </MinimalistLayout>
  );
};

export default MinimalistPortfolio;
