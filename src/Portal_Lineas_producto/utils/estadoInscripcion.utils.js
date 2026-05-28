import { asistenciaLabel } from "./asistencia.utils";

export const evaluacionEstadoLabel = (value) => {
  if (value === true || value === 1) {
    return "Aprobado";
  }

  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  return [
    "true",
    "1",
    "aprobado",
    "aprobada",
    "evaluado",
    "evaluada",
    "certificado",
    "certificada",
  ].includes(normalized)
    ? "Aprobado"
    : "Pendiente";
};

export const inscripcionEstadoLabel = (
  item
) => {
  const isTodera =
    item?.sourceEndpoint ===
      "cap-toderas" ||
    String(
      item?.tipo_formulario || ""
    )
      .toLowerCase()
      .includes("todera");

  if (isTodera) {
    return evaluacionEstadoLabel(
      item?.estado
    );
  }

  return asistenciaLabel(
    item?.asistencia
  );
};
