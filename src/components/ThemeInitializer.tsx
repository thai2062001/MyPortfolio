import { useEffect } from "react";
import { useSite } from "@/contexts/SiteContext";

export const ThemeInitializer = () => {
  const { settings } = useSite();
  const activeThemeId = settings?.active_theme_id || "radiant";

  useEffect(() => {
    // Remove any existing theme classes
    const body = document.body;
    const classesToRemove = Array.from(body.classList).filter(c => c.startsWith('theme-'));
    body.classList.remove(...classesToRemove);

    // Add the active theme class
    body.classList.add(`theme-${activeThemeId}`);

    // Set data attribute for more specific CSS selectors if needed
    document.documentElement.setAttribute('data-theme', activeThemeId);
  }, [activeThemeId]);

  return null;
};
