import AppError from "../utils/AppError.js";

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return next(new AppError("No tenes permisos para realizar esta accion", 403));
    }
    next();
  };
}

export default requireRole;
