import { mapMenuData } from "../utils/menu.mapper";

const URL =
  "https://macfer.crepesywaffles.com/api/menu-principal-cap-cafes";

export const getMenu = async () => {
  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Error al obtener menú");
    }

    const json = await response.json();

    return mapMenuData(json.data);
  } catch (error) {
    console.error("MENU API ERROR:", error);
    return [];
  }
};