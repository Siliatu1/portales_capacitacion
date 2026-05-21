import { mapMenuData } from "../utils/menu.mapper";

const URL =
  "https://macfer.crepesywaffles.com/api/menu-principal-cap-cafes";

let menuCache = null;

export const getMenu = async () => {
  try {
    if (menuCache) {
      return menuCache;
    }

    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Error al obtener menú");
    }

    const json = await response.json();

    menuCache = mapMenuData(json.data);

    return menuCache;
  } catch (error) {
    console.error("MENU API ERROR:", error);

    return [];
  }
};