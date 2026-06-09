// AppError permite enviar al middleware de errores un mensaje y un status HTTP concretos.
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

export default AppError;
