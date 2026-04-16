import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getSiteSettings } from "./lib/supabase-queries";

// Inject global styles from database
const injectGlobalStyles = async () => {
  try {
    const settings = await getSiteSettings();
    if (settings) {
      // Inject font import
      if (settings.global_font_import_css) {
        const styleEl = document.createElement("style");
        styleEl.textContent = settings.global_font_import_css;
        document.head.appendChild(styleEl);
      }

      // Apply font family to body
      if (settings.global_font_family) {
        document.documentElement.style.fontFamily = `${settings.global_font_family}, ${settings.global_font_fallback || "sans-serif"}`;
      }

      // Inject custom CSS
      if (settings.global_custom_css) {
        const customStyleEl = document.createElement("style");
        customStyleEl.textContent = settings.global_custom_css;
        document.head.appendChild(customStyleEl);
      }
    }
  } catch (error) {
    console.error("Error loading global styles:", error);
  }
};

// Inject styles before rendering
injectGlobalStyles();

createRoot(document.getElementById("root")!).render(<App />);
// Signal that React has taken over for the pre-rendered logo
document.body.classList.add('hydrated');
