import {
  useEffect,
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
import { obtenerInstructoras } from "../services/instructorasService";
import { downloadInscripcionesExcel } from "../utils/exportInscripcionesExcel";
import { ESTADOS_INSCRIPCIONES_TODERA } from "../utils/estadoInscripcion.utils";
import { filtrarInscripciones } from "../utils/filters";
import {
  getStoredUser,
  getUserPdv,
} from "../utils/userPdv.utils";
import "../styles/panel.css";

const getInstructoraName = (item) =>
  item?.attributes?.Nombre ||
  item?.Nombre ||
  "";

const isSuperAdminProfile = (value) => {
  const normalized = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  return normalized === "SUPER_ADMIN";
};

export default function InscripcionesTodera({
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
      instructora: [],
      formulario: "todos",
    });

  const [
    instructorasPorCategoria,
    setInstructorasPorCategoria,
  ] = useState({});

  const storedUser =
    useMemo(() => getStoredUser(), []);

  const activeUser =
    storedUser ||
    user ||
    userData ||
    {};

  const shouldFilterByPdv =
    hasPermission(
      "filterByPDV"
    );

  const canReassignInstructora =
    hasPermission(
      "canReassignInstructora"
    ) ||
    isSuperAdminProfile(user?.profile) ||
    isSuperAdminProfile(user?.perfil) ||
    isSuperAdminProfile(activeUser?.profile) ||
    isSuperAdminProfile(activeUser?.perfil);

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

  const {
    data,
    loading,
    deleteInscripcion,
    setInstructora,
  } = useInscripciones({
    pdv: shouldFilterByPdv
      ? userPdv
      : "",
  });

  const inscripcionesTodera =
    useMemo(() => {
      return data.filter(
        (item) =>
          item.sourceEndpoint ===
          "cap-toderas"
      );
    }, [data]);

  useEffect(() => {
    if (
      !canReassignInstructora
    ) {
      setInstructorasPorCategoria({});
      return;
    }

    let cancelled = false;

    const cargarInstructoras = async () => {
      try {
        const result =
          await obtenerInstructoras();

        const instructoras =
          Array.from(
            new Set(
              (result?.data || [])
                .map(getInstructoraName)
                .map((name) =>
                  String(name || "").trim()
                )
                .filter(Boolean)
            )
          ).sort((a, b) =>
            a.localeCompare(b, "es")
          );

        if (!cancelled) {
          setInstructorasPorCategoria(
            {
              __all: instructoras,
            }
          );
        }
      } catch (error) {
        console.error(
          "Error cargando instructoras para reasignar",
          error
        );
      }
    };

    cargarInstructoras();

    return () => {
      cancelled = true;
    };
  }, [
    canReassignInstructora,
  ]);

  const dataFiltrada =
    useMemo(
      () =>
        filtrarInscripciones(
          inscripcionesTodera,
          filtros
        ),
      [
        inscripcionesTodera,
        filtros,
      ]
    );

  const fechasDisponibles =
    useMemo(() => {
      return Array.from(
        new Set(
          inscripcionesTodera
            .map((item) => item.dia)
            .filter(Boolean)
        )
      ).sort((a, b) =>
        String(b).localeCompare(
          String(a)
        )
      );
    }, [inscripcionesTodera]);

  const puntosVentaDisponibles =
    useMemo(() => {
      return Array.from(
        new Set(
          inscripcionesTodera
            .map((item) =>
              item.puntoVenta ||
              item.area_nombre
            )
            .filter(Boolean)
        )
      );
    }, [inscripcionesTodera]);

  const estadosDisponibles =
    ESTADOS_INSCRIPCIONES_TODERA;

  const instructorasDisponibles =
    useMemo(() => {
      return Array.from(
        new Set(
          inscripcionesTodera
            .map((item) =>
              item.instructora ||
              item.lider
            )
            .filter(Boolean)
        )
      );
    }, [inscripcionesTodera]);

  const handleExportExcel = () => {
    downloadInscripcionesExcel({
      data: dataFiltrada,
      formType: "todera",
      fileName:
        "inscripciones_todera",
      sheetName:
        "Inscripciones Todera",
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
          <h2>Inscripciones Todera</h2>
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
          instructorasDisponibles={
            instructorasDisponibles
          }
          showInstructoraFilter
        />

        <div className="table-card">
          <div className="table-header">
          </div>

          <InscripcionesTable
            data={dataFiltrada}
            loading={loading}
            formType="todera"
            onDelete={
              deleteInscripcion
            }
            onSetInstructora={
              canReassignInstructora
                ? setInstructora
                : undefined
            }
            canReassignInstructora={
              canReassignInstructora
            }
            instructorasPorCategoria={
              instructorasPorCategoria
            }
          />
        </div>
      </div>
    </>
  );
}
