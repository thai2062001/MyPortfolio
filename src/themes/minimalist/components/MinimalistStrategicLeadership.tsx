import { StrategicSkill } from "@/core/types/database";

interface MinimalistStrategicLeadershipProps {
  titleLight: string;
  titleDark: string;
  description: string;
  expertise?: StrategicSkill[];
}

export const MinimalistStrategicLeadership = ({
  titleLight,
  titleDark,
  description,
  expertise
}: MinimalistStrategicLeadershipProps) => {
  return (
    <section className="py-48 px-6 md:px-12 bg-[#000000] text-[#e2e2e2] border-t border-[#424242]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-32 max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-[1.05]">
            {titleLight} <br/><span className="text-[#e2e2e2]/50">{titleDark}</span>
          </h2>
          <p className="text-[#777777] text-xl leading-[1.6]">
            {description}
          </p>
        </div>
        
        {/* Architectural Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#424242]">
          {expertise?.map((item, idx) => (
            <div key={item.id} className="p-12 border-r border-b border-[#424242] hover:bg-[#1a1c1c] transition-colors min-h-[250px] flex flex-col">
              <span className="text-[#777777] font-mono text-xs uppercase tracking-widest block mb-6">
                No. {(idx + 1).toString().padStart(2, '0')}
              </span>
              <h4 className="text-xl font-bold mb-4 text-[#ffffff]">{item.skill_name}</h4>
              <p className="text-[#777777] leading-relaxed text-sm flex-grow">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
