import { useEffect, useState } from "react";

const emptyForm = {
  aulaId: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
  cantidadPersonas: "",
  motivo: ""
};

// Formulario transaccional para alta y edición contra la API.
function ReservaForm({ aulas, initialData, onSubmit, submitLabel }) {
  const [form, setForm] = useState(emptyForm);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        aulaId: initialData.aulaId,
        fecha: initialData.fecha,
        horaInicio: initialData.horaInicio,
        horaFin: initialData.horaFin,
        cantidadPersonas: initialData.cantidadPersonas,
        motivo: initialData.motivo
      });
    }
  }, [initialData]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function validateFrontend() {
    if (!form.aulaId || !form.fecha || !form.horaInicio || !form.horaFin || !form.cantidadPersonas || !form.motivo) {
      return "Completá todos los campos obligatorios";
    }
    if (form.horaInicio >= form.horaFin) {
      return "La hora de inicio debe ser menor que la hora de fin";
    }
    if (Number(form.cantidadPersonas) <= 0) {
      return "La cantidad de personas debe ser mayor a cero";
    }
    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    const error = validateFrontend();
    setLocalError(error);
    if (!error) {
      onSubmit({ ...form, cantidadPersonas: Number(form.cantidadPersonas) });
    }
  }

  return (
    <form className="form panel" onSubmit={handleSubmit}>
      {localError && <div className="alert error">{localError}</div>}
      <label>
        Aula
        <select name="aulaId" value={form.aulaId} onChange={updateField}>
          <option value="">Seleccionar aula</option>
          {aulas.map((aula) => (
            <option key={aula.id} value={aula.id}>
              {aula.nombre} · capacidad {aula.capacidad}
            </option>
          ))}
        </select>
      </label>
      <label>
        Fecha
        <input type="date" name="fecha" value={form.fecha} onChange={updateField} />
      </label>
      <div className="form-row">
        <label>
          Hora inicio
          <input type="time" name="horaInicio" value={form.horaInicio} onChange={updateField} />
        </label>
        <label>
          Hora fin
          <input type="time" name="horaFin" value={form.horaFin} onChange={updateField} />
        </label>
      </div>
      <label>
        Cantidad de personas
        <input type="number" min="1" name="cantidadPersonas" value={form.cantidadPersonas} onChange={updateField} />
      </label>
      <label>
        Motivo
        <textarea name="motivo" value={form.motivo} onChange={updateField} rows="4" />
      </label>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}

export default ReservaForm;

