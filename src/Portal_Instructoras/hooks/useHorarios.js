import { useState } from "react";

import {
  crearHorario,
  editarHorario,
  eliminarHorario,
  getHorarios,
} from "../services/horarios.service";

export const useHorarios = () => {
  /* =========================
     STATES
  ========================= */

  const [horarios, setHorarios] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  /* =========================
     GET
  ========================= */

  const cargarHorarios =
    async (
      documento,
      fechaInicio,
      fechaFin
    ) => {
      try {
        setLoading(true);

        setError(null);

        const data =
          await getHorarios(
            documento,
            fechaInicio,
            fechaFin
          );

        setHorarios(data);

        return data;
      } catch (err) {
        console.error(err);

        setError(
          "Error cargando horarios"
        );

        return [];
      } finally {
        setLoading(false);
      }
    };

  /* =========================
     CREATE
  ========================= */

  const guardarHorario =
    async (data) => {
      try {
        setLoading(true);

        const response =
          await crearHorario(
            data
          );

        return response;
      } catch (err) {
        console.error(err);

        setError(
          "Error creando horario"
        );

        throw err;
      } finally {
        setLoading(false);
      }
    };

  /* =========================
     UPDATE
  ========================= */

  const actualizarHorario =
    async (id, data) => {
      try {
        setLoading(true);

        const response =
          await editarHorario(
            id,
            data
          );

        return response;
      } catch (err) {
        console.error(err);

        setError(
          "Error actualizando horario"
        );

        throw err;
      } finally {
        setLoading(false);
      }
    };

  /* =========================
     DELETE
  ========================= */

  const borrarHorario =
    async (id) => {
      try {
        setLoading(true);

        const response =
          await eliminarHorario(
            id
          );

        return response;
      } catch (err) {
        console.error(err);

        setError(
          "Error eliminando horario"
        );

        throw err;
      } finally {
        setLoading(false);
      }
    };

  /* =========================
     RESET
  ========================= */

  const limpiarHorarios =
    () => {
      setHorarios([]);
    };

  return {
    horarios,

    loading,

    error,

    cargarHorarios,

    guardarHorario,

    actualizarHorario,

    borrarHorario,

    limpiarHorarios,
  };
};