import { Link } from "react-router-dom";

// Tabla de reservas separada del contenedor para que el listado sea mantenible.
function ReservaTable({ reservas }) {
  if (!reservas.length) {
    return <p className="empty">No hay reservas para los filtros seleccionados.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Aula</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.fecha}</td>
              <td>{reserva.horaInicio} a {reserva.horaFin}</td>
              <td>{reserva.aula?.nombre || reserva.aulaId}</td>
              <td>{reserva.motivo}</td>
              <td><span className={`badge ${reserva.estado}`}>{reserva.estado}</span></td>
              <td><Link to={`/reservas/${reserva.id}`}>Ver</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservaTable;

