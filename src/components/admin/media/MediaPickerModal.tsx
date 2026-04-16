import { useState, useEffect, useRef } from "react";
import { 
  getMediaFolders, 
  getMediaAssets, 
  createMediaAsset 
} from "@/lib/supabase-media";
import { uploadMedia } from "@/lib/cloudinary";
import { MediaFolder, MediaAsset, AssetType } from "@/types/media";
import { 
  Plus, 
  Search, 
  Folder, 
  Image as ImageIcon, 
  X, 
  Upload, 
  Check,
  Hash,
  Loader2,
  Filter,
  Grid
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface MediaPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string, asset?: MediaAsset) => void;
  allowedTypes?: AssetType[];
  title?: string;
  allowMultiple?: boolean;
}

export const MediaPickerModal = ({
  open,
  onOpenChange,
  onSelect,
  allowedTypes = ['image', 'svg', 'icon'],
  title = "Select Resource",
  allowMultiple = false
}: MediaPickerModalProps) => {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType | 'all'>(allowedTypes.length > 1 ? 'all' : allowedTypes[0]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [showAllAssets, setShowAllAssets] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetchInitialData();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchAssets(selectedFolderId, assetTypeFilter === 'all' ? undefined : assetTypeFilter);
    }
  }, [selectedFolderId, assetTypeFilter, open]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const fetchedFolders = await getMediaFolders();
      setFolders(fetchedFolders);
      
      const common = fetchedFolders.find(f => f.slug === 'common');
      if (common) {
        setSelectedFolderId(common.id);
        setShowAllAssets(false);
        await fetchAssets(common.id);
      } else if (fetchedFolders.length > 0) {
        setSelectedFolderId(fetchedFolders[0].id);
        setShowAllAssets(false);
        await fetchAssets(fetchedFolders[0].id);
      } else {
        setSelectedFolderId(null);
        setShowAllAssets(true);
        await fetchAssets(null);
      }
    } catch (error) {
      toast.error("Failed to sync media matrix.");
      setShowAllAssets(true);
      await fetchAssets(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async (folderId?: string | null, type?: string) => {
    try {
      const fetchedAssets = await getMediaAssets(folderId || undefined, type);
      // Filter by allowed types if 'all' is selected
      if (type === undefined && allowedTypes.length > 0) {
        setAssets(fetchedAssets.filter(a => allowedTypes.includes(a.asset_type)));
      } else {
        setAssets(fetchedAssets);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const currentFolder = folders.find(f => f.id === selectedFolderId);
      const isIconType = allowedTypes.includes('icon') && !allowedTypes.includes('image');

      const metadata = await uploadMedia(file, { 
        folder: currentFolder?.slug || 'common',
        isIcon: isIconType
      });
      
      const newAsset = await createMediaAsset({
        ...metadata,
        folder_id: selectedFolderId,
        title: file.name
      });
      
      toast.success("Resource integrated into grid.");
      onSelect(newAsset.secure_url, newAsset);
      onOpenChange(false);
    } catch (error) {
      toast.error("Ingestion failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const filteredAssets = assets.filter(a => 
    a.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.title && a.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideDefaultClose className="max-w-full w-[100dvw] h-[100dvh] md:h-[95vh] md:max-w-6xl p-0 overflow-hidden bg-white/95 backdrop-blur-3xl border-none shadow-2xl rounded-none md:rounded-[3rem] flex flex-col md:flex-row">
        
        {/* SIDEBAR (Desktop) */}
        <div className="w-64 border-r border-sage/10 bg-sage/[0.03] hidden lg:flex flex-col">
           <div className="p-8 border-b border-sage/10 text-left">
              <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-sage">Folders</h3>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                onClick={() => {
                  setSelectedFolderId(null);
                  setShowAllAssets(true);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-[11px] truncate text-left",
                  showAllAssets
                    ? "bg-heading text-white shadow-lg" 
                    : "text-muted-foreground hover:bg-sage/10 hover:text-sage"
                )}
              >
                <Grid size={14} />
                All Resources
              </button>

              <div className="h-px bg-sage/10 my-4 mx-2" />

              {folders.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFolderId(f.id);
                    setShowAllAssets(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-[11px] truncate text-left",
                    (selectedFolderId === f.id && !showAllAssets)
                      ? "bg-sage text-white shadow-lg shadow-sage/20" 
                      : "text-muted-foreground hover:bg-sage/10 hover:text-sage"
                  )}
                >
                  <Folder size={14} />
                  {f.name}
                </button>
              ))}
           </div>
        </div>

        {/* MAIN PANEL */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/40">
           <DialogHeader className="p-4 md:p-8 border-b border-sage/10 flex flex-row items-center justify-between space-y-0 shrink-0">
             <div>
               <DialogTitle className="font-serif text-lg md:text-2xl font-bold text-heading">{title}</DialogTitle>
               <DialogDescription className="sr-only">Browse and select media assets from your library.</DialogDescription>
             </div>
             <button
               onClick={() => onOpenChange(false)}
               className="w-8 h-8 md:w-10 md:h-10 rounded-xl hover:bg-heading hover:text-white flex items-center justify-center text-muted-foreground transition-all duration-300 group/close shrink-0"
             >
               <X size={18} className="group-hover/close:rotate-90 transition-transform duration-300" />
             </button>
           </DialogHeader>
 
           {/* Mobile Folder Selector */}
           <div className="lg:hidden border-b border-sage/10 bg-sage/[0.03] flex items-center gap-2 p-3 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  setSelectedFolderId(null);
                  setShowAllAssets(true);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[10px] whitespace-nowrap shrink-0",
                  showAllAssets
                    ? "bg-heading text-white shadow-md" 
                    : "text-muted-foreground bg-white/50 hover:bg-sage/10"
                )}
              >
                <Grid size={12} />
                All
              </button>
              {folders.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFolderId(f.id);
                    setShowAllAssets(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[10px] whitespace-nowrap shrink-0",
                    (selectedFolderId === f.id && !showAllAssets)
                      ? "bg-sage text-white shadow-md" 
                      : "text-muted-foreground bg-white/50 hover:bg-sage/10"
                  )}
                >
                  <Folder size={12} />
                  {f.name}
                </button>
              ))}
           </div>
           <div className="p-4 md:p-6 border-b border-sage/10 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <Input 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search files..." 
                    className="pl-10 h-11 bg-white border-none rounded-xl text-xs font-bold shadow-sm w-full"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  {isUploading ? (
                    <div className="flex-1 sm:flex-none h-11 px-6 flex items-center justify-center bg-sage/10 rounded-xl">
                      <Loader2 size={16} className="animate-spin text-sage" />
                      <span className="ml-2 text-[10px] font-bold text-sage uppercase tracking-widest whitespace-nowrap">Uploading...</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-none h-11 px-6 bg-sage text-white rounded-xl text-[10px] font-bold uppercase tracking-widest gap-2 shadow-lg shadow-sage/20 whitespace-nowrap"
                    >
                      <Upload size={14} />
                      Update Images
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                 {['all', ...allowedTypes].map((type) => (
                   <button
                    key={type}
                    onClick={() => setAssetTypeFilter(type as any)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all shrink-0",
                      assetTypeFilter === type 
                        ? "bg-heading text-white shadow-md" 
                        : "bg-white text-muted-foreground border border-sage/10 hover:bg-sage/10 hover:text-sage"
                    )}
                   >
                     {type}
                   </button>
                 ))}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" />
           </div>

           {/* Grid content */}
           <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                   <Grid size={48} className="text-sage mb-4" />
                   <p className="font-serif italic text-lg text-heading">No resources match your query.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-6">
                   {filteredAssets.map(asset => {
                     const isSelected = selectedAssetIds.includes(asset.id);
                     return (
                      <div 
                       key={asset.id}
                       onClick={() => {
                         if (allowMultiple) {
                           setSelectedAssetIds(prev => 
                             prev.includes(asset.id) 
                               ? prev.filter(id => id !== asset.id) 
                               : [...prev, asset.id]
                           );
                         } else {
                           onSelect(asset.secure_url, asset);
                           onOpenChange(false);
                         }
                       }}
                       className={cn(
                         "group relative aspect-square rounded-2xl md:rounded-[1.5rem] overflow-hidden cursor-pointer transition-all duration-300 border-2 bg-white",
                         isSelected ? "border-sage shadow-xl scale-95" : "border-transparent hover:border-sage hover:shadow-xl"
                       )}
                      >
                         <img src={asset.secure_url} className="w-full h-full object-cover" alt="" />
                         
                         {isSelected && (
                           <div className="absolute top-3 right-3 w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                             <Check size={14} strokeWidth={3} />
                           </div>
                         )}

                         <div className="absolute inset-x-0 bottom-0 p-3 bg-heading/80 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform">
                            <p className="text-[9px] font-bold text-white truncate text-center uppercase tracking-tighter">{asset.file_name}</p>
                         </div>
                      </div>
                     );
                   })}
                </div>
              )}
           </div>

           {allowMultiple && (
              <DialogFooter className="p-4 md:p-8 border-t border-sage/10 bg-white/50 backdrop-blur-md shrink-0">
                 <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                     {selectedAssetIds.length} Assets Selected
                   </p>
                   <div className="flex gap-3 w-full sm:w-auto">
                     <Button 
                       variant="ghost" 
                       onClick={() => setSelectedAssetIds([])}
                       className="flex-1 sm:flex-none text-[10px] font-bold uppercase"
                     >
                       Clear
                     </Button>
                     <Button 
                       disabled={selectedAssetIds.length === 0}
                       onClick={() => {
                         selectedAssetIds.forEach(id => {
                           const asset = assets.find(a => a.id === id);
                           if (asset) onSelect(asset.secure_url, asset);
                         });
                         onOpenChange(false);
                         setSelectedAssetIds([]);
                       }}
                       className="flex-[2] sm:flex-none bg-sage text-white px-6 md:px-10 h-10 md:h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-sage/20"
                     >
                       Confirm
                     </Button>
                   </div>
                 </div>
              </DialogFooter>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
