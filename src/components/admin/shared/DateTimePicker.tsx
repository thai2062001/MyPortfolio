"use client";

import * as React from "react";
import { format, setHours, setMinutes } from "date-fns";
import { Calendar as CalendarIcon, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLang } from "@/contexts/LangContext";

interface DateTimePickerProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

export const DateTimePicker = ({ value, onChange, label }: DateTimePickerProps) => {
  const { lang, t } = useLang();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const dateValue = value ? new Date(value) : undefined;
  
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    
    // Preserve current time if existing value exists
    if (dateValue) {
      newDate = setHours(newDate, dateValue.getHours());
      newDate = setMinutes(newDate, dateValue.getMinutes());
    } else {
      // Default to current time for new selection
      const now = new Date();
      newDate = setHours(newDate, now.getHours());
      newDate = setMinutes(newDate, now.getMinutes());
    }
    
    onChange(newDate.toISOString());
  };

  const handleTimeChange = (type: 'hours' | 'minutes', val: number) => {
    let newDate = dateValue || new Date();
    if (type === 'hours') {
      newDate = setHours(newDate, val);
    } else {
      newDate = setMinutes(newDate, val);
    }
    onChange(newDate.toISOString());
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-14 justify-start text-left font-normal bg-white/70 border-sage/20 rounded-xl px-8 shadow-sm hover:border-sage/40 hover:bg-white transition-all",
            !value && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-4 w-full">
            <div className="p-2 rounded-lg bg-sage/5 text-sage">
              <CalendarIcon size={16} />
            </div>
            <div className="flex flex-col items-start leading-none gap-1">
              {label && <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>}
              <span className="text-xs font-bold font-mono">
                {value ? format(new Date(value), "PPP p") : t("Pick a date", "日付を選択", "Chọn ngày")}
              </span>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-[2rem] border-sage/10 shadow-2xl overflow-hidden bg-white/95 backdrop-blur-xl" align="start">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-sage/10">
          <div className="p-4 bg-white/50">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={handleDateSelect}
              initialFocus
              classNames={{
                day_selected: "bg-sage text-white hover:bg-sage/90 font-bold rounded-xl",
                day_today: "bg-sage/10 text-sage font-bold rounded-xl",
                day: "h-10 w-10 p-0 font-bold transition-all hover:bg-sage/5 rounded-xl",
                head_cell: "text-muted-foreground w-10 font-black text-[10px] uppercase tracking-tighter",
                caption: "flex justify-center pt-2 relative items-center mb-4",
                caption_label: "text-xs font-black uppercase tracking-widest text-sage",
                nav_button: "h-8 w-8 bg-sage/5 border-none hover:bg-sage/10 text-sage rounded-lg transition-all",
              }}
            />
          </div>
          <div className="p-6 min-w-[200px] flex flex-col bg-sage/5">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-sage" size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sage">{t("Temporal Point", "時間指定", "Thời điểm")}</span>
            </div>
            
            <div className="flex gap-4 flex-1">
              <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[280px] pr-2 scrollbar-none">
                <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2 sticky top-0 bg-sage/5 py-1">{t("Hour", "時", "Giờ")}</p>
                {hours.map((h) => (
                  <button
                    key={h}
                    onClick={() => handleTimeChange('hours', h)}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 text-[10px] font-mono font-bold rounded-lg transition-all",
                      dateValue?.getHours() === h 
                        ? "bg-sage text-white shadow-lg" 
                        : "text-muted-foreground hover:bg-sage/10 hover:text-sage"
                    )}
                  >
                    {h.toString().padStart(2, '0')}
                    {dateValue?.getHours() === h && <Check size={10} />}
                  </button>
                ))}
              </div>
              
              <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[280px] pr-2 scrollbar-none">
                <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2 sticky top-0 bg-sage/5 py-1">{t("Min", "分", "Phút")}</p>
                {minutes.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleTimeChange('minutes', m)}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 text-[10px] font-mono font-bold rounded-lg transition-all",
                      dateValue?.getMinutes() === m 
                        ? "bg-sage text-white shadow-lg" 
                        : "text-muted-foreground hover:bg-sage/10 hover:text-sage"
                    )}
                  >
                    {m.toString().padStart(2, '0')}
                    {dateValue?.getMinutes() === m && <Check size={10} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-sage/10 flex justify-end">
                <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsOpen(false)}
                    className="h-8 px-4 text-[9px] font-black tracking-widest uppercase bg-sage text-white rounded-lg hover:bg-sage/90"
                >
                    {t("Set Time", "完了", "Xong")}
                </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
