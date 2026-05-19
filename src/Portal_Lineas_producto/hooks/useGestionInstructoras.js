import {
  useEffect,
  useState,
} from "react";

import {
  message,
} from "antd";

import {
  obtenerGestionInstructoras,
} from "../services/instructorasService";

export const useGestionInstructoras =
  () => {
    const [
      gestionInstructoras,
      setGestionInstructoras,
    ] = useState([]);

    const [
      dataFiltradaGestionInstructoras,
      setDataFiltradaGestionInstructoras,
    ] = useState([]);

    const [
      loadingGestionInstructoras,
      setLoadingGestionInstructoras,
    ] = useState(false);

    const [
      filtrosGestionInstructoras,
      setFiltrosGestionInstructoras,
    ] = useState({
      puntoVenta: "",
    });

    const cargarGestionInstructoras =
      async () => {
        setLoadingGestionInstructoras(
          true
        );

        try {
          const result =
            await obtenerGestionInstructoras();

          const data =
            Array.isArray(
              result?.data
            )
              ? result.data
              : [];

          const filas = [];

          data.forEach(
            (pdvItem) => {
              const pdvId =
                pdvItem?.id;

              const pdvNombre =
                pdvItem
                  ?.attributes
                  ?.nombre || "";

              const instructoras =
                pdvItem
                  ?.attributes
                  ?.cap_instructoras
                  ?.data || [];

              const categoriaMap =
                {
                  sal: null,
                  dulce: null,
                  bebidas: null,
                  brunch: null,
                };

              instructoras.forEach(
                (
                  insItem
                ) => {
                  const attrs =
                    insItem?.attributes ||
                    {};

                  const nombre =
                    attrs?.Nombre ||
                    "Sin nombre";

                  const instructoraId =
                    insItem.id;

                  if (
                    attrs.sal ===
                    true
                  ) {
                    categoriaMap.sal =
                      {
                        instructoraId,
                        instructoraNombre:
                          nombre,
                      };
                  }

                  if (
                    attrs.dulce ===
                    true
                  ) {
                    categoriaMap.dulce =
                      {
                        instructoraId,
                        instructoraNombre:
                          nombre,
                      };
                  }

                  if (
                    attrs.bebidas ===
                    true
                  ) {
                    categoriaMap.bebidas =
                      {
                        instructoraId,
                        instructoraNombre:
                          nombre,
                      };
                  }

                  if (
                    attrs.brunch ===
                    true
                  ) {
                    categoriaMap.brunch =
                      {
                        instructoraId,
                        instructoraNombre:
                          nombre,
                      };
                  }
                }
              );

              filas.push({
                key: `${pdvId}`,
                pdvId,
                puntoVenta:
                  pdvNombre,
                sal: categoriaMap.sal,
                dulce:
                  categoriaMap.dulce,
                bebidas:
                  categoriaMap.bebidas,
                brunch:
                  categoriaMap.brunch,
              });
            }
          );

          setGestionInstructoras(
            filas
          );

          setDataFiltradaGestionInstructoras(
            filas
          );
        } catch (error) {
          message.error(
            "Error al cargar instructoras"
          );
        } finally {
          setLoadingGestionInstructoras(
            false
          );
        }
      };

    useEffect(() => {
      cargarGestionInstructoras();
    }, []);

    useEffect(() => {
      let dataTemp = [
        ...gestionInstructoras,
      ];

      if (
        filtrosGestionInstructoras.puntoVenta
      ) {
        dataTemp =
          dataTemp.filter(
            (item) =>
              item.puntoVenta
                .toLowerCase()
                .includes(
                  filtrosGestionInstructoras.puntoVenta.toLowerCase()
                )
          );
      }

      setDataFiltradaGestionInstructoras(
        dataTemp
      );
    }, [
      filtrosGestionInstructoras,
      gestionInstructoras,
    ]);

    return {
      gestionInstructoras,
      dataFiltradaGestionInstructoras,
      loadingGestionInstructoras,
      filtrosGestionInstructoras,
      setFiltrosGestionInstructoras,
      cargarGestionInstructoras,
    };
  };