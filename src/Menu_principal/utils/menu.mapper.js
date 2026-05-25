
import { MENU_ROUTES } from "./menu.routes";

const normalizeTitle = (title = "") =>
  title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const mapMenuData = (data = []) => {
  return data.map((item) => {
    const titulo =
      item.attributes?.titulo || "";
    const normalizedTitle = normalizeTitle(titulo);

    return {
      id: item.id,

      title: titulo,

      description:
        item.attributes?.descripcion || "",

      route: MENU_ROUTES[normalizedTitle] ||
        (normalizedTitle.includes("instructora")
          ? "/portal-instructoras"
          : "/lineas-producto"),
    };
  });
};
