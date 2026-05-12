import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./auth-context";
import { buildAuthenticatedUser, canUserAccessView } from "../utils/auth-user.utils";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(buildAuthenticatedUser(parsed));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = useCallback((userData) => {
    const authenticatedUser = buildAuthenticatedUser(userData);
    setUser(authenticatedUser);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("pdv");
    localStorage.removeItem("puntoVenta");
  }, []);

  const canAccessView = useCallback((view) => {
    return canUserAccessView(user, view);
  }, [user]);

  const hasPermission = useCallback((permission) => {
    return Boolean(user?.permissions?.[permission]);
  }, [user]);

  const value = {
    user,
    login,
    logout,
    canAccessView,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
