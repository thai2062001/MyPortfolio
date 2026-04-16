import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session, loading, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      // Check Session Storage cache first to eliminate delay
      const cachedAdminStatus = sessionStorage.getItem(`is_admin_${user.id}`);
      if (cachedAdminStatus !== null) {
        setIsAdmin(cachedAdminStatus === "true");
        setCheckingAdmin(false);
        // We still fetch in background to verify, but don't block UI if cache exists
      }

      try {
        // Method 1: Call RPC function is_admin()
        const { data: isAdminRpc, error: rpcError } =
          await supabase.rpc("is_admin");

        let adminStatus = false;

        if (rpcError) {
          console.error("❌ RPC error:", rpcError);

          // Method 2: Fallback - Query profiles table directly
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (profileError) {
            console.error("❌ Profile query error:", profileError);
            adminStatus = false;
          } else {
            adminStatus = profile?.role === "admin";
          }
        } else {
          adminStatus = isAdminRpc === true;
        }

        setIsAdmin(adminStatus);
        sessionStorage.setItem(`is_admin_${user.id}`, String(adminStatus));
      } catch (error) {
        console.error("❌ Error checking admin role:", error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (!loading) {
      checkAdminRole();
    }
  }, [user, loading]);

  if (loading || checkingAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            Your account ({user.email}) does not have administrative privileges.
          </p>
          <p className="text-xs text-gray-400 mb-6">User ID: {user.id}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-sage text-white py-2 rounded-lg font-medium hover:bg-sage/90 transition-colors"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
