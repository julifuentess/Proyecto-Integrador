// Panel de administración: reservas por estado, ocupación por aula y próximas reservas.
function ResumenAdmin({ resumen }) {
  return (
    <div className="summary-grid">
      <section className="panel">
        <h2>Reservas por estado</h2>
        <ul className="stat-list">
          {["pendiente", "aprobada", "rechazada", "cancelada"].map((estado) => (
            <li key={estado}>
              <span>{estado}</span>
              <strong>{resumen.porEstado?.[estado] || 0}</strong>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h2>Aulas más utilizadas</h2>
        <ul className="stat-list">
          {resumen.ocupacionPorAula?.map((aula) => (
            <li key={aula.aulaId}>
              <span>{aula.nombre}</span>
              <strong>{aula.cantidadReservas} reservas · {aula.ocupacionPromedio} pers. prom.</strong>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel wide">
        <h2>Próximas reservas</h2>
        {resumen.proximasDelDia?.length ? (
          <ul className="stat-list">
            {resumen.proximasDelDia.map((reserva) => (
              <li key={reserva.id}>
                <span>{reserva.fecha} · {reserva.horaInicio} a {reserva.horaFin} · {reserva.aula?.nombre}</span>
                <strong>{reserva.estado}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">No hay próximas reservas pendientes o aprobadas.</p>
        )}
      </section>
    </div>
  );
}

export default ResumenAdmin;

