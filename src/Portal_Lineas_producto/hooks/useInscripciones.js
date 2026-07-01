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
  updateInscripcionFields,
} from "../services/inscripciones.service";

export const useInscripciones = ({
  pdv,
  endpoints,
  instructora,
} = {}) => {
  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const requestIdRef = useRef(0);

  const fetchData = useCallback(
    async () => {
      const requestId =
        requestIdRef.current + 1;

      requestIdRef.current =
        requestId;

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
            endpoints,
            instructora,
          });

        if (
          requestId !==
          requestIdRef.current
        ) {
          return;
        }

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
        if (
          requestId !==
          requestIdRef.current
        ) {
          return;
        }

        console.error(
          "ERROR FETCH INSCRIPCIONES:",
          err
        );

        setError(err);

        setData([]);
      } finally {
        if (
          requestId ===
          requestIdRef.current
        ) {
          setLoading(false);
        }
      }
    },
    [
      pdv,
      endpoints,
      instructora,
    ]
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
    confirmado,
    endpoint
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
        confirmado,
        endpoint
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

  const updateFields = async (
    id,
    fields,
    endpoint
  ) => {
    try {
      setLoading(true);

      await updateInscripcionFields(
        id,
        fields,
        endpoint
      );

      await fetchData();
    } catch (err) {
      console.error(
        "ERROR ACTUALIZANDO INSCRIPCION:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const setEstado = (
    id,
    estado,
    endpoint
  ) =>
    updateFields(
      id,
      {
        estado,
      },
      endpoint
    );

  const saveObservacion = (
    id,
    observacion,
    endpoint
  ) =>
    updateFields(
      id,
      {
        observacion,
      },
      endpoint
    );

  const setInstructora = (
    id,
    instructora,
    endpoint
  ) =>
    updateFields(
      id,
      {
        lider: instructora,
      },
      endpoint
    );

  useEffect(() => {
    queueMicrotask(fetchData);
  }, [fetchData]);

  return {
    data,

    loading,

    error,

    refetch: fetchData,

    deleteInscripcion: remove,

    setAsistencia,

    setEstado,

    saveObservacion,

    setInstructora,
  };
}
