import AppError from "../utils/AppError.js";

// Ejecuta una función de validación y transforma sus mensajes en error HTTP 400.
function validate(schemaFn) {
  return (req, res, next) => {
    const error = schemaFn(req);
    if (error) {
      return next(new AppError(error, 400));
    }
    next();
  };
}

export default validate;
