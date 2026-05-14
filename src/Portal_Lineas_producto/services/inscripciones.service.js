const API_URL =
  "https://macfer.crepesywaffles.com/api";

const PAGE_SIZE = 100;

const normalizeText = (
  value
) => {
  return String(value || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

const getTextValue = (
  value
) => {
  if (
    value === null ||
    value === undefined
  ) {
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

const buildUrl = ({
  endpoint,
  page = 1,
}) => {
  const params =
    new URLSearchParams();

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

  return `${API_URL}/${endpoint}?${params.toString()}`;
};

const mapInscripcion = (
  item,
  tipoFormulario,
  endpoint
) => {
  const attributes =
    item?.attributes || {};

  const pdv =
    getTextValue(
      attributes.pdv
    );

  return {
    id: item.id,

    cedula:
      attributes.documento ||
      "",

    nombres:
      attributes.nombre ||
      "",

    telefono:
      attributes.telefono ||
      "",

    cargo:
      attributes.cargo ||
      "",

    categoria:
      attributes.categoria ||
      "",

    area_nombre:
      getTextValue(
        attributes.area_nombre
      ),

    puntoVenta:
      pdv ||
      getTextValue(
        attributes.puntoVenta
      ) ||
      getTextValue(
        attributes.area_nombre
      ),

    tipo_formulario:
      attributes.tipo_formulario ||
      tipoFormulario,

    sourceEndpoint:
      endpoint,

    lider:
      attributes.lider ||
      "",

    dia:
      attributes.fecha ||
      attributes.createdAt ||
      "",

    asistencia:
      attributes.confirmado ??
      null,

    estado:
      attributes.estado ||
      "",

    observacion:
      attributes.observacion ||
      "",

    instructora:
      getTextValue(
        attributes.instructora
      ) ||
      attributes.instructora ||
      "",
  };
};

const fetchCollection =
  async ({
    endpoint,
    tipoFormulario,
  }) => {
    const firstUrl =
      buildUrl({
        endpoint,
        page: 1,
      });

    console.log(
      "CONSULTANDO:",
      firstUrl
    );

    const firstRes =
      await fetch(firstUrl);

    if (!firstRes.ok) {
      throw new Error(
        `Error consultando ${endpoint}`
      );
    }

    const firstData =
      await firstRes.json();

    const pageCount =
      firstData?.meta
        ?.pagination
        ?.pageCount || 1;

    const allItems = [
      ...(firstData?.data ||
        []),
    ];

    for (
      let page = 2;
      page <= pageCount;
      page += 1
    ) {
      const url =
        buildUrl({
          endpoint,
          page,
        });

      const res =
        await fetch(url);

      if (!res.ok) {
        continue;
      }

      const json =
        await res.json();

      allItems.push(
        ...(json?.data ||
          [])
      );
    }

    return allItems.map(
      (item) =>
        mapInscripcion(
          item,
          tipoFormulario,
          endpoint
        )
    );
  };

export const getInscripciones =
  async ({ pdv } = {}) => {
    try {
      const [
        restaurantes,
        toderas,
      ] =
        await Promise.all([
          fetchCollection({
            endpoint:
              "cap-cafes",

            tipoFormulario:
              "FORM_RESTAURANTE",
          }),

          fetchCollection({
            endpoint:
              "cap-toderas",

            tipoFormulario:
              "FORM_TODERA",
          }),
        ]);

      const merged = [
        ...restaurantes,
        ...toderas,
      ];

      console.log(
        "INSCRIPCIONES UNIDAS:",
        merged
      );

      if (!pdv) {
        return merged;
      }

      const filtered =
        merged.filter(
          (
            inscripcion
          ) => {
            return (
              normalizeText(
                inscripcion.puntoVenta
              ) ===
              normalizeText(
                pdv
              )
            );
          }
        );

      console.log(
        "PDV USUARIO:",
        pdv
      );

      console.log(
        "FILTRADAS:",
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
  async (
    id,
    endpoint = "cap-cafes"
  ) => {
    const res =
      await fetch(
        `${API_URL}/${endpoint}/${id}`,
        {
          method:
            "DELETE",
        }
      );

    if (!res.ok) {
      const text =
        await res.text();

      throw new Error(
        `Error al eliminar: ${text}`
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

      const maybeToken =
        raw
          ? (() => {
              try {
                const u =
                  JSON.parse(
                    raw
                  );

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
      // La asistencia tambien puede actualizarse sin token local.
    }

    let res =
      await fetch(
        `${API_URL}/cap-cafes/${id}`,
        {
          method:
            "PATCH",

          headers,

          body: payload,
        }
      );

    if (!res.ok) {
      res =
        await fetch(
          `${API_URL}/cap-cafes/${id}`,
          {
            method:
              "PUT",

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
