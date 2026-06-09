import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Registro real delegado a Keycloak. El realm debe tener registrationAllowed=true.
function RegisterPage() {
  const { initializing, register } = useAuth();

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Registro</h1>
        <p className="muted">Keycloak administra usuarios, contrasenas y roles.</p>
        <button type="button" disabled={initializing} onClick={register}>
          Registrarme en Keycloak
        </button>
        <Link to="/login">Ya tengo usuario</Link>
      </section>
    </main>
  );
}

export default RegisterPage;

