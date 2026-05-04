export const formatearFecha = (year, month, dia) => {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
};

export const esDisponible = ({ inscripciones, esFestivo, bloqueada }) => {
  return inscripciones < 3 && !esFestivo && !bloqueada;
};