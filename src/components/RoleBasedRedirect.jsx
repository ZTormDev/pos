import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRedirect = () => {
  const { user } = useAuth();

  // Redirigir según el rol del usuario
  if (user?.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  } else if (user?.role === "cashier") {
    return <Navigate to="/sales" replace />;
  }

  // Por defecto redirigir a ventas
  return <Navigate to="/sales" replace />;
};

export default RoleBasedRedirect;
