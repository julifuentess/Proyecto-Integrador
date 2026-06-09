import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiError } from "../api/apiClient.js";
import Alert from "../components/Alert.jsx";
import Loading from "../components/Loading.jsx";
import ReservaForm from "../components/ReservaForm.jsx";
import { listAulas } from "../services/aulasService.js";
import { createReserva, getReserva, updateReserva } from "../services/reservasService.js";

// Pantalla única para alta y edición, con confirmación contra API.
function ReservaFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [aulas, setAulas] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const aulasData = await listAulas();
        setAulas(aulasData.filter((aula) => aula.activa));
        if (isEditing) {
          setInitialData(await getReserva(id));
        }
      } catch (apiError) {
        setError(getApiError(apiError));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEditing]);

  async function handleSubmit(data) {
    setError("");
    setSuccess("");
    try {
      const result = isEditing ? await updateReserva(id, data) : await createReserva(data);
      setSuccess(isEditing ? "Reserva actualizada correctamente" : "Reserva creada correctamente");
      navigate(`/reservas/${result.id}`);
    } catch (apiError) {
      setError(getApiError(apiError));
    }
  }

  if (loading) return <Loading />;

  return (
    <>
      <div className="page-title">
        <h1>{isEditing ? "Editar reserva" : "Nueva reserva"}</h1>
      </div>
      <Alert message={error} />
      <Alert message={success} type="success" />
      <ReservaForm
        aulas={aulas}
        initialData={initialData}
        onSubmit={handleSubmit}
        submitLabel={isEditing ? "Guardar cambios" : "Crear reserva"}
      />
    </>
  );
}

export default ReservaFormPage;

