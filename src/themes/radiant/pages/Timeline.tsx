import phaseStudy from "@/assets/phase-study.jpg";
import phaseJapan from "@/assets/phase-japan.jpg";
import phaseVietnamWork from "@/assets/phase-vietnam-work.jpg";
import phaseStartup from "@/assets/phase-startup.jpg";
import TimelinePhase from "@/themes/radiant/components/TimelinePhase";
import { useEffect, useRef, useState } from "react";

const phases = [
  {
    period: "2010 — 2014",
    location: "Osaka, Nhật Bản",
    title: "Những năm tháng du học",
    company: "Osaka University",
    description:
      "Rời Việt Nam năm 22 tuổi với một vali hành lý và vô vàn hy vọng. Osaka mùa xuân, hoa anh đào nở dọc con đường đến trường — đó là ký ức không bao giờ phai.",
    image: phaseStudy,
    tag: "Du học",
  },
  {
    period: "2014 — 2018",
    location: "Tokyo, Nhật Bản",
    title: "Bước vào thị trường Nhật",
    company: "Rakuten, Inc.",
    description:
      "Bốn năm làm việc trong môi trường kỷ luật, chuyên nghiệp bậc nhất thế giới. Từ intern đến senior — mỗi ngày là một bài học về sự tỉ mỉ và tinh thần trách nhiệm.",
    image: phaseJapan,
    tag: "Sự nghiệp",
  },
  {
    period: "2018 — 2022",
    location: "Hà Nội, Việt Nam",
    title: "Trở về quê hương",
    company: "FPT Software",
    description:
      "Mang theo những gì học được tại Nhật, tôi trở về xây dựng một cái gì đó có ý nghĩa hơn. Gặp gỡ đồng đội cũ, xây dựng đội ngũ mới — Hà Nội mùa thu thật khác.",
    image: phaseVietnamWork,
    tag: "Về nước",
  },
  {
    period: "2022 — Nay",
    location: "TP. Hồ Chí Minh",
    title: "Khởi nghiệp & Tự do",
    company: "Freelance & Consulting",
    description:
      "Chuyển vào Sài Gòn, thành lập studio nhỏ. Cuộc sống chậm lại, nhưng ý nghĩa hơn. Mỗi sáng cà phê nhìn ra ban công — đây mới là nơi tôi muốn gắn bó.",
    image: phaseStartup,
    tag: "Hiện tại",
  },
];

const TimeLine = () => {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[52vh] flex flex-col items-center justify-end pb-20 pt-32 px-6 text-center overflow-hidden">
        {/* Decorative line top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 border-l border-timeline border-dashed" />

        <div
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 1s ease, transform 1s ease",
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-6">
            Hành trình · 2010 — Nay
          </p>
          <h1 className="font-display font-light text-6xl md:text-8xl leading-none text-foreground mb-4">
            Dòng
            <br />
            <span className="italic text-gold">Thời Gian</span>
          </h1>
          <p className="text-muted-foreground text-sm font-light max-w-md mx-auto leading-relaxed mt-6">
            Những chương đời được viết qua nhiều thành phố,
            <br className="hidden md:block" />
            nhiều công ty và vô số khoảnh khắc không quên.
          </p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">
            Cuộn xuống
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M2 7l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-6 pb-32 pt-8">
        {/* Top spine connector */}
        <div className="flex justify-center mb-0">
          <div className="w-px h-16 border-l border-dashed border-timeline" />
        </div>

        {phases.map((phase, i) => (
          <TimelinePhase
            key={i}
            {...phase}
            index={i}
            isLast={i === phases.length - 1}
          />
        ))}

        {/* End marker */}
        <div className="flex flex-col items-center mt-0">
          <div className="w-px h-12 border-l border-dashed border-timeline" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-4">
            Hành trình vẫn tiếp diễn
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="text-muted-foreground text-xs tracking-widest uppercase">
          Cập nhật · {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
};

export default TimeLine;
