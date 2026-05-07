import { PROFILE_CONFIG, VIEW_ROUTES } from "../../shared/config/profiles.config";

const EMPTY_PROFILE_CONFIG = {
  views: [],
  permissions: {},
};

export const getProfileConfig = (profile) => {
  return PROFILE_CONFIG[profile] || EMPTY_PROFILE_CONFIG;
};

export const buildAuthenticatedUser = (rawUser) => {
  if (!rawUser) return null;

  const profile = String(rawUser.perfil || rawUser.profile || "").trim().toUpperCase();
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
