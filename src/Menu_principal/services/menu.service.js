import { mapMenuData } from "../utils/menu.mapper";

const URL =
  "https://macfer.crepesywaffles.com/api/menu-principal-cap-cafes";

let menuCache = null;

let menuPromise = null;

export const getMenu = async () => {
  try {
    // cache final
    if (menuCache) {
      return menuCache;
    }

    // petición en curso
    if (menuPromise) {
      return menuPromise;
    }

    menuPromise = fetch(URL)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Error al obtener menú");
        }

        const json = await response.json();

        menuCache = mapMenuData(json.data);

        return menuCache;
      })
      .finally(() => {
        menuPromise = null;
      });

    return menuPromise;
  } catch (error) {
    console.error("MENU API ERROR:", error);

    return [];
  }
};
