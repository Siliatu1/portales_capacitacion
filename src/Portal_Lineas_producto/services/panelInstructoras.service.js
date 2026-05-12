const API_URL =
  "https://macfer.crepesywaffles.com/api";

const normalizeText = (
  value
) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

const mapEstudiante = (
  item
) => {
  const attributes =
    item?.attributes || {};

  return {
    id: item.id,

    cedula:
      attributes.documento ||
      "",

    nombres:
      attributes.Nombre ||
      attributes.nombre ||
      "",

    telefono:
      attributes.telefono ||
      "",

    cargo:
      attributes.cargo ||
      "",

    cargoEvaluar:
      attributes.cargo_evaluar ||
      attributes.cargoEvaluar ||
      attributes.cargo ||
      "",

    puntoVenta:
      attributes.pdv ||
      "",

    lider:
      attributes.lider ||
      "",

    categoria:
      attributes.categoria ||
      "",

    foto:
      attributes.foto ||
      "",

    dia:
      attributes.fecha ||
      attributes.createdAt ||
      "",

    evaluado:
      attributes.estado ??
      null,

    observacion:
      attributes.observacion ||
      "",
  };
};

export const getEstudiantesInstructora =
  async (
    nombreInstructora
  ) => {
    try {
      const response =
        await fetch(
          `${API_URL}/cap-toderas?pagination[pageSize]=500`
        );

      if (!response.ok) {
        throw new Error(
          "Error cargando estudiantes"
        );
      }

      const result =
        await response.json();

      const mapped =
        (
          result.data || []
        ).map(
          mapEstudiante
        );

      console.log(
        "ESTUDIANTES:",
        mapped
      );

      console.log(
        "INSTRUCTORA LOGIN:",
        nombreInstructora
      );

      const filtrados =
        mapped.filter(
          (item) => {
            const lider =
              normalizeText(
                item.lider
              );

            const instructora =
              normalizeText(
                nombreInstructora
              );

            console.log(
              "COMPARANDO:",
              {
                lider,
                instructora,
              }
            );

            return (
              lider.includes(
                instructora
              ) ||
              instructora.includes(
                lider
              )
            );
          }
        );

      console.log(
        "FILTRADOS:",
        filtrados
      );

      return filtrados;
    } catch (error) {
      console.error(
        "ERROR PANEL INSTRUCTORAS:",
        error
      );

      throw error;
    }
  };

export const actualizarEstado =
  async (
    id,
    estado
  ) => {
    try {
      const response =
        await fetch(
          `${API_URL}/cap-toderas/${id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              data: {
                estado,
              },
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Error actualizando estado"
        );
      }

      return response.json();
    } catch (error) {
      console.error(
        "ERROR ACTUALIZANDO ESTADO:",
        error
      );

      throw error;
    }
  };

export const actualizarObservacion =
  async (
    id,
    observacion
  ) => {
    try {
      const response =
        await fetch(
          `${API_URL}/cap-toderas/${id}`,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              data: {
                observacion,
              },
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Error guardando observacion"
        );
      }

      return response.json();
    } catch (error) {
      console.error(
        "ERROR OBSERVACION:",
        error
      );

      throw error;
    }
  };