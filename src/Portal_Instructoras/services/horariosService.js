import axios from "axios";

const API_URL =
  "https://macfer.crepesywaffles.com/api";

export const getHorariosSemana = async (
  documento,
  fechaInicio,
  fechaFin
) => {
  const url = `${API_URL}/horarios-instructoras?filters[documento][$eq]=${documento}&filters[fecha][$gte]=${fechaInicio}&filters[fecha][$lte]=${fechaFin}&pagination[pageSize]=40000`;

  const response = await axios.get(url);

  return response.data?.data || [];
};

export const getHorarios = async (documento, fechaInicio, fechaFin) => {
  const response = await axios.get(
    `${API_URL}/horarios-instructoras?filters[documento][$eq]=${documento}&filters[fecha][$gte]=${fechaInicio}&filters[fecha][$lte]=${fechaFin}`
  );

  return response.data;
};

export const crearHorario = async (data) => {
  return axios.post(`${API_URL}/horarios-instructoras`, data);
};

export const editarHorario = async (id, data) => {
  return axios.put(`${API_URL}/horarios-instructoras/${id}`, data);
};