const API_URL = "https://macfer.crepesywaffles.com/api";
const PAGE_SIZE = 100;

const getTextValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);

  const attributes = value?.data?.attributes || value?.attributes || value;
  return (
    attributes?.nombre ||
    attributes?.name ||
    attributes?.pdv ||
    attributes?.puntoVenta ||
    attributes?.area_nombre ||
    ""
  );
};

const buildInscripcionesUrl = ({ page = 1, pdv } = {}) => {
  const params = new URLSearchParams();
  params.set("pagination[page]", String(page));
  params.set("pagination[pageSize]", String(PAGE_SIZE));

  if (pdv) {
    params.set("filters[pdv][$containsi]", pdv);
  }

  return `${API_URL}/cap-cafes?${params.toString()}`;
};

const mapInscripcion = (item) => {
  const attributes = item.attributes || {};
  const pdv = getTextValue(attributes.pdv);

  return {
    id: item.id,
    cedula: attributes.documento || '',
    nombres: attributes.nombre || '',
    telefono: attributes.telefono || '',
    cargo: attributes.cargo || '',
    area_nombre: getTextValue(attributes.area_nombre),
    puntoVenta: pdv || getTextValue(attributes.puntoVenta) || getTextValue(attributes.area_nombre),
    tipo_formulario: attributes.tipo_formulario || attributes.tipoFormulario || '',
    lider: attributes.lider || '',
    dia: attributes.fecha || '',
    asistencia: attributes.confirmado ?? null
  };
};

const fetchInscripcionesPage = async ({ page, pdv } = {}) => {
  const res = await fetch(buildInscripcionesUrl({ page, pdv }));
  if (!res.ok) throw new Error("Error al traer inscripciones");
  return res.json();
};

export const getInscripciones = async ({ pdv } = {}) => {
  try {
    const firstPage = await fetchInscripcionesPage({ page: 1, pdv });
    const pageCount = firstPage.meta?.pagination?.pageCount || 1;
    const allItems = [...(firstPage.data || [])];

    for (let page = 2; page <= pageCount; page += 1) {
      const pageData = await fetchInscripcionesPage({ page, pdv });
      allItems.push(...(pageData.data || []));
    }

    if (pdv && allItems.length === 0) {
      return getInscripciones();
    }

    return allItems.map(mapInscripcion);
  } catch (error) {
    if (pdv) {
      return getInscripciones();
    }

    throw error;
  }
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
      try { const u = JSON.parse(raw); return u?.token || u?.jwt || u?.accessToken || null; } catch { return null; }
    })() : null;
    const altToken = localStorage.getItem('token');
    const token = maybeToken || altToken;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch {
    // Continuar sin token si localStorage no esta disponible.
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
