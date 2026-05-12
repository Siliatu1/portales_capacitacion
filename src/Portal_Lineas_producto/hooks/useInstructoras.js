import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  actualizarEstado,
  actualizarObservacion,
  getEstudiantesInstructora,
} from "../services/panelInstructoras.service";

export const useInstructoras =
  ({
    nombreInstructora,
  }) => {
    const [
      data,
      setData,
    ] = useState([]);

    const [
      loading,
      setLoading,
    ] = useState(false);

    const [
      error,
      setError,
    ] = useState(null);

    const fetchData =
      useCallback(
        async () => {
          try {
            setLoading(true);

            setError(null);

            console.log(
              "CONSULTANDO INSTRUCTORA:",
              nombreInstructora
            );

            const response =
              await getEstudiantesInstructora(
                nombreInstructora
              );

            console.log(
              "ESTUDIANTES INSTRUCTORA:",
              response
            );

            setData(
              Array.isArray(
                response
              )
                ? response
                : []
            );
          } catch (
            err
          ) {
            console.error(
              "ERROR HOOK INSTRUCTORAS:",
              err
            );

            setError(
              err
            );

            setData([]);
          } finally {
            setLoading(false);
          }
        },
        [
          nombreInstructora,
        ]
      );

    const cambiarEstado =
      async (
        id,
        estado
      ) => {
        try {
          setLoading(true);

          await actualizarEstado(
            id,
            estado
          );

          await fetchData();
        } catch (
          error
        ) {
          console.error(
            "ERROR CAMBIANDO ESTADO:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    const guardarObservacion =
      async (
        id,
        observacion
      ) => {
        try {
          setLoading(true);

          await actualizarObservacion(
            id,
            observacion
          );

          await fetchData();
        } catch (
          error
        ) {
          console.error(
            "ERROR GUARDANDO OBSERVACION:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
      if (
        !nombreInstructora
      ) {
        return;
      }

      fetchData();
    }, [
      fetchData,
      nombreInstructora,
    ]);

    return {
      data,

      loading,

      error,

      refetch:
        fetchData,

      cambiarEstado,

      guardarObservacion,
    };
  };