import { useState } from "react";

interface SkillCTASectionProps {
  onContactClick: () => void;
}

export default function SkillCTASection({
  onContactClick,
}: SkillCTASectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 23, 11, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(0, 23, 11, 0);
          }
        }
        .glow-animate {
          animation: glow-pulse 2s infinite;
        }
      `}</style>

      <section
        className="max-w-[1440px] mx-auto px-6 md:px-12 bg-surface-container rounded-2xl border border-outline-variant/20"
        style={{ marginTop: "80px", marginBottom: "80px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="py-24 text-center ">
          <h2 className="font-headline text-5xl md:text-6xl font-bold text-primary tracking-tighter mb-6 italic">
            Interested in this skill?
          </h2>
          <p className="font-body text-xl text-on-surface-variant mb-8 max-w-2xl mx-auto">
            If this expertise aligns with your project needs, I would love to
            discuss how I can help bring your vision to life.
          </p>
          <button
            onClick={onContactClick}
            className={`inline-flex px-12 py-5 bg-primary text-on-primary font-body font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 ${
              isHovered ? "glow-animate" : ""
            }`}
          >
            Get In Touch
          </button>
        </div>
      </section>
    </>
  );
}
