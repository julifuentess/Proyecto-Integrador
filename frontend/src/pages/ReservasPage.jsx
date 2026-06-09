import { useEffect, useState } from "react";
import { getApiError } from "../api/apiClient.js";
import Alert from "../components/Alert.jsx";
import Loading from "../components/Loading.jsx";
import Pagination from "../components/Pagination.jsx";
import ReservaFilters from "../components/ReservaFilters.jsx";
import ReservaTable from "../components/ReservaTable.jsx";
import { listAulas } from "../services/aulasService.js";
import { listReservas } from "../services/reservasService.js";

const initialFilters = {
  fecha: "",
  estado: "",
  aulaId: "",
  q: "",
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  order: "desc"
};

// Listado principal con filtros combinables resueltos por backend.
function ReservasPage() {
  const [aulas, setAulas] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [reservas, setReservas] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData(params = filters) {
    setLoading(true);
    setError("");
    try {
      const [aulasData, reservasData] = await Promise.all([listAulas(), listReservas(params)]);
      setAulas(aulasData);
      setReservas(reservasData.data);
      setPagination(reservasData.pagination);
    } catch (apiError) {
      setError(getApiError(apiError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    loadData(filters);
  }

  function handlePageChange(page) {
    const nextFilters = { ...filters, page };
    setFilters(nextFilters);
    loadData(nextFilters);
  }

  return (
    <>
      <div className="page-title">
        <h1>Reservas</h1>
      </div>
      <ReservaFilters aulas={aulas} filters={filters} onChange={setFilters} onSubmit={handleSubmit} />
      <Alert message={error} />
      {loading ? <Loading /> : <ReservaTable reservas={reservas} />}
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </>
  );
}

export default ReservasPage;

