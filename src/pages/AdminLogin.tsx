import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminLogin = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      // Wait for a small animation beat
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Security protocol mismatch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FCFAF7] overflow-hidden selection:bg-sage/20">
      {/* Left Panel: The Visual Identity */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-heading">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="/login_editorial_bg_1775908584167.png" 
            alt="Editorial Backdrop" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-heading via-heading/20 to-transparent opacity-80" />
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 text-white/90"
          >
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
               <ShieldCheck size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Curated Matrix v2.0</span>
          </motion.div>

          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-sage text-xs font-black uppercase tracking-[0.4em] leading-relaxed"
            >
              Strategic Narrative Access
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-6xl xl:text-8xl font-serif font-bold text-white tracking-tighter leading-[0.9]"
            >
              The <br/>
              Perspective.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-8 border-t border-white/10 flex items-center justify-between"
          >
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Ownership</p>
               <p className="text-sm font-serif italic text-white/80">Thái Phạm</p>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Specialization</p>
               <p className="text-sm font-serif italic text-white/80">Senior Marketing Strategy</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: The Authentication Interface */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sage/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-vibe-pink/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm space-y-12 relative z-10"
        >
          <div className="text-center md:text-left space-y-4">
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-xl shadow-black/5 mb-2"
            >
               <Sparkles className="text-sage" size={24} />
            </motion.div>
            <h1 className="text-4xl font-serif font-bold text-heading tracking-tight leading-tight">
              Welcome back, <br/>
              <span className="italic text-sage">Ms. Hải Yến</span>
            </h1>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
              Elevating the Digital Portfolio Narrative
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                  Encrypted Identifier
                </label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-sage transition-all" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-14 pr-6 py-5 bg-white border border-black/[0.03] rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-sage/5 focus:border-sage/20 transition-all font-medium text-sm placeholder:text-muted-foreground/30 placeholder:uppercase placeholder:text-[9px] placeholder:tracking-widest"
                    placeholder="ENTER YOUR EMAIL"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                  Security Protocol
                </label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-sage transition-all" size={16} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-14 pr-6 py-5 bg-white border border-black/[0.03] rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-sage/5 focus:border-sage/20 transition-all font-medium text-sm placeholder:text-muted-foreground/30 placeholder:uppercase placeholder:text-[9px] placeholder:tracking-widest"
                    placeholder="SECURE ACCESS KEY"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 text-red-600 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-red-100"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-heading text-white h-20 rounded-[1.8rem] font-bold shadow-2xl shadow-heading/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-4 overflow-hidden group relative"
            >
              <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.3em]">
                {loading ? "Synchronizing Matrix..." : "Authorize Experience"}
              </span>
              {!loading && (
                <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={16} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-sage/0 via-sage/20 to-sage/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </form>

          <div className="pt-8 border-t border-black/[0.03] flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
             <div className="flex items-center gap-2">
                <Heart size={8} className="fill-current text-sage/30" />
                <span>Private Curator Interface</span>
             </div>
             <span>Build v2.4.0</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
