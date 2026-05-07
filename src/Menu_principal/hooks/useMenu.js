import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { getDefaultRouteForUser } from "../../auth/utils/auth-user.utils";
import { PORTAL_LINEAS_PRODUCTO_VIEWS } from "../../shared/config/profiles.config";
import { getMenu } from "../services/menu.service";

export const useMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user, canAccessView } = useAuth();

  const canAccessPortalLineasProducto = PORTAL_LINEAS_PRODUCTO_VIEWS.some((view) =>
    canAccessView(view)
  );

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await getMenu();
      const filteredMenu = data
        .filter((item) => item.route === "/lineas-producto" && canAccessPortalLineasProducto)
        .map((item) => ({
          ...item,
          route: getDefaultRouteForUser(user),
        }));

      setMenu(filteredMenu);
      setLoading(false);
    };

    fetchMenu();
  }, [canAccessPortalLineasProducto, user]);

  const goTo = (route) => {
    navigate(route);
  };

  return {
    menu,
    loading,
    goTo,
  };
};
