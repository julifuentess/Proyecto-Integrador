// Validación de registro: evita datos incompletos antes de llegar al servicio.
function validateRegister(req) {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password) {
    return "Nombre, email y contraseña son obligatorios";
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return "El email no tiene un formato válido";
  }
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres";
  }
  if (rol && !["usuario", "admin"].includes(rol)) {
    return "El rol indicado no es válido";
  }
  return null;
}

// Validación de login: exige credenciales antes de buscar el usuario.
function validateLogin(req) {
  const { email, password } = req.body;
  if (!email || !password) {
    return "Email y contraseña son obligatorios";
  }
  return null;
}

export { validateLogin, validateRegister };
