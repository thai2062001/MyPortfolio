import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SectionHeaderProps {
  eyebrow?: string | ReactNode;
  title: string | ReactNode;
  description?: string | ReactNode;
  align?: "left" | "center" | "right" | "between";
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
  spanClassName?: string;
  highlightWords?: string[];
  highlightClassName?: string;
  staggerDelay?: number;
  viewportAmount?: number;
}

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "left",
  eyebrowClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  className = "",
  highlightWords = [],
  highlightClassName = "text-primary/70",
  staggerDelay = 0.1,
  viewportAmount = 0.2,
}: SectionHeaderProps) => {
  const isMobile = useIsMobile();
  
  const getAlignClass = () => {
    switch (align) {
      case "center": return "text-center items-center mx-auto";
      case "right": return "text-right items-end ml-auto";
      case "between": return "flex flex-col lg:flex-row lg:items-end justify-between";
      default: return "text-left items-start";
    }
  };

  const renderTitle = () => {
    if (typeof title !== "string" || highlightWords.length === 0) return title;
    
    return title.split(" ").map((word, i) => {
      const isHighlighted = highlightWords.some(hw => 
        word.toLowerCase().includes(hw.toLowerCase())
      );
      return (
        <span key={i} className={isHighlighted ? highlightClassName : ""}>
          {word}{" "}
        </span>
      );
    });
  };

  const animationVariants = {
    eyebrow: fadeIn("up", staggerDelay, isMobile),
    title: fadeIn("up", staggerDelay + 0.1, isMobile),
    description: fadeIn("up", staggerDelay + 0.2, isMobile),
  };

  if (isMobile) {
    if (align === "between") {
      return (
        <div className={`${getAlignClass()} ${className} gap-8 md:gap-12`}>
          <div className="space-y-6 md:space-y-8 flex-1">
            {eyebrow && (
              <div className={eyebrowClassName}>
                {eyebrow}
              </div>
            )}
            <h2 className={titleClassName}>
              {renderTitle()}
            </h2>
          </div>
          {description && (
            <div className={`max-w-md shrink-0 ${descriptionClassName}`}>
              {typeof description === 'string' ? (
                <p>{description}</p>
              ) : description}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`flex flex-col ${getAlignClass()} ${className}`}>
        {eyebrow && (
          <span className={eyebrowClassName}>
            {eyebrow}
          </span>
        )}
        
        <h2 className={titleClassName}>
          {renderTitle()}
        </h2>

        {description && (
          <div className={descriptionClassName}>
            {typeof description === 'string' ? (
              <p>{description}</p>
            ) : description}
          </div>
        )}
      </div>
    );
  }

  if (align === "between") {
    return (
      <div className={`${getAlignClass()} ${className} gap-8 md:gap-12`}>
        <div className="space-y-6 md:space-y-8 flex-1">
          {eyebrow && (
            <motion.div 
              variants={animationVariants.eyebrow}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: viewportAmount }}
              className={`${eyebrowClassName} will-change-transform`}
            >
              {eyebrow}
            </motion.div>
          )}
          <motion.h2 
            variants={animationVariants.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: viewportAmount }}
            className={`${titleClassName} will-change-transform`}
          >
            {renderTitle()}
          </motion.h2>
        </div>
        {description && (
          <motion.div 
            variants={animationVariants.description}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: viewportAmount }}
            className={`max-w-md shrink-0 ${descriptionClassName} will-change-transform`}
          >
            {typeof description === 'string' ? (
              <p>{description}</p>
            ) : description}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${getAlignClass()} ${className}`}>
      {eyebrow && (
        <motion.span 
          variants={animationVariants.eyebrow}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: viewportAmount }}
          className={`${eyebrowClassName} will-change-transform`}
        >
          {eyebrow}
        </motion.span>
      )}
      
      <motion.h2 
        variants={animationVariants.title}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: viewportAmount }}
        className={`${titleClassName} will-change-transform`}
      >
        {renderTitle()}
      </motion.h2>

      {description && (
        <motion.div 
          variants={animationVariants.description}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: viewportAmount }}
          className={`${descriptionClassName} will-change-transform`}
        >
          {typeof description === 'string' ? (
            <p>{description}</p>
          ) : description}
        </motion.div>
      )}
    </div>
  );
};

export default SectionHeader;
