import { useAuthStatus } from "@/hooks/useAuth";
import { Navigate, Outlet } from "@tanstack/react-router";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-electric-500/30 border-t-electric-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
