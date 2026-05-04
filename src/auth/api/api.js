const BASE_URL = "https://apialohav2.crepesywaffles.com/buk";

export const getEmpleados = async (docummento) => {
  try {
    const response = await fetch(`${BASE_URL}/empleados2/${docummento}`);
    if (!response.ok) throw new Error("Error al consultar la API");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API ERROR:", error);
    return [];
  }
};