import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import DashboardLayout from "../layout/DashboardLayout";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="protected-loading" role="status" aria-label="Loading account"><LoaderCircle size={23} /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <DashboardLayout>
      {children ? children : <Outlet />}
    </DashboardLayout>
  );
};

export default ProtectedRoute;