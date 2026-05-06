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
    puntoVenta: item.attributes?.pdv || item.attributes?.puntoVenta || item.attributes?.area_nombre || '',
    tipo_formulario: item.attributes?.tipo_formulario || item.attributes?.tipoFormulario || 'heladeria',
    lider: item.attributes?.lider || '',
    dia: item.attributes?.fecha || '',
    asistencia: item.attributes?.confirmado ?? null
  }));
};

export const deleteInscripcion = async (id) => {
  const res = await fetch(`${API_URL}/cap-cafes/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al eliminar inscripcion: ${res.status} ${text}`);
  }

  return res.json();
};

export const updateAsistencia = async (id, confirmado) => {
  const payload = JSON.stringify({ data: { confirmado } });
  const headers = { 'Content-Type': 'application/json' };
  try {
    const raw = localStorage.getItem('user');
    const maybeToken = raw ? (() => {
      try { const u = JSON.parse(raw); return u?.token || u?.jwt || u?.accessToken || null; } catch(e) { return null; }
    })() : null;
    const altToken = localStorage.getItem('token');
    const token = maybeToken || altToken;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {
   
  }

  let res = await fetch(`${API_URL}/cap-cafes/${id}`, {
    method: 'PATCH',
    headers,
    body: payload,
  });

  if (!res.ok) {
    res = await fetch(`${API_URL}/cap-cafes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error actualizando asistencia: ${res.status} ${text}`);
  }

  return res.json();
};