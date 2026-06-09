import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Pantalla de login: redirige al formulario de Keycloak.
function LoginPage() {
  const { initializing, login } = useAuth();

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Ingresar</h1>
        <p className="muted">La autenticacion se realiza con Keycloak.</p>
        <button type="button" disabled={initializing} onClick={login}>
          Iniciar sesion con Keycloak
        </button>
        <Link to="/registro">Crear usuario en Keycloak</Link>
      </section>
    </main>
  );
}

export default LoginPage;

