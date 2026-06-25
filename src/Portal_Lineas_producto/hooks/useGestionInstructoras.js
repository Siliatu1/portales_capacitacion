import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  message,
} from "antd";

import {
  obtenerGestionInstructoras,
  obtenerPdvIps,
} from "../services/instructorasService";

import {
  buildCrepesSaPdvNameSet,
  isPdvNameInSet,
} from "../../shared/utils/pdvFilters";

export const useGestionInstructoras =
  () => {
    const [
      gestionInstructoras,
      setGestionInstructoras,
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
      useCallback(
      async () => {
        setLoadingGestionInstructoras(
          true
        );

        try {
          const result =
            await obtenerGestionInstructoras();
          const pdvIpsResult =
            await obtenerPdvIps()
              .catch(() => ({
                data: [],
              }));

          const data =
            Array.isArray(
              result?.data
            )
              ? result.data
              : [];
          const pdvIpsData =
            Array.isArray(
              pdvIpsResult?.data
            )
              ? pdvIpsResult.data
              : [];
          const crepesSaPdvNames =
            buildCrepesSaPdvNameSet(
              pdvIpsData
            );

          const filas = [];

          data
            .filter((pdvItem) =>
              isPdvNameInSet(
                pdvItem,
                crepesSaPdvNames
              )
            )
            .forEach(
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
              });
            }
          );

          setGestionInstructoras(
            filas
          );
        } catch {
          message.error(
            "Error al cargar instructoras"
          );
        } finally {
          setLoadingGestionInstructoras(
            false
          );
        }
      },
      []
      );

    useEffect(() => {
      const timer =
        window.setTimeout(() => {
          cargarGestionInstructoras();
        }, 0);

      return () =>
        window.clearTimeout(
          timer
        );
    }, [
      cargarGestionInstructoras,
    ]);

    const dataFiltradaGestionInstructoras =
      useMemo(() => {
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

      return dataTemp;
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
