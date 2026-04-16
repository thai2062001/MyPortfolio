import { useLang } from "@/contexts/LangContext";
import MinimalistLayout from "@/themes/minimalist/components/MinimalistLayout.tsx";
import { 
  useHeroSettings, 
  useSkills, 
  useProjects, 
  useTimeline,
  useFaqs,
  usePersonalInfo,
  useSocialLinks,
  useAboutContent
} from "@/core/hooks/usePortfolio";
import { Loader2 } from "lucide-react";

import { MinimalistHero } from "../components/MinimalistHero";
import { MinimalistAbout } from "../components/MinimalistAbout";
import { MinimalistDisciplines } from "../components/MinimalistDisciplines";
import { MinimalistFeaturedWork } from "../components/MinimalistFeaturedWork";
import { MinimalistMilestones } from "../components/MinimalistMilestones";
import { MinimalistFaq } from "../components/MinimalistFaq";
import { MinimalistContact } from "../components/MinimalistContact";

const MinimalistHome = () => {
  const { lang } = useLang();
  
  // Dynamic data from Supabase
  const { data: heroData, isLoading: heroLoading } = useHeroSettings();
  const { data: disciplines, isLoading: disciplinesLoading } = useSkills();
  const { data: milestones, isLoading: milestonesLoading } = useTimeline();
  const { data: projects, isLoading: projectsLoading } = useProjects(true); // Featured only
  const { data: faqs, isLoading: faqsLoading } = useFaqs();
  const { data: aboutContent, isLoading: aboutLoading } = useAboutContent();
  const { data: personal, isLoading: personalLoading } = usePersonalInfo();
  const { data: socialLinks, isLoading: socialLoading } = useSocialLinks();

  const isLoading = heroLoading || disciplinesLoading || milestonesLoading || projectsLoading || faqsLoading || aboutLoading || personalLoading || socialLoading;

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
      loaderText="Minimalist Approach"
      seoTitle={lang === 'en' ? heroData?.title_en : heroData?.title_ja || "Hai Yen Pham | Portfolio"}
    >
      <MinimalistHero 
        tagline={lang === 'en' ? 'Digital Catalyst' : 'Xúc tác kỹ thuật số'}
        title={lang === 'en' ? heroData?.title_en : heroData?.title_ja}
        subtitle={lang === 'en' ? heroData?.subtitle_en : heroData?.subtitle_ja}
        heroImage={heroData?.image_url || undefined}
      />

      <MinimalistAbout 
        title={lang === 'en' ? aboutContent?.[0]?.title_en : aboutContent?.[0]?.title_ja || "Harmonizing strategy with aesthetic soul."}
        description={lang === 'en' ? aboutContent?.[0]?.content_en : aboutContent?.[0]?.content_ja || "Building strategic frameworks that leverage data and psychology."}
        aboutData={aboutContent?.[0]}
      />

      <MinimalistDisciplines 
        title={lang === 'en' ? 'Focused disciplines.' : 'Lĩnh vực chuyên môn.'}
        subtitle={lang === 'en' 
          ? 'Specialized clusters designed to tackle high-growth product challenges.' 
          : 'Các cụm chuyên môn được thiết kế để giải quyết các thách thức sản phẩm tăng trưởng cao.'}
        disciplines={disciplines}
      />

      <MinimalistFeaturedWork 
        title={lang === 'en' ? 'Featured Work' : 'Dự án nổi bật'}
        subtitle={lang === 'en' ? 'Selected projects reflecting high-impact results.' : 'Các dự án chọn lọc phản ánh kết quả có tác động cao.'}
        viewAllText={lang === 'en' ? 'View All Projects' : 'Xem tất cả dự án'}
        projects={projects}
      />

      <MinimalistMilestones 
        title={lang === 'en' ? 'Professional Milestones' : 'Cột mốc sự nghiệp'}
        milestones={milestones}
      />

      <MinimalistFaq 
        title={lang === 'en' ? 'System Details / FAQ' : 'Câu hỏi thường gặp'}
        faqs={faqs}
        lang={lang}
      />

      <MinimalistContact 
        titleLight={lang === 'en' ? "Ready to architect" : "Sẵn sàng kiến tạo"}
        titleDark={lang === 'en' ? "your next vision?" : "tầm nhìn tiếp theo?"}
        description={lang === 'en' 
          ? "Let's build systems that don't just solve problems, but define new standards."
          : "Hãy xây dựng những hệ thống không chỉ giải quyết vấn đề, mà còn thiết lập các tiêu chuẩn mới."
        }
        email={personal?.email || "contact@minimalist.sys"}
        phone={personal?.phone_number || undefined}
        address={personal?.address || undefined}
        socialLinks={socialLinks}
      />
    </MinimalistLayout>
  );
};

export default MinimalistHome;
