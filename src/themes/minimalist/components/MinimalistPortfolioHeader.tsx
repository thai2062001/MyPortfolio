import { motion } from "framer-motion";

interface MinimalistPortfolioHeaderProps {
  categoryLabel?: string;
  titleLight?: string;
  titleDark?: string;
  description?: string;
}

export const MinimalistPortfolioHeader = ({
  categoryLabel,
  titleLight,
  titleDark,
  description
}: MinimalistPortfolioHeaderProps) => {
  return (
    <section className="pt-48 pb-32 px-6 md:px-12 bg-[#f5f5f1]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
        className="max-w-4xl"
      >
        <span className="text-[#000000] font-mono tracking-[0.2em] text-xs uppercase mb-8 block">
          {categoryLabel}
        </span>
        <h1 className="text-5xl md:text-8xl font-black text-[#000000] leading-[1.05] mb-12 tracking-tighter">
          {titleLight} <br className="hidden md:block"/> 
          <span className="text-[#777777]">{titleDark}</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#424242] leading-[1.6]">
          {description}
        </p>
      </motion.div>
    </section>
  );
};
