// Muestra errores o éxitos de API en una zona visible.
function Alert({ message, type = "error" }) {
  if (!message) return null;
  return <div className={`alert ${type}`}>{message}</div>;
}

export default Alert;

