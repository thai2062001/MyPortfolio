"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, List, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ListItem {
  title: string;
  content: string;
}

interface StructuredListEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  isChallenge?: boolean;
}

export const StructuredListEditor = ({
  value,
  onChange,
  label,
  placeholder,
  isChallenge
}: StructuredListEditorProps) => {
  const [isListMode, setIsListMode] = useState(false);
  const [items, setItems] = useState<ListItem[]>([]);
  const [rawText, setRawText] = useState("");

  // Initialize state from value
  useEffect(() => {
    if (!value) {
      setRawText("");
      setIsListMode(false);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setItems(parsed);
        setIsListMode(true);
      } else {
        setRawText(value);
        setIsListMode(false);
      }
    } catch (e) {
      setRawText(value);
      setIsListMode(false);
    }
  }, [value]);

  const handleToggleMode = () => {
    if (isListMode) {
      // Switch back to raw text - try to flatten items
      const flattened = items
        .map((item, i) => {
          if (!item.title) return item.content;
          return `${i + 1}. ${item.title}: ${item.content}`;
        })
        .join("\n\n");
      onChange(flattened);
      setRawText(flattened);
      setIsListMode(false);
    } else {
      // Switch to list mode
      const newItems = rawText.trim() ? [{ title: "", content: rawText }] : [{ title: "", content: "" }];
      onChange(JSON.stringify(newItems));
      setItems(newItems);
      setIsListMode(true);
    }
  };

  const updateItems = (newItems: ListItem[]) => {
    setItems(newItems);
    onChange(JSON.stringify(newItems));
  };

  const addItem = () => {
    updateItems([...items, { title: "", content: "" }]);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    if (updated.length === 0) {
      setIsListMode(false);
      onChange("");
    } else {
      updateItems(updated);
    }
  };

  const updateItem = (index: number, field: keyof ListItem, val: string) => {
    const updated = items.map((item, i) => 
      i === index ? { ...item, [field]: val } : item
    );
    updateItems(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sage/60">{label}</label>
        <Button 
          type="button"
          variant="outline" 
          size="sm" 
          onClick={handleToggleMode}
          className={cn(
            "h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
            isListMode ? "bg-sage text-white border-sage shadow-md" : "bg-white border-sage/20 text-sage hover:bg-sage/5"
          )}
        >
          {isListMode ? (
            <><List size={12} className="mr-1.5" /> List Builder ON</>
          ) : (
            <><AlignLeft size={12} className="mr-1.5" /> Standard Text</>
          )}
        </Button>
      </div>

      {isListMode ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {items.map((item, index) => (
            <div key={index} className="group relative bg-white/70 border border-sage/10 rounded-2xl p-6 shadow-sm hover:border-sage/40 transition-all">
              <div className="absolute -left-3 top-6 w-8 h-8 bg-sage text-white rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg z-10">
                {(index + 1).toString().padStart(2, '0')}
              </div>
              
              <div className="flex flex-col gap-4">
                <Input 
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  placeholder="Heading (e.g., Enterprise Security)"
                  className="bg-transparent border-none p-0 h-auto font-serif font-bold text-base text-sage placeholder:text-sage/20 focus-visible:ring-0 shadow-none"
                />
                <Textarea 
                  value={item.content}
                  onChange={(e) => updateItem(index, 'content', e.target.value)}
                  placeholder="Detailed explanation..."
                  rows={2}
                  className="bg-stone-50/50 border-none rounded-xl text-xs resize-none focus-visible:ring-0 p-4 font-medium leading-relaxed"
                />
              </div>

              <button 
                type="button"
                onClick={() => removeItem(index)}
                className="absolute -right-2 -top-2 w-7 h-7 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          
          <Button 
            type="button"
            onClick={addItem}
            className="w-full h-14 border-2 border-dashed border-sage/20 bg-white/30 text-sage hover:bg-sage/5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-sm"
          >
            <Plus size={16} className="mr-2" />
            Append New Solution Node
          </Button>
        </div>
      ) : (
        <Textarea 
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          rows={6}
          className="p-6 bg-white/70 border border-sage/20 rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-sage/20"
        />
      )}
    </div>
  );
};
