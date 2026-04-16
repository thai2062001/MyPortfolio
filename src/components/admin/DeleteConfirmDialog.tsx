import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName?: string;
  isLoading?: boolean;
}

export const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  isLoading = false,
  className,
}: DeleteConfirmDialogProps & { className?: string }) => {
  const { lang, translations } = useLang();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn("z-[1100]", className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {translations[lang].confirmDelete}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {itemName
              ? `${translations[lang].confirmDelete} "${itemName}"?`
              : translations[lang].confirmDelete}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {translations[lang].cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? translations[lang].saving : translations[lang].delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
