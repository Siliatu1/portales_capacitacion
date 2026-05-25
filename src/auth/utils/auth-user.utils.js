import { PROFILE_CONFIG, VIEW_ROUTES } from "../../shared/config/profiles.config";

const EMPTY_PROFILE_CONFIG = {
  views: [],
  permissions: {},
};

const PROFILE_ALIASES = {
  "CAPACITADORA(A)": "CAPACITADORA",
  "CAPACITADOR(A)": "CAPACITADORA",
  CAPACITADOR: "CAPACITADORA",
  "SUPER ADMIN": "SUPER_ADMIN",
};

const getRawProfile = (rawUser) => {
  return String(
    rawUser.perfil ||
      rawUser.profile ||
      rawUser.cargo_general ||
      rawUser.cargo ||
      ""
  )
    .trim()
    .toUpperCase();
};

const normalizeProfile = (rawProfile) => {
  const aliasedProfile = PROFILE_ALIASES[rawProfile] || rawProfile;

  if (aliasedProfile.includes("SUPER_ADMIN") || aliasedProfile.includes("SUPER ADMIN")) {
    return "SUPER_ADMIN";
  }

  if (/\bCAPACITADOR(?:A)?\b/.test(aliasedProfile)) {
    return "CAPACITADORA";
  }

  return aliasedProfile;
};

export const getProfileConfig = (profile) => {
  return PROFILE_CONFIG[profile] || EMPTY_PROFILE_CONFIG;
};

export const buildAuthenticatedUser = (rawUser) => {
  if (!rawUser) return null;

  const profile = normalizeProfile(getRawProfile(rawUser));
  const hasConfiguredProfile = Object.prototype.hasOwnProperty.call(PROFILE_CONFIG, profile);
  const profileConfig = getProfileConfig(profile);
  const views = hasConfiguredProfile ? profileConfig.views : rawUser.views || [];
  const permissions = hasConfiguredProfile ? profileConfig.permissions : rawUser.permissions || {};

  return {
    ...rawUser,
    perfil: profile,
    profile,
    views: [...views],
    permissions: {
      ...permissions,
    },
  };
};

export const canUserAccessView = (user, view) => {
  return Boolean(user?.views?.includes("*") || user?.views?.includes(view));
};

export const getDefaultRouteForUser = (user) => {
  if (!user) return "/";

  if (canUserAccessView(user, "PANEL")) {
    return VIEW_ROUTES.PANEL;
  }

  const firstAllowedView = user.views?.find((view) => VIEW_ROUTES[view]);
  return firstAllowedView ? VIEW_ROUTES[firstAllowedView] : "/menu";
};

export const getDefaultPortalInstructorasRoute = (user) => {
  if (!user) return "/";

  if (canUserAccessView(user, "ADMINISTRATIVO")) {
    return VIEW_ROUTES.ADMINISTRATIVO;
  }

  if (canUserAccessView(user, "PROGRAMACION")) {
    return VIEW_ROUTES.PROGRAMACION;
  }

  return getDefaultRouteForUser(user);
};
