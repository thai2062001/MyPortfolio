import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AdminLoadingProps {
  message?: string;
  fullPage?: boolean;
}

export const AdminLoading = ({
  message = "Syncing Atmosphere...",
  fullPage = false,
}: AdminLoadingProps) => {
  const content = (
    <div className="py-24 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin"></div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
