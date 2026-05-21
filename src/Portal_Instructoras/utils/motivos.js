export const motivosOptions = [
  {
    value: "retroalimentacion",
    label: "Retroalimentación",
  },

  {
    value: "acompanamiento",
    label: "Acompañamiento",
  },

  {
    value: "capacitacion",
    label: "Capacitación",
  },

  {
    value: "visita",
    label: "Visita",
  },

  {
    value: "induccion",
    label: "Inducción",
  },

  {
    value: "disponible",
    label: "Disponible",
  },

  {
    value: "viaje",
    label: "Viaje",
  },

  {
    value: "vacaciones",
    label: "Vacaciones",
  },

  {
    value: "incapacidad",
    label: "Incapacidad",
  },

  {
    value: "reunion",
    label: "Reunión",
  },

  {
    value: "escuela_cafe",
    label: "Escuela del Café",
  },

  {
    value: "sintonizarte",
    label: "Sintonizarte",
  },

  {
    value: "apoyo",
    label: "Apoyo",
  },

  {
    value: "pg",
    label: "P&G",
  },

  {
    value: "cambio_turno",
    label: "Cambio de Turno",
  },

  {
    value: "cubrir_puesto",
    label: "Cubrir Puesto",
  },

  {
    value: "otro",
    label: "Otro",
  },
];

/* =========================
   LABELS
========================= */

export const motivosLabels =
  motivosOptions.reduce(
    (acc, item) => {
      acc[item.value] =
        item.label;

      return acc;
    },
    {}
  );

/* =========================
   COLORS
========================= */

export const motivosColors = {
  Retroalimentación:
    "#10b981",

  Acompañamiento:
    "#3b82f6",

  Capacitación:
    "#8b5cf6",

  Visita:
    "#f59e0b",

  Inducción:
    "#06b6d4",

  Disponible:
    "#9ca3af",

  Viaje:
    "#ef4444",

  Vacaciones:
    "#14b8a6",

  Incapacidad:
    "#dc2626",

  Reunión:
    "#6366f1",

  "Escuela del Café":
    "#f97316",

  Sintonizarte:
    "#e11d48",

  Apoyo:
    "#0ea5e9",

  "P&G":
    "#8b5cf6",

  "Cambio de Turno":
    "#facc15",

  "Cubrir Puesto":
    "#84cc16",

  Otro:
    "#6b7280",
};

/* =========================
   GET COLOR
========================= */

export const getColorActividad =
  (actividad) => {
    return (
      motivosColors[
        actividad
      ] || "#6b7280"
    );
  };