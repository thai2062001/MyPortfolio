import React from "react";
import { Folder, Zap, Edit3, Trash2, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaFolder } from "@/types/media";
import { useLang } from "@/contexts/LangContext";

interface MediaFolderSidebarProps {
  folders: MediaFolder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string) => void;
  onEditFolder: (folder: MediaFolder) => void;
  onDeleteFolder: (id: string, name: string) => void;
}

export const MediaFolderSidebar = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onEditFolder,
  onDeleteFolder,
}: MediaFolderSidebarProps) => {
  const { t } = useLang();

  return (
    <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-sage/10 bg-sage/[0.02] flex flex-col text-left">
      <div className="p-6 border-b border-sage/10">
        <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-sage flex items-center gap-2">
          <Hash size={12} />
          {t("Folders List", "フォルダーリスト", "Danh sách thư mục")}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {folders.map((f) => (
          <div key={f.id} className="group relative">
            <button
              onClick={() => onSelectFolder(f.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs truncate",
                selectedFolderId === f.id
                  ? "bg-sage text-white shadow-lg shadow-sage/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-sage/10 hover:text-sage"
              )}
            >
              <Folder
                size={16}
                className={selectedFolderId === f.id ? "text-white" : "text-sage/60"}
              />
              {f.name}
              {f.is_system && (
                <Zap
                  size={10}
                  className={
                    selectedFolderId === f.id ? "text-white/50" : "text-amber-400"
                  }
                />
              )}
            </button>
            {!f.is_system && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                <button
                  onClick={() => onEditFolder(f)}
                  className="p-1.5 text-muted-foreground hover:text-sage transition-colors"
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={() => onDeleteFolder(f.id, f.name)}
                  className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
