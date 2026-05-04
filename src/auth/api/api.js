const BASE_URL = "https://apialohav2.crepesywaffles.com/buk";

export const getEmpleados = async (documento) => {
  try {
    const response = await fetch(`${BASE_URL}/empleados2/${documento}`);
    if (!response.ok) throw new Error("Error al consultar la API");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API ERROR:", error);
    return [];
  }
};

export default getEmpleados ;