import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { buildAuthenticatedUser, canUserAccessView } from "../utils/auth-user.utils";

const USER_STORAGE_KEY = "user";

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    console.error("AUTH STORAGE ERROR:", error);
    return null;
  }
};

const persistUser = (user) => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(USER_STORAGE_KEY);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => buildAuthenticatedUser(getStoredUser()));

  const login = useCallback((rawUser) => {
    const authenticatedUser = buildAuthenticatedUser(rawUser);
    setUser(authenticatedUser);
    persistUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, []);

  const canAccessView = useCallback(
    (view) => canUserAccessView(user, view),
    [user]
  );

  const hasPermission = useCallback(
    (permission) => Boolean(user?.permissions?.[permission]),
    [user?.permissions]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      canAccessView,
      hasPermission,
    }),
    [canAccessView, hasPermission, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
