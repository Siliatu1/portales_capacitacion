const API = "https://macfer.crepesywaffles.com/api";
const PAGE_SIZE = 100;

const normalizeCapCafeItem = (item) => {
  const attributes = item?.attributes || item || {};

  return {
    id: item?.id || attributes.id || null,
    fecha: attributes.fecha || "",
    documento: attributes.documento || "",
    nombre: attributes.nombre || attributes.Nombre || "",
    telefono: attributes.telefono || "",
    tipo_formulario: attributes.tipo_formulario || "",
  };
};

export const getInscripcionesCapCafe = async () => {
  const allItems = [];
  let page = 1;

  while (true) {
    const params = new URLSearchParams();
    params.set("pagination[page]", String(page));
    params.set("pagination[pageSize]", String(PAGE_SIZE));

    const res = await fetch(`${API}/cap-cafes?${params.toString()}`);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error consultando cupos: ${res.status} ${text}`);
    }

    const json = await res.json();
    allItems.push(...(json?.data || []));
    const pageCount = json?.meta?.pagination?.pageCount || 1;

    if (page >= pageCount) break;

    page += 1;
  }

  return allItems.map(normalizeCapCafeItem);
};

export const getCuposFechaCapCafe = async (fecha) => {
  if (!fecha) return 0;

  const inscripciones = await getInscripcionesCapCafe();

  return inscripciones.filter((item) => item.fecha === fecha).length;
};

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
  const data = await getInscripcionesCapCafe();
  return { data };
};
