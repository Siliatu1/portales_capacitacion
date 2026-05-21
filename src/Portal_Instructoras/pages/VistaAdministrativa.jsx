import { useEffect, useMemo, useState } from "react";

import { Button } from "antd";

import {
  DownloadOutlined,
} from "@ant-design/icons";

import "../styles/admin.css";

import Navbar from "../components/Navbar";

import AdminFilters from "../components/AdminFilters";

import AdminTable from "../components/AdminTable";

import {
  getInstructoras,
  getHorarios,
} from "../services/horarios.service";

import {
  formatFechaAPI,
  getFechasSemana,
} from "../utils/fechas";

function VistaAdministrativa() {
  /* =========================
     STATES
  ========================= */

  const [loading, setLoading] =
    useState(false);

  const [search,
    setSearch] =
    useState("");

  const [instructora,
    setInstructora] =
    useState("");

  const [horarios,
    setHorarios] =
    useState([]);

  const [instructoras,
    setInstructoras] =
    useState([]);

  const [semanaOffset,
    setSemanaOffset] =
    useState(0);

  /* =========================
     FECHAS
  ========================= */

  const fechasSemana =
    useMemo(() => {
      return getFechasSemana(
        semanaOffset
      );
    }, [semanaOffset]);

  const fechaInicio =
    formatFechaAPI(
      fechasSemana[0]
    );

  const fechaFin =
    formatFechaAPI(
      fechasSemana[6]
    );


    
  /* =========================
     LOAD
  ========================= */

  const cargarData =
    async () => {
      try {
        setLoading(true);

        const dataInstructoras =
          await getInstructoras();

        setInstructoras(
          dataInstructoras
        );

        const allHorarios =
          [];

        for (const item of dataInstructoras) {
          const documento =
            item.attributes
              ?.documento;

          if (!documento) {
            continue;
          }

          const data =
            await getHorarios(
              documento,
              fechaInicio,
              fechaFin
            );

          data.forEach(
            (horario) => {
              allHorarios.push({
                ...horario,

                instructora:
                  item.attributes
                    ?.nombre ||
                  "Sin nombre",
              });
            }
          );
        }

        setHorarios(
          allHorarios
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  /* =========================
     INIT
  ========================= */

  useEffect(() => {
    cargarData();
  }, [semanaOffset]);

  /* =========================
     FILTERS
  ========================= */

  const horariosFiltrados =
    useMemo(() => {
      return horarios.filter(
        (item) => {
          const nombre =
            item.instructora?.toLowerCase();

          const actividad =
            item.attributes?.actividad?.toLowerCase();

          const pdv =
            item.attributes?.pdv_nombre?.toLowerCase();

          const searchLower =
            search.toLowerCase();

          const coincideBusqueda =
            nombre?.includes(
              searchLower
            ) ||
            actividad?.includes(
              searchLower
            ) ||
            pdv?.includes(
              searchLower
            );

          const coincideInstructora =
            !instructora ||
            item.instructora ===
              instructora;

          return (
            coincideBusqueda &&
            coincideInstructora
          );
        }
      );
    }, [
      horarios,
      search,
      instructora,
    ]);

  /* =========================
     EXPORT
  ========================= */

  const exportarExcel =
    () => {
      console.log(
        "Exportando..."
      );
    };

  /* =========================
     RENDER
  ========================= */

  return (
    <>
      <Navbar />

      <div className="admin-container">
        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-header">
          <div>
            <h1>
              Vista
              Administrativa
            </h1>

            <p>
              Consolidado
              semanal de
              instructoras
            </p>
          </div>

          <div className="admin-actions">
            <Button
              onClick={() =>
                setSemanaOffset(
                  (
                    prev
                  ) =>
                    prev - 1
                )
              }
            >
              ← Semana
            </Button>

            <Button
              onClick={() =>
                setSemanaOffset(
                  (
                    prev
                  ) =>
                    prev + 1
                )
              }
            >
              Semana →
            </Button>

            <Button
              type="primary"
              icon={
                <DownloadOutlined />
              }
              onClick={
                exportarExcel
              }
            >
              Exportar
            </Button>
          </div>
        </div>

        {/* =========================
            FILTERS
        ========================= */}

        <AdminFilters
          search={search}
          setSearch={
            setSearch
          }
          instructora={
            instructora
          }
          setInstructora={
            setInstructora
          }
          instructoras={
            instructoras
          }
          onRefresh={
            cargarData
          }
        />

        {/* =========================
            TABLE
        ========================= */}

        <AdminTable
          loading={loading}
          data={
            horariosFiltrados
          }
        />
      </div>
    </>
  );
}

export default VistaAdministrativa;