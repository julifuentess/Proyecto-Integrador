// Filtros combinables: fecha, estado, aula, texto, paginación y ordenamiento.
function ReservaFilters({ aulas, filters, onChange, onSubmit }) {
  function updateField(event) {
    onChange({ ...filters, [event.target.name]: event.target.value, page: 1 });
  }

  return (
    <form className="filters" onSubmit={onSubmit}>
      <label>
        Fecha
        <input type="date" name="fecha" value={filters.fecha} onChange={updateField} />
      </label>
      <label>
        Estado
        <select name="estado" value={filters.estado} onChange={updateField}>
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobada">Aprobada</option>
          <option value="rechazada">Rechazada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </label>
      <label>
        Aula
        <select name="aulaId" value={filters.aulaId} onChange={updateField}>
          <option value="">Todas</option>
          {aulas.map((aula) => (
            <option key={aula.id} value={aula.id}>{aula.nombre}</option>
          ))}
        </select>
      </label>
      <label>
        Motivo
        <input name="q" value={filters.q} onChange={updateField} placeholder="Buscar texto" />
      </label>
      <label>
        Ordenar por
        <select name="sortBy" value={filters.sortBy} onChange={updateField}>
          <option value="createdAt">Creación</option>
          <option value="fecha">Fecha</option>
          <option value="horaInicio">Hora inicio</option>
          <option value="estado">Estado</option>
          <option value="cantidadPersonas">Personas</option>
        </select>
      </label>
      <label>
        Orden
        <select name="order" value={filters.order} onChange={updateField}>
          <option value="desc">Descendente</option>
          <option value="asc">Ascendente</option>
        </select>
      </label>
      <button type="submit">Aplicar filtros</button>
    </form>
  );
}

export default ReservaFilters;

