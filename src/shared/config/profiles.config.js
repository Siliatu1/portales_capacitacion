export const PROFILE_CONFIG = {
  TEAM_LEAD: {
    views: ["FORM_HELADERIA", "PANEL"],

    permissions: {
      filterByPDV: true,
      canDelete: false,
      canViewAll: false,
      canViewEstadoObs: false,
    },
  },

  ADMIN_GENERAL: {
    views: ["FORM_HELADERIA", "PANEL"],

    permissions: {
      filterByPDV: false,
      canDelete: true,
      canViewAll: true,
      canViewEstadoObs: true,
    },
  },

  FIELD_USER: {
    views: ["FORM_RESTAURANTE", "PANEL"],

    permissions: {
      filterByPDV: true,
      canDelete: false,
      canViewAll: false,
      canViewEstadoObs: true,
    },
  },

  SUPER_ADMIN: {
    views: ["*"],

    permissions: {
      filterByPDV: false,
      canDelete: true,
      canViewAll: true,
      canViewEstadoObs: true,
    },
  },

  CAPACITADORA: {
    views: ["CONTROL_ASISTENCIA"],

    permissions: {
      filterByPDV: false,
      canDelete: false,
      canViewAll: false,
      canViewEstadoObs: false,
    },
  },
};

export const VIEW_ROUTES = {
  PANEL: "/lineas-producto",
  FORM_HELADERIA: "/lineas-producto/form-heladeria",
  FORM_RESTAURANTE: "/lineas-producto/form-restaurante",
  CONTROL_ASISTENCIA: "/lineas-producto/control-asistencia",
  FORM_TODERA: "/lineas-producto/form-todera",
};

export const PORTAL_LINEAS_PRODUCTO_VIEWS = [
  "PANEL",
  "FORM_HELADERIA",
  "FORM_RESTAURANTE",
  "CONTROL_ASISTENCIA",
  "FORM_TODERA",
];
