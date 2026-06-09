import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Layout común para navegación autenticada.
function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/reservas">Reservas de aulas</Link>
        <nav className="nav">
          <NavLink to="/reservas">Reservas</NavLink>
          <NavLink to="/reservas/nueva">Nueva reserva</NavLink>
          {user?.rol === "admin" && <NavLink to="/admin/resumen">Resumen</NavLink>}
        </nav>
        <div className="session">
          <span>{user?.nombre} · {user?.rol}</span>
          <button type="button" className="secondary" onClick={handleLogout}>Salir</button>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

