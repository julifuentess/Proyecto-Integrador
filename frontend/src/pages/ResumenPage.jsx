import { useEffect, useState } from "react";
import { getApiError } from "../api/apiClient.js";
import Alert from "../components/Alert.jsx";
import Loading from "../components/Loading.jsx";
import ResumenAdmin from "../components/ResumenAdmin.jsx";
import { getResumen } from "../services/reservasService.js";

// Panel protegido para rol admin.
function ResumenPage() {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        setResumen(await getResumen());
      } catch (apiError) {
        setError(getApiError(apiError));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <div className="page-title">
        <h1>Resumen administrativo</h1>
      </div>
      <Alert message={error} />
      {loading ? <Loading /> : resumen && <ResumenAdmin resumen={resumen} />}
    </>
  );
}

export default ResumenPage;

