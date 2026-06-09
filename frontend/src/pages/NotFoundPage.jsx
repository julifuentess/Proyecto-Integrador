import { Link } from "react-router-dom";

// Ruta comodín * para página no encontrada.
function NotFoundPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Página no encontrada</h1>
        <p className="muted">La ruta solicitada no existe.</p>
        <Link to="/reservas">Volver a reservas</Link>
      </section>
    </main>
  );
}

export default NotFoundPage;

