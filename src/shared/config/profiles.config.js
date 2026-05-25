export const PROFILE_CONFIG = {
  TEAM_LEAD: {
    views: ["FORM_HELADERIA", "PANEL", "INSCRIPCIONES_CAFE"],

    permissions: {
      filterByPDV: true,
      canDelete: false,
      canViewAll: false,
      canViewEstadoObs: false,
      canBlockDates: false,
    },
  },

  ADMIN_GENERAL: {
    views: ["FORM_HELADERIA", "PANEL", "INSCRIPCIONES_CAFE"],

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
      "INSCRIPCIONES_CAFE",
      "INSCRIPCIONES_TODERA",
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
      "INSCRIPCIONES_CAFE",
      "INSCRIPCIONES_TODERA",
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
    "/portal-instructoras/vista-administrativa",

  GESTION_INSTRUCTORAS:
    "/lineas-producto/gestion-instructoras",

  INSCRIPCIONES_CAFE:
    "/lineas-producto/inscripciones/cafe",

  INSCRIPCIONES_TODERA:
    "/lineas-producto/inscripciones/todera",
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

  "INSCRIPCIONES_CAFE",

  "INSCRIPCIONES_TODERA",
];
