import React from "react";

export const LoadingSpinner = ({ text = "Loading...", className = "" }: { text?: string, className?: string }) => (
  <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
    <div className="w-10 h-10 border-4 border-sage/10 border-t-sage rounded-full animate-spin mb-4" />
    {text && (
      <p className="text-sage text-[10px] font-bold uppercase tracking-widest">
        {text}
      </p>
    )}
  </div>
);
