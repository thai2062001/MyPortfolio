import { ReactNode, Suspense } from "react";
import SEO from "@/themes/radiant/components/SEO";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import PremiumLoader from "@/components/ui/PremiumLoader";

interface MinimalistLayoutProps {
  children: ReactNode;
  isLoading?: boolean;
  loaderText?: string;
  seoTitle?: string;
  seoDescription?: string;
  manualReadySignal?: boolean;
}

const MinimalistLayout = ({
  children,
  isLoading,
  loaderText = "Initializing Experience",
  seoTitle,
  seoDescription,
}: MinimalistLayoutProps) => {

  return (
    <div className="bg-canvas text-main min-h-screen selection:bg-primary/20 selection:text-primary">
      <SEO title={seoTitle} description={seoDescription} />
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[200]"
          >
            <PremiumLoader text={loaderText} />
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10"
      >
        {children}
      </motion.main>

      <Footer />

      {/* Decorative Organic Elements */}
      <div className="fixed top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[10%] left-[-10%] w-[50vw] h-[50vw] bg-secondary/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-[40%] left-[20%] w-[30vw] h-[30vw] bg-primary/3 blur-[80px] rounded-full pointer-events-none -z-10 opacity-30" />
    </div>
  );
};

export default MinimalistLayout;
