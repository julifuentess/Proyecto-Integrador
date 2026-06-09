// Controles de página: el backend resuelve page y limit.
function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button type="button" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}>
        Anterior
      </button>
      <span>Página {pagination.page} de {pagination.totalPages}</span>
      <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)}>
        Siguiente
      </button>
    </div>
  );
}

export default Pagination;

