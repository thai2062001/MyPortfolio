import { motion } from "framer-motion";

const AdminSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="h-8 bg-black/5 rounded-lg w-48 animate-pulse" />
          <div className="h-4 bg-black/5 rounded-md w-64 animate-pulse" />
        </div>
        <div className="h-12 bg-black/5 rounded-2xl w-full md:w-40 animate-pulse" />
      </div>

      <div className="bg-white/50 backdrop-blur-xl border border-black/5 rounded-3xl p-6 space-y-4">
        <div className="h-10 bg-black/5 rounded-xl w-full animate-pulse" />
        <div className="space-y-2 pt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 items-center py-3 border-b border-black/[0.02]">
              <div className="w-12 h-12 bg-black/5 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-black/5 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-black/5 rounded w-1/4 animate-pulse" />
              </div>
              <div className="w-24 h-8 bg-black/5 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSkeleton;
