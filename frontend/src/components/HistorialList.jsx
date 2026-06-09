// Historial de auditoría pedido por el enunciado para cada reserva.
function HistorialList({ historial }) {
  if (!historial.length) {
    return <p className="empty">Todavía no hay registros de historial.</p>;
  }

  return (
    <div className="timeline">
      {historial.map((item) => (
        <article key={item.id} className="timeline-item">
          <strong>{item.accion}</strong>
          <span>{new Date(item.fechaHora).toLocaleString()}</span>
          <span>{item.usuario?.nombre || item.usuarioId}</span>
          <pre>{JSON.stringify({ anterior: item.valorAnterior, nuevo: item.valorNuevo }, null, 2)}</pre>
        </article>
      ))}
    </div>
  );
}

export default HistorialList;

