import {
  buildAuthenticatedUser,
  canUserAccessView,
  getDefaultPortalInstructorasRoute,
  getDefaultRouteForUser,
} from "../utils/auth-user.utils";

const USER_STORAGE_KEY = "user";
const STORAGE_KEYS_TO_CLEAR_ON_LOGOUT = [
  USER_STORAGE_KEY,
  "pdv",
  "puntoVenta",
];

const listeners = new Set();

const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return buildAuthenticatedUser(JSON.parse(storedUser));
  } catch {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

let currentUser = getStoredUser();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const persistUser = (userData) => {
  if (typeof window === "undefined") return;

  if (userData) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    return;
  }

  STORAGE_KEYS_TO_CLEAR_ON_LOGOUT.forEach((key) => {
    window.localStorage.removeItem(key);
  });
};

const setUser = (userData, { persist = true } = {}) => {
  currentUser = buildAuthenticatedUser(userData);

  if (persist) {
    persistUser(userData);
  }

  notify();
  return currentUser;
};

const clearUser = () => {
  currentUser = null;
  persistUser(null);
  notify();
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== USER_STORAGE_KEY) return;

    currentUser = getStoredUser();
    notify();
  });
}

export const authSession = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return currentUser;
  },
  getServerSnapshot() {
    return null;
  },
  getUser() {
    return currentUser;
  },
  validarUsuario(userData) {
    return setUser(userData);
  },
  hydrate(userData) {
    return setUser(userData, { persist: false });
  },
  logout() {
    clearUser();
  },
  canAccessView(view) {
    return canUserAccessView(currentUser, view);
  },
  hasPermission(permission) {
    return Boolean(currentUser?.permissions?.[permission]);
  },
  getDefaultRouteForUser() {
    return getDefaultRouteForUser(currentUser);
  },
  getDefaultPortalInstructorasRoute() {
    return getDefaultPortalInstructorasRoute(currentUser);
  },
};
