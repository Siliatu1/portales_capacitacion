const API = "https://macfer.crepesywaffles.com/api";

export const guardarInscripcion = async (data) => {
  

  const dataToSend = {
    data: {
      documento: data.documento || data.document || '',
      nombre: data.nombre || data.nombres || '',
      telefono: data.telefono || '',
      cargo: data.cargo || '',
      pdv: data.pdv || data.puntoVenta || '',
      fecha: data.fecha || data.fechaInscripcion || '',
      lider: data.lider || data.nombreLider || '',
      tipo_formulario: data.tipo_formulario || 'heladeria',
    },
  };

  const res = await fetch(`${API}/cap-cafes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error al guardar inscripcion: ${res.status} ${text}`);
  }

  return res.json();
};

export const getInscripciones = async () => {
  const res = await fetch(`${API}/cap-cafes`);
  return res.json();
};