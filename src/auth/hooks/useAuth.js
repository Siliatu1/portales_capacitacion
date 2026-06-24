import { useMemo, useSyncExternalStore } from "react";
import { authSession } from "../services/authSession";

export const useAuth = () => {
  const user = useSyncExternalStore(
    authSession.subscribe,
    authSession.getSnapshot,
    authSession.getServerSnapshot
  );

  return useMemo(
    () => ({
      user,
      validarUsuario: authSession.validarUsuario,
      logout: authSession.logout,
      canAccessView: authSession.canAccessView,
      hasPermission: authSession.hasPermission,
      getDefaultRouteForUser: authSession.getDefaultRouteForUser,
      getDefaultPortalInstructorasRoute:
        authSession.getDefaultPortalInstructorasRoute,
    }),
    [user]
  );
};
