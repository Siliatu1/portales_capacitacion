
import { MENU_ROUTES } from "./menu.routes";

export const mapMenuData = (data = []) => {
  return data.map((item) => {
    const titulo = item.attributes?.titulo || "";

    return {
      id: item.id,
      title: titulo,
      description: item.attributes?.descripcion || "",

      // 🔥 asignamos ruta desde config
      route: MENU_ROUTES[titulo] || "/"
    };
  });
};