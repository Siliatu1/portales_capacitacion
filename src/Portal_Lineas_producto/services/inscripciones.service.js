const API_URL = "https://macfer.crepesywaffles.com/api";

export const getInscripciones = async () => {
  const res = await fetch(`${API_URL}/cap-cafes`);
  if (!res.ok) throw new Error("Error al traer inscripciones");

  const json = await res.json();

  return json.data.map(item => ({
    id: item.id,
    cedula: item.attributes?.documento || '',
    nombres: item.attributes?.nombre || '',
    telefono: item.attributes?.telefono || '',
    cargo: item.attributes?.cargo || '',
    area_nombre: item.attributes?.area_nombre || '',
    dia: item.attributes?.fecha || '',
    asistencia: item.attributes?.confirmado ?? null
  }));
};