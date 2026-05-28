import {
  useMemo,
  useState,
} from "react";
import { Button } from "antd";
import { FileSpreadsheet } from "lucide-react";

import Navbar from "../components/navbar";
import FiltrosInscripciones from "../components/FiltrosInscripciones";
import InscripcionesTable from "../components/InscripcionesTable";
import { useAuth } from "../../auth/hooks/useAuth";
import { useInscripciones } from "../hooks/useInscripciones";
import { downloadInscripcionesExcel } from "../utils/exportInscripcionesExcel";
import { inscripcionEstadoLabel } from "../utils/estadoInscripcion.utils";
import { filtrarInscripciones } from "../utils/filters";
import {
  getStoredUser,
  getUserPdv,
} from "../utils/userPdv.utils";
import "../styles/panel.css";

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const isHeladeriaPdv = (item) => {
  const puntoVenta = normalizeText(
    item.puntoVenta ||
      item.area_nombre ||
      ""
  );

  return puntoVenta.includes("heladeria");
};

export default function InscripcionesCafe({
  userData,
  onLogout,
}) {
  const {
    hasPermission,
    user,
  } = useAuth();

  const [filtros, setFiltros] =
    useState({
      cedula: "",
      puntoVenta: [],
      fecha: [],
      estado: [],
      formulario: "todos",
    });

  const storedUser =
    useMemo(() => getStoredUser(), []);

  const shouldFilterByPdv =
    hasPermission(
      "filterByPDV"
    );

  const userPdv =
    useMemo(
      () =>
        getUserPdv(
          storedUser ||
            user ||
            userData
        ),
      [
        storedUser,
        user,
        userData,
      ]
    );

  const isAdminGeneral =
    String(
      user?.profile ||
        user?.perfil ||
        userData?.profile ||
        userData?.perfil ||
        ""
    )
      .trim()
      .toUpperCase() ===
    "ADMIN_GENERAL";

  const {
    data,
    loading,
    deleteInscripcion,
  } = useInscripciones({
    pdv: shouldFilterByPdv
      ? userPdv
      : "",
  });

  const inscripcionesCafe =
    useMemo(() => {
      return data.filter((item) => {
        const isCafe =
          item.sourceEndpoint ===
          "cap-cafes";

        if (!isCafe) {
          return false;
        }

        if (!isAdminGeneral) {
          return true;
        }

        return isHeladeriaPdv(item);
      });
    }, [data, isAdminGeneral]);

  const dataFiltrada =
    useMemo(
      () =>
        filtrarInscripciones(
          inscripcionesCafe,
          filtros
        ),
      [inscripcionesCafe, filtros]
    );

  const fechasDisponibles =
    useMemo(() => {
      return Array.from(
        new Set(
          inscripcionesCafe
            .map((item) => item.dia)
            .filter(Boolean)
        )
      ).sort((a, b) =>
        String(b).localeCompare(
          String(a)
        )
      );
    }, [inscripcionesCafe]);

  const puntosVentaDisponibles =
    useMemo(() => {
      return Array.from(
        new Set(
          inscripcionesCafe
            .map((item) =>
              item.puntoVenta ||
              item.area_nombre
            )
            .filter(Boolean)
        )
      );
    }, [inscripcionesCafe]);

  const estadosDisponibles =
    useMemo(() => {
      return Array.from(
        new Set(
          inscripcionesCafe
            .map(inscripcionEstadoLabel)
            .filter(Boolean)
        )
      );
    }, [inscripcionesCafe]);

  const handleExportExcel = () => {
    downloadInscripcionesExcel({
      data: dataFiltrada,
      formType: "heladeria",
      fileName:
        "inscripciones_escuela_cafe",
      sheetName:
        "Inscripciones Escuela Cafe",
    });
  };

  return (
    <>
      <Navbar
        userData={userData}
        onLogout={onLogout}
      />

      <div className="admin-content">
        <div className="page-header">
          <h2>
            Inscripciones Escuela del Café
          </h2>
          <Button
            type="primary"
            className="export-excel-btn"
            icon={
              <FileSpreadsheet
                size={17}
                strokeWidth={2.2}
              />
            }
            onClick={handleExportExcel}
            disabled={
              loading ||
              dataFiltrada.length === 0
            }
          >
            Exportar Excel
          </Button>
        </div>

        <FiltrosInscripciones
          filtros={filtros}
          setFiltros={setFiltros}
          fechasDisponibles={
            fechasDisponibles
          }
          estadosDisponibles={
            estadosDisponibles
          }
          puntosVentaDisponibles={
            puntosVentaDisponibles
          }
        />

        <div className="table-card">
          <div className="table-header">

          </div>

          <InscripcionesTable
            data={dataFiltrada}
            loading={loading}
            formType="heladeria"
            onDelete={
              deleteInscripcion
            }
          />
        </div>
      </div>
    </>
  );
}
