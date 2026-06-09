import { createContext, useContext, useEffect, useState } from "react";
import keycloak, { getUserFromToken, initKeycloak } from "../auth/keycloak.js";

const AuthContext = createContext(null);

// Keycloak conserva la sesion. La app solo guarda en estado el usuario y el rol.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function startKeycloak() {
      try {
        const authenticated = await initKeycloak();
        setUser(authenticated ? getUserFromToken() : null);

        keycloak.onAuthSuccess = () => setUser(getUserFromToken());
        keycloak.onAuthRefreshSuccess = () => setUser(getUserFromToken());
        keycloak.onAuthLogout = () => setUser(null);
      } finally {
        setInitializing(false);
      }
    }

    startKeycloak();
  }, []);

  function login() {
    return keycloak.login({ redirectUri: `${window.location.origin}/reservas` });
  }

  function register() {
    return keycloak.register({ redirectUri: `${window.location.origin}/reservas` });
  }

  function logout() {
    return keycloak.logout({ redirectUri: `${window.location.origin}/login` });
  }

  return (
    <AuthContext.Provider
      value={{
        initializing,
        isAuthenticated: Boolean(user),
        login,
        logout,
        register,
        token: keycloak.token,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

