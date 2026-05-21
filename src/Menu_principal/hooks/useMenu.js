import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/hooks/useAuth";

import {
  getDefaultRouteForUser,
} from "../../auth/utils/auth-user.utils";

import {
  PORTAL_LINEAS_PRODUCTO_VIEWS,
} from "../../shared/config/profiles.config";

import { getMenu } from "../services/menu.service";

export const useMenu = () => {
  const [menu, setMenu] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const {
    user,
    canAccessView,
  } = useAuth();

  const canAccessPortalLineasProducto =
    PORTAL_LINEAS_PRODUCTO_VIEWS.some((view) =>
      canAccessView(view)
    );

  const canAccessPortalInstructoras =
    canAccessView("PROGRAMACION");

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getMenu();

      const filteredMenu = data.filter((item) => {
        // Portal líneas de producto
        if (
          item.route === "/lineas-producto" &&
          canAccessPortalLineasProducto
        ) {
          return true;
        }

        // Portal instructoras
        if (
          item.route === "/portal-instructoras" &&
          canAccessPortalInstructoras
        ) {
          return true;
        }

        return false;
      });

      const mappedMenu = filteredMenu.map((item) => {
        // Redirección automática para líneas-producto
        if (item.route === "/lineas-producto") {
          return {
            ...item,
            route: getDefaultRouteForUser(user),
          };
        }

        // Redirección automática para instructoras
        if (item.route === "/portal-instructoras") {
          return {
            ...item,
            route: "/portal-instructoras/dashboard",
          };
        }

        return item;
      });

      setMenu(mappedMenu);

      setLoading(false);
    };

    fetchMenu();
  }, [
    canAccessPortalLineasProducto,
    canAccessPortalInstructoras,
    user,
  ]);

  const goTo = (route) => {
    navigate(route);
  };

  return {
    menu,
    loading,
    goTo,
  };
};