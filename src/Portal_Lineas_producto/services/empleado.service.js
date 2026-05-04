const BASE_URL = "https://apialohav2.crepesywaffles.com/buk";

export const getEmpleado = async (documento) => {
  const res = await fetch(`${BASE_URL}/empleados3?documento=${documento}`);

  if (!res.ok) throw new Error("Error API");

  return res.json();
};