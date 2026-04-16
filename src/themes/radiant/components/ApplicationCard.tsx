import { useState } from "react";
import type { SkillApplication } from "@/types/skills";

interface ApplicationCardProps {
  app: SkillApplication;
}

export default function ApplicationCard({ app }: ApplicationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`rounded-2xl p-10 flex flex-col justify-between aspect-square transition-all duration-300 cursor-pointer ${
        isHovered
          ? "bg-primary-container text-on-primary relative overflow-hidden"
          : "bg-surface-container text-on-surface hover:bg-surface-container-high"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      )}
      <div
        className={isHovered ? "z-10 flex flex-col h-full justify-between" : ""}
      >
        <span
          className={`material-symbols-outlined text-4xl ${isHovered ? "text-white" : ""}`}
        >
          dashboard
        </span>
        <div>
          <h4
            className={`font-headline text-2xl font-bold mb-3 ${isHovered ? "text-white" : ""}`}
          >
            {app.title}
          </h4>
          <p
            className={`font-body ${isHovered ? "text-white" : "text-on-surface-variant"}`}
          >
            {app.description}
          </p>
        </div>
      </div>
    </div>
  );
}
