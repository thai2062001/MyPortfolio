import { motion } from "framer-motion";

interface PremiumLoaderProps {
  text?: string;
}

const PremiumLoader = ({ text = "Loading Experience" }: PremiumLoaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[11000] flex flex-col items-center justify-center bg-[#00040d]"
    >
      <div className="relative">
        {/* Artistic background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-vibe-pink/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-sage/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative w-24 h-24 flex items-center justify-center"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-white/10">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeDasharray="283"
              animate={{
                strokeDashoffset: [283, 0, 283],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: [0.44, 0, 0.56, 1],
              }}
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-artistic text-xl text-white"
          >
           HY
          </motion.span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.5em] uppercase text-white/40 font-bold">
          {text}
        </span>
        <div className="w-32 h-[1px] bg-white/10 overflow-hidden relative">
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PremiumLoader;
