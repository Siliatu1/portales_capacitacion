import axios from "axios";

export const obtenerInstructora = async (
  puntoVenta,
  categoria
) => {

  const pdvEncoded = encodeURIComponent(puntoVenta);

  const url = `
  https://macfer.crepesywaffles.com/api/cap-pdvs
  ?filters[cap_instructoras][${categoria}][$eq]=true
  &filters[nombre][$eq]=${pdvEncoded}
  &populate[cap_instructoras][filters][${categoria}][$eq]=true
  `;

  const response = await axios.get(url);

  const instructoras =
    response.data?.data?.[0]?.attributes?.cap_instructoras?.data;

  if (!instructoras?.length) return null;

  return instructoras[0]?.attributes?.Nombre || null;
};