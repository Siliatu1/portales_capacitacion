import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getInscripciones,
  deleteInscripcion,
  updateAsistencia,
} from "../services/inscripciones.service";

export const useInscripciones = ({
  pdv,
} = {}) => {
  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const fetchedRef = useRef(false);

  const fetchData = useCallback(
    async () => {
      try {
        setLoading(true);

        setError(null);

        console.log(
          "CONSULTANDO INSCRIPCIONES PDV:",
          pdv
        );

        const response =
          await getInscripciones({
            pdv,
          });

        console.log(
          "RESPUESTA INSCRIPCIONES:",
          response
        );

        setData(
          Array.isArray(response)
            ? response
            : []
        );
      } catch (err) {
        console.error(
          "ERROR FETCH INSCRIPCIONES:",
          err
        );

        setError(err);

        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [pdv]
  );

  const remove = async (
    id,
    endpoint
  ) => {
    try {
      setLoading(true);

      console.log(
        "ELIMINANDO INSCRIPCION:",
        id
      );

      await deleteInscripcion(
        id,
        endpoint
      );

      await fetchData();
    } catch (err) {
      console.error(
        "ERROR ELIMINANDO INSCRIPCION:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const setAsistencia = async (
    id,
    confirmado
  ) => {
    try {
      setLoading(true);

      console.log(
        "ACTUALIZANDO ASISTENCIA:",
        {
          id,
          confirmado,
        }
      );

      await updateAsistencia(
        id,
        confirmado
      );

      await fetchData();
    } catch (err) {
      console.error(
        "ERROR ACTUALIZANDO ASISTENCIA:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) {
      return;
    }

    fetchedRef.current = true;

    fetchData();
  }, [fetchData]);

  return {
    data,

    loading,

    error,

    refetch: fetchData,

    deleteInscripcion: remove,

    setAsistencia,
  };
}
