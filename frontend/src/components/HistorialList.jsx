// Historial de auditoría pedido por el enunciado para cada reserva.
// Historial de auditoría de reservas

function HistorialList({ historial }) {
  if (!historial || historial.length === 0) {
    return <p className="empty">Todavía no hay registros de historial.</p>;
  }

  return (
    <div className="timeline">
      {historial.map((item) => (
        <article key={item.id} className="timeline-item">

          {/* Acción */}
          <strong>{item.accion}</strong>

          {/* Fecha */}
          <span>
            {new Date(item.fechaHora).toLocaleString()}
          </span>

          {/* Usuario que realizó la acción */}
          <span>
            {item.usuario?.nombre || item.usuario?.email || item.usuarioId}
          </span>

          {/* Detalle legible (NO JSON) */}
          <div className="historial-detalle">

            {/* Caso: creación */}
            {item.accion === "creacion" && (
              <div>
                <p><strong>Reserva creada</strong></p>

                {item.valorNuevo && (
                  <>
                    <p>Aula: {item.valorNuevo.aulaId}</p>
                    <p>Fecha: {item.valorNuevo.fecha}</p>
                    <p>Horario: {item.valorNuevo.horaInicio} → {item.valorNuevo.horaFin}</p>
                    <p>Personas: {item.valorNuevo.cantidadPersonas}</p>
                    <p>Motivo: {item.valorNuevo.motivo}</p>
                    <p>Estado: {item.valorNuevo.estado}</p>
                  </>
                )}
              </div>
            )}

            {/* Caso: edición */}
            {item.accion === "edicion" && (
              <div>
                <p><strong>Edición de reserva</strong></p>

                {item.valorAnterior && item.valorNuevo && (
                  <>
                    <p>
                      Estado:{" "}
                      <strong>
                        {item.valorAnterior.estado} → {item.valorNuevo.estado}
                      </strong>
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Caso: aprobación */}
            {item.accion === "aprobacion" && (
              <p>
                Estado:{" "}
                <strong>
                  {item.valorAnterior?.estado} → {item.valorNuevo?.estado}
                </strong>
              </p>
            )}

            {/* Caso: rechazo */}
            {item.accion === "rechazo" && (
              <p>
                Estado:{" "}
                <strong>
                  {item.valorAnterior?.estado} → {item.valorNuevo?.estado}
                </strong>
              </p>
            )}

            {/* Caso: cancelación */}
            {item.accion === "cancelacion" && (
              <p>
                Estado:{" "}
                <strong>
                  {item.valorAnterior?.estado} → {item.valorNuevo?.estado}
                </strong>
              </p>
            )}

          </div>
        </article>
      ))}
    </div>
  );
}

export default HistorialList;

