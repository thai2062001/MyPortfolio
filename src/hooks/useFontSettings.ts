import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useFontSettings = () => {
    useEffect(() => {
        const applyFonts = async () => {
            // Performance Optimization: Dynamic font loading from DB is disabled 
            // to prevent chained critical requests and improve FCP/LCP.
            // Brand fonts are now loaded statically via index.html.
            return;
        };

        applyFonts();

        // Listen for internal system updates
        window.addEventListener("portfolio-font-update", applyFonts);
        return () => window.removeEventListener("portfolio-font-update", applyFonts);
    }, []);
};
