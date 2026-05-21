
import { MENU_ROUTES } from "./menu.routes";

export const mapMenuData = (data = []) => {
  return data.map((item) => {
    const titulo =
      item.attributes?.titulo || "";

    return {
      id: item.id,

      title: titulo,

      description:
        item.attributes?.descripcion || "",

      route:
        titulo === "Portal Instructoras"
          ? "/portal-instructoras"
          : "/lineas-producto",
    };
  });
};