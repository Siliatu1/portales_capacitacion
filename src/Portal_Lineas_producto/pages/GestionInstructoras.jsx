import {
  useGestionInstructoras,
} from "../hooks/useGestionInstructoras";

import TablaGestionInstructoras from "../components/TablaGestionInstructoras";

import FiltrosGestionInstructoras from "../components/FiltrosGestionInstructoras";

import {
  getColumnsGestionInstructoras,
} from "../utils/instructorasColumns";

const GestionInstructoras =
  () => {
    const {
      dataFiltradaGestionInstructoras,
      loadingGestionInstructoras,
      filtrosGestionInstructoras,
      setFiltrosGestionInstructoras,
    } =
      useGestionInstructoras();

    const columns =
      getColumnsGestionInstructoras(
        () => {},

        () => {}
      );

    return (
      <div>
        <FiltrosGestionInstructoras
          filtros={
            filtrosGestionInstructoras
          }
          setFiltros={
            setFiltrosGestionInstructoras
          }
        />

        <TablaGestionInstructoras
          columns={
            columns
          }
          data={
            dataFiltradaGestionInstructoras
          }
          loading={
            loadingGestionInstructoras
          }
        />
      </div>
    );
  };

export default GestionInstructoras;