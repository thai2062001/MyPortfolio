import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-sage group-[.toaster]:text-white group-[.toaster]:border-sage/20 group-[.toaster]:shadow-[0_25px_50px_rgba(0,120,80,0.25)] group-[.toaster]:rounded-full group-[.toaster]:px-12 group-[.toaster]:py-6 group-[.toaster]:font-serif group-[.toaster]:font-black group-[.toaster]:text-base group-[.toaster]:flex group-[.toaster]:justify-center group-[.toaster]:items-center group-[.toaster]:gap-5 group-[.toaster]:min-w-[400px] animate-in fade-in slide-in-from-top-10 duration-500",
          description: "group-[.toast]:text-white/80 group-[.toast]:font-medium group-[.toast]:text-[13px] group-[.toast]:text-center",
          actionButton: "group-[.toast]:bg-white group-[.toast]:text-sage group-[.toast]:rounded-full font-black uppercase tracking-widest text-[11px] px-8 h-12",
          cancelButton: "group-[.toast]:bg-black/20 group-[.toast]:text-white group-[.toast]:rounded-full group-[.toast]:font-bold",
          success: "group-[.toast]:bg-sage group-[.toast]:text-white [&_[data-icon]]:text-white [&_[data-icon]]:bg-white/20 [&_[data-icon]]:p-2 [&_[data-icon]]:rounded-full",
          error: "group-[.toast]:bg-red-500 group-[.toast]:text-white group-[.toast]:border-none [&_[data-icon]]:text-white",
          info: "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
