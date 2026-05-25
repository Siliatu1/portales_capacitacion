export const PROFILE_CONFIG = {
  TEAM_LEAD: {
    views: ["FORM_HELADERIA", "PANEL"],

    permissions: {
      filterByPDV: true,
      canDelete: false,
      canViewAll: false,
      canViewEstadoObs: false,
      canBlockDates: false,
    },
  },

  ADMIN_GENERAL: {
    views: ["FORM_HELADERIA", "PANEL"],

    permissions: {
      filterByPDV: false,
      canDelete: true,
      canViewAll: true,
      canViewEstadoObs: true,
      canBlockDates: true,
    },
  },

  FIELD_USER: {
    views: [
      "FORM_RESTAURANTE",
      "PANEL",
      "FORM_TODERA",
    ],

    permissions: {
      filterByPDV: true,
      canDelete: false,
      canViewAll: false,
      canViewEstadoObs: true,
      canBlockDates: false,
    },
  },

  SUPER_ADMIN: {
    views: [
      "PANEL",
      "FORM_HELADERIA",
      "FORM_RESTAURANTE",
      "FORM_TODERA",
      "PANELINSTRUCTORA",
      "PROGRAMACION",
      "ADMINISTRATIVO",
      "GESTION_INSTRUCTORAS",
    ],

    permissions: {
      filterByPDV: false,
      canDelete: true,
      canViewAll: true,
      canViewEstadoObs: true,
      canBlockDates: true,
    },
  },

  CAPACITADORA: {
    views: [
      "CONTROL_ASISTENCIA",
      "PANELINSTRUCTORA",
      "PROGRAMACION",
    ],

    permissions: {
      filterByPDV: false,
      canDelete: false,
      canViewAll: false,
      canViewEstadoObs: false,
      canBlockDates: false,
    },
  },
};

export const VIEW_ROUTES = {
  PANEL: "/lineas-producto",

  FORM_HELADERIA:
    "/lineas-producto/form-heladeria",

  FORM_RESTAURANTE:
    "/lineas-producto/form-restaurante",

  CONTROL_ASISTENCIA:
    "/lineas-producto/control-asistencia",

  FORM_TODERA:
    "/lineas-producto/form-todera",

  PANELINSTRUCTORA:
    "/lineas-producto/panel-instructora",

  PROGRAMACION:
    "/portal-instructoras/dashboard",

  ADMINISTRATIVO:
    "/portal-instructoras/administrativo",

  GESTION_INSTRUCTORAS:
    "/lineas-producto/gestion-instructoras",
};

export const PORTAL_LINEAS_PRODUCTO_VIEWS = [
  "PANEL",

  "FORM_HELADERIA",

  "FORM_RESTAURANTE",

  "CONTROL_ASISTENCIA",

  "FORM_TODERA",

  "PANELINSTRUCTORA",

  "PROGRAMACION",

  "ADMINISTRATIVO",

  "GESTION_INSTRUCTORAS",
];
