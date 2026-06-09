import { useState } from "react";
import { getApiError } from "../api/apiClient.js";
import { aprobarReserva, cancelarReserva, rechazarReserva } from "../services/reservasService.js";
import Alert from "./Alert.jsx";

// Muestra acciones según rol y estado. El backend vuelve a validar permisos.
function ReservaActions({ reserva, user, onChanged }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.rol === "admin";
  const isOwner =
    reserva.usuarioId === user?.id ||
    reserva.usuario?.keycloakId === user?.keycloakId ||
    (user?.email && reserva.usuario?.email === user.email);
  const canCancel = (isAdmin || isOwner) && ["pendiente", "aprobada"].includes(reserva.estado);
  const canApproveOrReject = isAdmin && reserva.estado === "pendiente";

  async function runAction(action) {
    setLoading(true);
    setMessage("");
    try {
      const updated = await action(reserva.id);
      onChanged(updated);
    } catch (error) {
      setMessage(getApiError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2>Acciones</h2>
      <Alert message={message} />
      <div className="actions">
        {canCancel && (
          <button type="button" disabled={loading} onClick={() => runAction(cancelarReserva)}>
            Cancelar
          </button>
        )}
        {canApproveOrReject && (
          <>
            <button type="button" disabled={loading} onClick={() => runAction(aprobarReserva)}>
              Aprobar
            </button>
            <button type="button" className="danger" disabled={loading} onClick={() => runAction(rechazarReserva)}>
              Rechazar
            </button>
          </>
        )}
        {!canCancel && !canApproveOrReject && <p className="muted">No hay acciones disponibles para tu rol y este estado.</p>}
      </div>
    </section>
  );
}

export default ReservaActions;
