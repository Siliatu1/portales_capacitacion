const BASE_URL = "https://apialohav2.crepesywaffles.com/buk";

export const getEmpleado = async (documento) => {
  const res = await fetch(`${BASE_URL}/empleados3?documento=${documento}`);

  if (!res.ok) {
    const error = new Error("Error API");
    error.status = res.status;
    throw error;
  }

  return res.json();
};
