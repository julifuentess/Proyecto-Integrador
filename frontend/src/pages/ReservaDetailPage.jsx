import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApiError } from "../api/apiClient.js";
import Alert from "../components/Alert.jsx";
import HistorialList from "../components/HistorialList.jsx";
import Loading from "../components/Loading.jsx";
import ReservaActions from "../components/ReservaActions.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getHistorial, getReserva } from "../services/reservasService.js";

// Detalle lee el id con useParams, requisito explícito del PDF.
function ReservaDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [reserva, setReserva] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDetail() {
    setLoading(true);
    setError("");
    try {
      const [reservaData, historialData] = await Promise.all([getReserva(id), getHistorial(id)]);
      setReserva(reservaData);
      setHistorial(historialData);
    } catch (apiError) {
      setError(getApiError(apiError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetail();
  }, [id]);

  function handleChanged(updated) {
    setReserva(updated);
    loadDetail();
  }

  const isOwner =
    reserva?.usuarioId === user?.id ||
    reserva?.usuario?.keycloakId === user?.keycloakId ||
    (user?.email && reserva?.usuario?.email === user.email);

  if (loading) return <Loading />;

  return (
    <>
      <Alert message={error} />
      {reserva && (
        <div className="detail-grid">
          <section className="panel">
            <div className="panel-header">
              <h1>{reserva.motivo}</h1>
              <span className={`badge ${reserva.estado}`}>{reserva.estado}</span>
            </div>
            <dl className="detail-list">
              <dt>Aula</dt>
              <dd>{reserva.aula?.nombre} · {reserva.aula?.ubicacion}</dd>
              <dt>Fecha</dt>
              <dd>{reserva.fecha}</dd>
              <dt>Horario</dt>
              <dd>{reserva.horaInicio} a {reserva.horaFin}</dd>
              <dt>Personas</dt>
              <dd>{reserva.cantidadPersonas}</dd>
              <dt>Solicitante</dt>
              <dd>{reserva.usuario?.nombre}</dd>
            </dl>
            {(user?.rol === "admin" || (isOwner && reserva.estado === "pendiente")) && (
              <Link className="button-link" to={`/reservas/${reserva.id}/editar`}>Editar reserva</Link>
            )}
          </section>
          <ReservaActions reserva={reserva} user={user} onChanged={handleChanged} />
          <section className="panel wide">
            <h2>Historial</h2>
            <HistorialList historial={historial} />
          </section>
        </div>
      )}
    </>
  );
}

export default ReservaDetailPage;
