import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../providers/useAuth.js";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div role="status">جاري التحقق من تسجيل الدخول...</div>;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/signIn" replace state={{ from: location }} />
  );
}
