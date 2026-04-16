import AdminLayout from "@/components/admin/AdminLayout";
import ToolItemsManagementPage from "./ToolItemsManagement";

const ToolItemsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif text-heading tracking-tight">
              Technical Tools
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base max-w-2xl">
              Display the specialized software and technologies that power your workflow and drive measurable results.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-sage/5 rounded-full border border-sage/10 shadow-sm">
            <span className="w-2 h-2 bg-sage rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-sage/80">Active Section</span>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-6 md:p-8 shadow-xl">
          <ToolItemsManagementPage />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ToolItemsPage;
