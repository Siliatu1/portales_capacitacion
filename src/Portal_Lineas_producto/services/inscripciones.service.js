const API_URL = "https://macfer.crepesywaffles.com/api";

const PAGE_SIZE = 100;

const normalizeText = (value) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

const getTextValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  const attributes =
    value?.data?.attributes ||
    value?.attributes ||
    value;

  return (
    attributes?.nombre ||
    attributes?.name ||
    attributes?.pdv ||
    attributes?.puntoVenta ||
    attributes?.area_nombre ||
    attributes?.pdv_nombre ||
    ""
  );
};

const buildInscripcionesUrl = ({
  page = 1,
} = {}) => {
  const params = new URLSearchParams();

  params.set(
    "pagination[page]",
    String(page)
  );

  params.set(
    "pagination[pageSize]",
    String(PAGE_SIZE)
  );

  params.set(
    "sort[0]",
    "createdAt:desc"
  );

  return `${API_URL}/cap-cafes?${params.toString()}`;
};

const mapInscripcion = (item) => {
  const attributes =
    item?.attributes || {};

  const pdv =
    getTextValue(attributes.pdv);

  const puntoVenta =
    pdv ||
    getTextValue(
      attributes.puntoVenta
    ) ||
    getTextValue(
      attributes.area_nombre
    );

  const tipoFormulario =
    attributes.tipo_formulario ||
    attributes.tipoFormulario ||
    attributes.tipo ||
    "FORM_RESTAURANTE";

  return {
    id: item.id,

    cedula:
      attributes.documento || "",

    nombres:
      attributes.nombre || "",

    telefono:
      attributes.telefono || "",

    cargo:
      attributes.cargo || "",

    area_nombre: getTextValue(
      attributes.area_nombre
    ),

    puntoVenta,

    tipo_formulario:
      tipoFormulario,

    lider:
      attributes.lider || "",

    dia:
      attributes.fecha ||
      attributes.createdAt ||
      "",

    asistencia:
      attributes.confirmado ??
      null,
  };
};

const fetchInscripcionesPage =
  async ({ page } = {}) => {
    const url =
      buildInscripcionesUrl({
        page,
      });

    console.log(
      "URL INSCRIPCIONES:",
      url
    );

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(
        "Error al traer inscripciones"
      );
    }

    return res.json();
  };

export const getInscripciones =
  async ({ pdv } = {}) => {
    try {
      const firstPage =
        await fetchInscripcionesPage({
          page: 1,
        });

      const pageCount =
        firstPage?.meta?.pagination
          ?.pageCount || 1;

      const allItems = [
        ...(firstPage?.data || []),
      ];

      for (
        let page = 2;
        page <= pageCount;
        page += 1
      ) {
        const pageData =
          await fetchInscripcionesPage({
            page,
          });

        allItems.push(
          ...(pageData?.data || [])
        );
      }

      const mapped =
        allItems.map(
          mapInscripcion
        );

      console.log(
        "INSCRIPCIONES MAPEADAS:",
        mapped
      );

      if (!pdv) {
        return mapped;
      }

      const filtered =
        mapped.filter(
          (inscripcion) => {
            return (
              normalizeText(
                inscripcion.puntoVenta
              ) ===
              normalizeText(pdv)
            );
          }
        );

      console.log(
        "PDV USUARIO:",
        pdv
      );

      console.log(
        "INSCRIPCIONES FILTRADAS:",
        filtered
      );

      return filtered;
    } catch (error) {
      console.error(
        "ERROR GET INSCRIPCIONES:",
        error
      );

      throw error;
    }
  };

export const deleteInscripcion =
  async (id) => {
    const res = await fetch(
      `${API_URL}/cap-cafes/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const text =
        await res.text();

      throw new Error(
        `Error al eliminar inscripcion: ${text}`
      );
    }

    return res.json();
  };

export const updateAsistencia =
  async (
    id,
    confirmado
  ) => {
    const payload =
      JSON.stringify({
        data: {
          confirmado,
        },
      });

    const headers = {
      "Content-Type":
        "application/json",
    };

    try {
      const raw =
        localStorage.getItem(
          "user"
        );

      const maybeToken = raw
        ? (() => {
            try {
              const u =
                JSON.parse(raw);

              return (
                u?.token ||
                u?.jwt ||
                u?.accessToken ||
                null
              );
            } catch {
              return null;
            }
          })()
        : null;

      const altToken =
        localStorage.getItem(
          "token"
        );

      const token =
        maybeToken ||
        altToken;

      if (token) {
        headers[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    } catch {
      console.warn(
        "No se pudo obtener token"
      );
    }

    let res = await fetch(
      `${API_URL}/cap-cafes/${id}`,
      {
        method: "PATCH",
        headers,
        body: payload,
      }
    );

    if (!res.ok) {
      res = await fetch(
        `${API_URL}/cap-cafes/${id}`,
        {
          method: "PUT",
          headers,
          body: payload,
        }
      );
    }

    if (!res.ok) {
      const text =
        await res.text();

      throw new Error(
        `Error actualizando asistencia: ${text}`
      );
    }

    return res.json();
  };