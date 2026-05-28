import { inscripcionEstadoLabel } from "./estadoInscripcion.utils";

const getDateOnly = (value) => String(value || "").split("T")[0];

const hasValues = (value) => (
  Array.isArray(value)
    ? value.length > 0
    : Boolean(value)
);

const includesAny = (value, selectedValues, exact = false) => {
  if (!hasValues(selectedValues)) {
    return true;
  }

  const normalizedValue = String(value || "").toLowerCase();
  const values = Array.isArray(selectedValues) ? selectedValues : [selectedValues];

  return values.some((selectedValue) => {
    const normalizedSelected = String(selectedValue || "").toLowerCase();

    return exact
      ? normalizedValue === normalizedSelected
      : normalizedValue.includes(normalizedSelected);
  });
};

export const filtrarInscripciones = (data, filtros) => {
  return data.filter(item => {
    const puntoVenta = item.area_nombre || item.puntoVenta || "";
    const instructora = item.instructora || item.lider || "";

    return (
      (!filtros.cedula || item.cedula?.includes(filtros.cedula)) &&
      includesAny(puntoVenta, filtros.puntoVenta) &&
      includesAny(getDateOnly(item.dia), filtros.fecha, true) &&
      includesAny(instructora, filtros.instructora) &&
      includesAny(inscripcionEstadoLabel(item), filtros.estado, true) &&
      (!filtros.lider || item.lider?.toLowerCase().includes(filtros.lider.toLowerCase())) &&
      (!filtros.formulario || filtros.formulario === 'todos' || (item.tipo_formulario || '').toLowerCase() === filtros.formulario.toLowerCase())
    );
  });
};
