import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useSite } from '@/contexts/SiteContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, Layout, Palette, Sparkles, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Theme {
  id: string;
  name: string;
  description: string;
  preview_image_url: string;
}

const ThemeManagement = () => {
  const { settings, refreshSettings } = useSite();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast({
        title: "Error",
        description: "Failed to load themes list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivate = async (themeId: string) => {
    setActivatingId(themeId);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ active_theme_id: themeId })
        .eq('id', 1);

      if (error) throw error;

      await refreshSettings();
      
      toast({
        title: "Theme Activated!",
        description: `The "${themeId}" theme is now live.`,
      });
    } catch (error) {
      console.error('Error activating theme:', error);
      toast({
        title: "Error",
        description: "Failed to activate theme.",
        variant: "destructive",
      });
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent italic flex items-center gap-2">
              <Palette className="w-8 h-8 text-sage" />
              Giao diện hệ thống
            </h1>
            <p className="text-zinc-400 mt-1">Thay đổi phong cách hiển thị cho Portfolio của bạn.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-sage" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => {
              const isActive = settings?.active_theme_id === theme.id;
              
              return (
                <Card 
                  key={theme.id} 
                  className={`relative overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-sage/50 group ${isActive ? 'ring-2 ring-sage ring-offset-2 ring-offset-black border-sage' : ''}`}
                >
                  <div className="aspect-video w-full bg-zinc-800 relative overflow-hidden">
                    {theme.preview_image_url ? (
                      <img 
                        src={theme.preview_image_url} 
                        alt={theme.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-zinc-600 italic">
                        No Preview Available
                      </div>
                    )}
                    
                    {isActive && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-sage text-black font-bold uppercase tracking-tighter">
                          ĐANG DÙNG
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {theme.name}
                      {theme.id === 'radiant' && <Sparkles className="w-4 h-4 text-sage" />}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {theme.description}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter>
                    <Button
                      className={`w-full ${isActive ? 'bg-zinc-800 pointer-events-none' : 'bg-sage hover:bg-sage/90 text-black font-bold'}`}
                      disabled={isActive || !!activatingId}
                      onClick={() => handleActivate(theme.id)}
                    >
                      {activatingId === theme.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : isActive ? (
                        <><Check className="w-4 h-4 mr-2" /> Đã áp dụng</>
                      ) : (
                        <><Layout className="w-4 h-4 mr-2" /> Kích hoạt</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sage" />
            Về việc thay đổi giao diện
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400 list-disc list-inside">
            <li>Toàn bộ dữ liệu như dự án, kỹ năng sẽ được giữ nguyên khi đổi giao diện.</li>
            <li>Một số giao diện có thể có các vị trí hiển thị hình ảnh khác nhau.</li>
            <li>Chúng tôi khuyên bạn nên kiểm lại lại giao diện Mobile sau khi kích hoạt theme mới.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ThemeManagement;
