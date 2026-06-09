import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Protege rutas visuales: si falta sesión o rol, no deja navegar a la pantalla.
function ProtectedRoute({ children, role }) {
  const { initializing, isAuthenticated, user } = useAuth();

  if (initializing) {
    return <p className="muted">Validando sesion...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.rol !== role) {
    return <Navigate to="/reservas" replace />;
  }

  return children;
}

export default ProtectedRoute;
