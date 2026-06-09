// Convierte "HH:mm" a minutos para comparar horarios sin depender de objetos Date.
export function toMinutes(time) {
  const [hours, minutes] = String(time).split(":").map(Number);
  return hours * 60 + minutes;
}

// Valida el formato simple requerido para las franjas horarias del TP.
export function isTimeFormat(time) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(time));
}

// Dos franjas se superponen si una empieza antes de que termine la otra y termina después de que empieza la otra.
export function overlaps(startA, endA, startB, endB) {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(endA) > toMinutes(startB);
}
