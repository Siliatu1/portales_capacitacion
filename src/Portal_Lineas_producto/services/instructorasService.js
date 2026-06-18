const API =
  "https://macfer.crepesywaffles.com/api";

export const obtenerGestionInstructoras =
  async () => {
    let response =
      await fetch(
        `${API}/cap-pdvs?populate=cap_instructoras`
      );

    if (!response.ok) {
      response =
        await fetch(
          `${API}/cap-pdvs?populate=*`
        );
    }

    if (!response.ok) {
      throw new Error(
        "No fue posible cargar puntos de venta"
      );
    }

    return response.json();
  };

export const obtenerInstructoras =
  async () => {
    const pageSize = 100;
    const firstResponse =
      await fetch(
        `${API}/cap-instructoras?pagination[page]=1&pagination[pageSize]=${pageSize}`
      );

    if (!firstResponse.ok) {
      throw new Error(
        "No fue posible cargar instructoras"
      );
    }

    const firstData =
      await firstResponse.json();

    const pageCount =
      firstData?.meta
        ?.pagination
        ?.pageCount || 1;

    const allInstructoras = [
      ...(firstData?.data || []),
    ];

    for (
      let page = 2;
      page <= pageCount;
      page += 1
    ) {
      const response =
        await fetch(
          `${API}/cap-instructoras?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
        );

      if (!response.ok) {
        continue;
      }

      const data =
        await response.json();

      allInstructoras.push(
        ...(data?.data || [])
      );
    }

    return {
      ...firstData,
      data: allInstructoras,
    };
  };

export const obtenerInstructoraPorDocumento =
  async (documento) => {
    const cleanDocumento =
      String(documento || "").trim();

    if (!cleanDocumento) {
      return null;
    }

    const documentFields = [
      "documento",
      "Documento",
      "document_number",
      "cedula",
    ];

    for (const field of documentFields) {
      const response =
        await fetch(
          `${API}/cap-instructoras?filters[${field}][$eq]=${encodeURIComponent(cleanDocumento)}&pagination[pageSize]=1`
        );

      if (!response.ok) {
        continue;
      }

      const data =
        await response.json();

      const instructora =
        data?.data?.[0];

      if (instructora) {
        return instructora;
      }
    }

    return null;
  };

export const eliminarInstructoraDePDV =
  async (
    pdvId,
    instructoraId,
    instructorasActuales
  ) => {
    const nuevasInstructoras =
      instructorasActuales.filter(
        (id) =>
          id !== instructoraId
      );

    const response =
      await fetch(
        `https://macfer.crepesywaffles.com/api/cap-pdvs/${pdvId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            data: {
              cap_instructoras:
                nuevasInstructoras,
            },
          }),
        }
      );

    if (!response.ok) {
      throw new Error(
        "Error eliminando instructora"
      );
    }

    return response.json();
  };

export const obtenerInstructorasPorCategoria =
  async (categoria) => {
    const campo =
      categoria.toLowerCase();

    const response =
      await fetch(
        `${API}/cap-instructoras?filters[${campo}][$eq]=true`
      );

    if (!response.ok) {
      throw new Error(
        "Error al cargar instructoras"
      );
    }

    return response.json();
  };

export const crearInstructoraService =
  async (payload) => {
    const response =
      await fetch(
        `${API}/cap-instructoras`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

    if (!response.ok) {
      throw new Error(
        "No fue posible crear instructora"
      );
    }

    return response.json();
  };

export const actualizarPDVInstructoras =
  async (
    pdvId,
    instructoras
  ) => {
    const response =
      await fetch(
        `${API}/cap-pdvs/${pdvId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            data: {
              cap_instructoras:
                instructoras,
            },
          }),
        }
      );

    if (!response.ok) {
      throw new Error(
        "Error actualizando PDV"
      );
    }

    return response.json();
  };
