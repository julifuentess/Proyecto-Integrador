import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ReservasPage from "./pages/ReservasPage.jsx";
import ReservaDetailPage from "./pages/ReservaDetailPage.jsx";
import ReservaFormPage from "./pages/ReservaFormPage.jsx";
import ResumenPage from "./pages/ResumenPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// App define todas las rutas mínimas solicitadas por el PDF.
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/reservas" replace />} />
        <Route
          path="/reservas"
          element={
            <ProtectedRoute>
              <ReservasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas/nueva"
          element={
            <ProtectedRoute>
              <ReservaFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas/:id"
          element={
            <ProtectedRoute>
              <ReservaDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas/:id/editar"
          element={
            <ProtectedRoute>
              <ReservaFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/resumen"
          element={
            <ProtectedRoute role="admin">
              <ResumenPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

