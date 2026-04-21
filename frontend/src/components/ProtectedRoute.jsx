import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Requires any authenticated user
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: "white", padding: "40px" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Requires admin role specifically
export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div style={{ color: "white", padding: "40px" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
