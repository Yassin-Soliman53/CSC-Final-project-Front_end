import { Navigate, Outlet } from "react-router";
import { useAuth } from "../providers/AuthProvider.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? <Navigate to="/signIn" replace /> : <Outlet />;
}
