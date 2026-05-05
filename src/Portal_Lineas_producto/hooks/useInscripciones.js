import { useEffect, useState } from "react";
import { getInscripciones, deleteInscripcion } from "../services/inscripciones.service";

export const useInscripciones = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getInscripciones();
      setData(res);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    try {
      await deleteInscripcion(id);
      await fetchData();
    } catch (err) {
      console.error('Error eliminando inscripcion', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    refetch: fetchData,
    deleteInscripcion: remove
  };
};