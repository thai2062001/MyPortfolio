import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PremiumLoader from '@/components/ui/PremiumLoader';

interface SiteSettings {
  active_theme_id: string;
  site_name: string;
  maintenance_mode: boolean;
  global_custom_css?: string;
}

interface SiteContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('active_theme_id, site_name, maintenance_mode, global_custom_css')
        .eq('id', 1)
        .single();

      if (error) throw error;
      setSettings(data);
      
      // Apply custom CSS if exists
      if (data.global_custom_css) {
        let styleTag = document.getElementById('custom-site-css');
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = 'custom-site-css';
          document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = data.global_custom_css;
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
      // Fallback
      setSettings({
        active_theme_id: 'radiant',
        site_name: 'Portfolio',
        maintenance_mode: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (isLoading) {
    return <PremiumLoader text="Initializing Experience" />;
  }

  // Handle Maintenance Mode for public routes
  if (settings?.maintenance_mode && !window.location.pathname.startsWith('/admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
          <p className="text-zinc-400">We are currently updating the experience. Please check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <SiteContext.Provider value={{ settings, isLoading, refreshSettings: fetchSettings }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
