import axios from "axios";

const API_URL =
  "https://macfer.crepesywaffles.com/api";

const PAGE_SIZE = 40000;

/* =========================
   HORARIOS
========================= */

export const getHorarios =
  async (
    documento,
    fechaInicio,
    fechaFin
  ) => {
    try {
      const url =
        `${API_URL}/horarios-instructoras` +
        `?filters[documento][$eq]=${documento}` +
        `&filters[fecha][$gte]=${fechaInicio}` +
        `&filters[fecha][$lte]=${fechaFin}` +
        `&pagination[pageSize]=${PAGE_SIZE}`;

      const response =
        await axios.get(url);

      return (
        response.data?.data ||
        []
      );
    } catch (error) {
      console.error(
        "ERROR GET HORARIOS:",
        error
      );

      return [];
    }
  };

export const crearHorario =
  async (data) => {
    try {
      const response =
        await axios.post(
          `${API_URL}/horarios-instructoras`,
          {
            data,
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "ERROR CREAR HORARIO:",
        error
      );

      throw error;
    }
  };

export const editarHorario =
  async (id, data) => {
    try {
      const response =
        await axios.put(
          `${API_URL}/horarios-instructoras/${id}`,
          {
            data,
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "ERROR EDITAR HORARIO:",
        error
      );

      throw error;
    }
  };

export const eliminarHorario =
  async (id) => {
    try {
      const response =
        await axios.delete(
          `${API_URL}/horarios-instructoras/${id}`
        );

      return response.data;
    } catch (error) {
      console.error(
        "ERROR ELIMINAR HORARIO:",
        error
      );

      throw error;
    }
  };

/* =========================
   INSTRUCTORAS
========================= */

export const getInstructoras =
  async () => {
    try {
      const url =
        `${API_URL}/cap-instructoras` +
        `?pagination[pageSize]=${PAGE_SIZE}`;

      const response =
        await axios.get(url);

      return (
        response.data?.data ||
        []
      );
    } catch (error) {
      console.error(
        "ERROR GET INSTRUCTORAS:",
        error
      );

      return [];
    }
  };

/* =========================
   PDVS
========================= */

export const getPuntosVenta =
  async (documento) => {
    try {
      const url =
        `${API_URL}/cap-instructoras` +
        `?filters[documento][$eq]=${documento}` +
        `&populate[cap_pdvs]=*`;

      const response =
        await axios.get(url);

      const data =
        response.data?.data ||
        [];

      if (!data.length) {
        return [];
      }

      const instructora =
        data[0];

      const pdvs =
        instructora.attributes
          ?.cap_pdvs?.data ||
        [];

      return pdvs
        .filter(
          (pdv) =>
            pdv.attributes
              ?.activo === true
        )
        .map((pdv) => ({
          id: pdv.id,

          nombre:
            pdv.attributes
              ?.nombre ||
            "Sin nombre",
        }))
        .sort((a, b) =>
          a.nombre.localeCompare(
            b.nombre
          )
        );
    } catch (error) {
      console.error(
        "ERROR GET PDVS:",
        error
      );

      return [];
    }
  };