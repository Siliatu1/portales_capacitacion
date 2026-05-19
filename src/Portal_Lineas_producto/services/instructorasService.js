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
    const response =
      await fetch(
        `${API}/cap-instructoras`
      );

    if (!response.ok) {
      throw new Error(
        "No fue posible cargar instructoras"
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