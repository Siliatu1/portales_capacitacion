import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/navbar";
import { useInscripciones } from "../hooks/useInscripciones";
import { filtrarInscripciones } from "../utils/filters";
import "../styles/Panelinstructoras.css";
import InscripcionesAttendanceTable from "../components/InscripcionesAttendanceTable";
import FiltrosInscripciones from "../components/FiltrosInscripciones";
import { useAuth } from "../../auth/hooks/useAuth";
import { getStoredUser } from "../utils/userPdv.utils";
import { ESTADOS_INSCRIPCIONES_TODERA } from "../utils/estadoInscripcion.utils";
import { obtenerInstructorasPorCategoria } from "../services/instructorasService";


const CAFE_ATTENDANCE_INSTRUCTOR = "35512822";
const ESTADOS_CONTROL_ASISTENCIA_CAFE = [
  "Pendiente",
  "Asisti\u00f3",
  "No asisti\u00f3",
];

const getInstructoraName = (item) =>
  item?.attributes?.Nombre ||
  item?.Nombre ||
  "";

const pickUserDocument = (user) => {
  return String(
    user?.documento ||
      user?.document_number ||
      user?.document ||
      user?.cedula ||
      user?.identificacion ||
      ""
  ).trim();
};

const pickUserName = (user) => {
  return (
    user?.nombre ||
    user?.name ||
    user?.Nombre ||
    user?.nombres ||
    ""
  );
};

const isEvaluado = (value) => {
  const normalized = String(value || "").trim().toLowerCase();

  return (
    value === true ||
    normalized === "evaluado" ||
    normalized === "true" ||
    normalized === "si"
  );
};

const isNoEvaluado = (value) => {
  const normalized = String(value || "").trim().toLowerCase();

  return (
    value === false ||
    normalized === "no evaluado" ||
    normalized === "false" ||
    normalized === "no"
  );
};

export default function ControlAsistencia({ userData, onLogout }) {
  const { user } = useAuth();

  const storedUser = useMemo(() => getStoredUser(), []);
  const activeUser = storedUser || user || userData || {};
  const userDocument = pickUserDocument(activeUser);
  const instructorName = pickUserName(activeUser);
  const isCafeInstructor = userDocument === CAFE_ATTENDANCE_INSTRUCTOR;
  const attendanceMode = isCafeInstructor ? "cafe" : "todera";
  const endpoints = useMemo(
    () => [isCafeInstructor ? "cap-cafes" : "cap-toderas"],
    [isCafeInstructor]
  );

  const {
    data,
    loading,
    deleteInscripcion,
    setAsistencia,
    setEstado,
    saveObservacion,
    setInstructora,
  } = useInscripciones({
    endpoints,
    instructora: isCafeInstructor ? "" : instructorName,
  });

  const [
    instructorasPorCategoria,
    setInstructorasPorCategoria,
  ] = useState({});

  const [filtros, setFiltros] = useState({
    cedula: "",
    puntoVenta: [],
    fecha: [],
    estado: [],
    formulario: 'todos'
  });

  const dataFiltrada = useMemo(
    () => filtrarInscripciones(data, filtros),
    [data, filtros]
  );

  const resumen = useMemo(() => {
    const total = dataFiltrada.length;

    if (!isCafeInstructor) {
      const evaluados = dataFiltrada.filter((item) => isEvaluado(item.estado)).length;
      const noEvaluados = dataFiltrada.filter((item) => isNoEvaluado(item.estado)).length;

      return {
        total,
        completados: evaluados,
        rechazados: noEvaluados,
        pendientes: total - evaluados - noEvaluados,
      };
    }

    const asistieron = dataFiltrada.filter((item) => item.asistencia === true).length;
    const noAsistieron = dataFiltrada.filter((item) => item.asistencia === false).length;

    return {
      total,
      completados: asistieron,
      rechazados: noAsistieron,
      pendientes: total - asistieron - noAsistieron,
    };
  }, [dataFiltrada, isCafeInstructor]);

  const fechasDisponibles = useMemo(() => {
    return Array.from(new Set((data || []).map((i) => i.dia).filter(Boolean))).sort((a, b) =>
      String(b).localeCompare(String(a))
    );
  }, [data]);

  const puntosVentaDisponibles = useMemo(() => {
    return Array.from(
      new Set(
        (data || [])
          .map((item) => item.puntoVenta || item.area_nombre)
          .filter(Boolean)
      )
    );
  }, [data]);

  const categoriasDisponibles = useMemo(
    () =>
      Array.from(
        new Set(
          (data || [])
            .map((item) =>
              String(item.categoria || "")
                .trim()
                .toLowerCase()
            )
            .filter(Boolean)
        )
      ),
    [data]
  );

  useEffect(() => {
    if (
      attendanceMode !== "todera" ||
      categoriasDisponibles.length === 0
    ) {
      setInstructorasPorCategoria({});
      return;
    }

    let cancelled = false;

    const cargarInstructoras = async () => {
      try {
        const entries = await Promise.all(
          categoriasDisponibles.map(
            async (categoriaItem) => {
              const result =
                await obtenerInstructorasPorCategoria(
                  categoriaItem
                );

              return [
                categoriaItem,
                (result?.data || [])
                  .map(getInstructoraName)
                  .map((name) =>
                    String(name || "").trim()
                  )
                  .filter(Boolean),
              ];
            }
          )
        );

        if (!cancelled) {
          setInstructorasPorCategoria(
            Object.fromEntries(entries)
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
  }, [attendanceMode, categoriasDisponibles]);

  const estadosDisponibles = isCafeInstructor
    ? ESTADOS_CONTROL_ASISTENCIA_CAFE
    : ESTADOS_INSCRIPCIONES_TODERA;

  const pageTitle = isCafeInstructor
    ? "Control de asistencia Café"
    : "Control de asistencia Todera";

  const completedLabel = isCafeInstructor ? "Asistieron" : "Evaluados";
  const rejectedLabel = isCafeInstructor ? "No asistieron" : "No evaluados";

  return (
    <>
      <Navbar
        userData={userData}
        onLogout={onLogout}
        visibleViews={["CONTROL_ASISTENCIA"]}
        showInscripciones={false}
      />

      <div className="admin-content">
        <div className="page-header attendance-header">
          <div>
            <h2>{pageTitle}</h2>
            <p>
              {isCafeInstructor
                ? "Confirmacion exclusiva para las inscripciones de la escuela del Café."
                : "Aqui aparecen solo las inscripciones de Toderas asignadas a tu nombre."}
            </p>
          </div>
        </div>


        <FiltrosInscripciones
          filtros={filtros}
          setFiltros={setFiltros}
          fechasDisponibles={fechasDisponibles}
          puntosVentaDisponibles={puntosVentaDisponibles}
          estadosDisponibles={estadosDisponibles}
        />

        <div className="table-card attendance-card">
         

          <InscripcionesAttendanceTable
            data={dataFiltrada}
            loading={loading}
            mode={attendanceMode}
            onDelete={deleteInscripcion}
            onSetAsistencia={setAsistencia}
            onSetEstado={setEstado}
            onSaveObservacion={saveObservacion}
            onSetInstructora={setInstructora}
            instructorasPorCategoria={instructorasPorCategoria}
          />
        </div>
      </div>
    </>
  );
}
