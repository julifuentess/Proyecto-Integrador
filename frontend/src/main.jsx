import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { initKeycloak } from "./auth/keycloak.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles.css";

// Keycloak se inicializa antes del router para que pueda procesar el redirect de login.
initKeycloak().finally(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
});

