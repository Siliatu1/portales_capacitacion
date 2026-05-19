import { useState } from "react";

import {
  Button,
  message,
} from "antd";

import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useGestionInstructoras } from "../hooks/useGestionInstructoras";

import TablaGestionInstructoras from "../components/TablaGestionInstructoras";

import FiltrosGestionInstructoras from "../components/FiltrosGestionInstructoras";

import ModalNuevaInstructora from "../components/ModalNuevaInstructora";

import ModalAsignarInstructora from "../components/ModalAsignarInstructora";

import {
  eliminarInstructoraDePDV,
} from "../services/instructorasService";

import "../styles/gestionInstructoras.css";

const GestionInstructoras = () => {
  const navigate = useNavigate();

  const {
    dataFiltradaGestionInstructoras,
    loadingGestionInstructoras,
    filtrosGestionInstructoras,
    setFiltrosGestionInstructoras,
    cargarGestionInstructoras,
  } = useGestionInstructoras();

  // MODAL NUEVA
  const [
    openNuevaInstructora,
    setOpenNuevaInstructora,
  ] = useState(false);

  // MODAL ASIGNAR
  const [
    openAsignarInstructora,
    setOpenAsignarInstructora,
  ] = useState(false);

  // PDV SELECCIONADO
  const [
    pdvSeleccionado,
    setPdvSeleccionado,
  ] = useState(null);

  // CATEGORIA SELECCIONADA
  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada,
  ] = useState("");

  // ABRIR MODAL ASIGNAR
  const abrirModalAsignar = (
    pdvId,
    categoria
  ) => {
    setPdvSeleccionado(
      pdvId
    );

    setCategoriaSeleccionada(
      categoria
    );

    setOpenAsignarInstructora(
      true
    );
  };

  // ELIMINAR ASIGNACION
  const eliminarAsignacion =
    async (
      pdvId,
      instructoraId
    ) => {
      try {
        const pdv =
          dataFiltradaGestionInstructoras.find(
            (item) =>
              item.pdvId ===
              pdvId
          );

        if (!pdv) {
          message.error(
            "No se encontró el PDV"
          );

          return;
        }

        const instructorasIds =
          [];

        [
          "sal",
          "dulce",
          "bebidas",
          "brunch",
        ].forEach(
          (
            categoria
          ) => {
            const asignacion =
              pdv[
                categoria
              ];

            if (
              asignacion &&
              asignacion.instructoraId !==
                instructoraId
            ) {
              instructorasIds.push(
                asignacion.instructoraId
              );
            }
          }
        );

        await eliminarInstructoraDePDV(
          pdvId,
          instructoraId,
          instructorasIds
        );

        message.success(
          "Instructora eliminada correctamente"
        );

        cargarGestionInstructoras();
      } catch (error) {
        console.error(
          error
        );

        message.error(
          "Error eliminando instructora"
        );
      }
    };

  return (
    <div className="gestion-page">
      {/* HEADER */}
      <div className="gestion-header">
        <button
          className="back-button"
          onClick={() =>
            navigate(
              "/lineas-producto"
            )
          }
        >
          <ArrowLeft size={16} />
          Volver
        </button>

        <h1>
          Gestión de Instructoras
        </h1>

        <p>
          Asignación por punto de
          venta y líneas de
          producto
        </p>
      </div>

      {/* FILTROS */}
      <div className="gestion-filtros-container">
        <div className="gestion-filtros-left">
          <FiltrosGestionInstructoras
            filtros={
              filtrosGestionInstructoras
            }
            setFiltros={
              setFiltrosGestionInstructoras
            }
          />
        </div>

        <Button
          type="primary"
          className="btn-nueva-instructora"
          onClick={() =>
            setOpenNuevaInstructora(
              true
            )
          }
        >
          + Nueva instructora
        </Button>
      </div>

      {/* TABLA */}
      <TablaGestionInstructoras
        data={
          dataFiltradaGestionInstructoras
        }
        loading={
          loadingGestionInstructoras
        }
        abrirModal={
          abrirModalAsignar
        }
        eliminarAsignacion={
          eliminarAsignacion
        }
      />

      {/* MODAL NUEVA */}
      <ModalNuevaInstructora
        open={
          openNuevaInstructora
        }
        onClose={() =>
          setOpenNuevaInstructora(
            false
          )
        }
        onSuccess={
          cargarGestionInstructoras
        }
      />

      {/* MODAL ASIGNAR */}
      <ModalAsignarInstructora
        open={
          openAsignarInstructora
        }
        onClose={() =>
          setOpenAsignarInstructora(
            false
          )
        }
        categoria={
          categoriaSeleccionada
        }
        pdvId={
          pdvSeleccionado
        }
        onSuccess={
          cargarGestionInstructoras
        }
      />
    </div>
  );
};

export default GestionInstructoras;