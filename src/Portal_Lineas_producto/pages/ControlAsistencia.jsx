import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Navbar from "../components/navbar";
import { useInscripciones } from "../hooks/useInscripciones";
import { filtrarInscripciones } from "../utils/filters";
import "../styles/Panelinstructoras.css";
import InscripcionesAttendanceTable from "../components/InscripcionesAttendanceTable";
import FiltrosInscripciones from "../components/FiltrosInscripciones";
import { useAuth } from "../../auth/hooks/useAuth";
import { getStoredUser } from "../utils/userPdv.utils";
import { ESTADOS_INSCRIPCIONES_TODERA } from "../utils/estadoInscripcion.utils";
import { obtenerInstructoraPorDocumento } from "../services/instructorasService";


const CAFE_ATTENDANCE_INSTRUCTOR = "35512822";
const CAFE_TODERA_INSTRUCTOR_FILTER = "CLEDIA";
const ESTADOS_CONTROL_ASISTENCIA_CAFE = [
  "Pendiente",
  "Asisti\u00f3",
  "No asisti\u00f3",
];

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

const getInstructoraName = (item) =>
  item?.attributes?.Nombre ||
  item?.attributes?.nombre ||
  item?.Nombre ||
  item?.nombre ||
  "";

export default function ControlAsistencia({
  userData,
  onLogout,
  forcedMode,
}) {
  const { user } = useAuth();

  const storedUser = useMemo(() => getStoredUser(), []);
  const activeUser = storedUser || user || userData || {};
  const userDocument = pickUserDocument(activeUser);
  const instructorName = pickUserName(activeUser);
  const isCafeInstructor = userDocument === CAFE_ATTENDANCE_INSTRUCTOR;
  const [
    cafeToderaInstructorName,
    setCafeToderaInstructorName,
  ] = useState("");
  const attendanceMode =
    forcedMode === "todera"
      ? "todera"
      : isCafeInstructor
        ? "cafe"
        : "todera";
  const endpoints = useMemo(
    () => [
      attendanceMode === "cafe"
        ? "cap-cafes"
        : "cap-toderas",
    ],
    [attendanceMode]
  );

  useEffect(() => {
    if (
      attendanceMode !== "todera" ||
      !isCafeInstructor ||
      !userDocument
    ) {
      queueMicrotask(() => {
        setCafeToderaInstructorName("");
      });
      return;
    }

    let cancelled = false;

    const cargarInstructora = async () => {
      try {
        const result =
          await obtenerInstructoraPorDocumento(
            userDocument
          );

        if (!cancelled) {
          setCafeToderaInstructorName(
            getInstructoraName(result)
          );
        }
      } catch (error) {
        console.error(
          "Error cargando instructora por documento",
          error
        );
      }
    };

    cargarInstructora();

    return () => {
      cancelled = true;
    };
  }, [
    attendanceMode,
    isCafeInstructor,
    userDocument,
  ]);

  const instructoraFilter =
    attendanceMode === "cafe"
      ? ""
      : isCafeInstructor
        ? cafeToderaInstructorName ||
          instructorName ||
          CAFE_TODERA_INSTRUCTOR_FILTER
        : instructorName;

  const {
    data,
    loading,
    deleteInscripcion,
    setAsistencia,
    setEstado,
    saveObservacion,
  } = useInscripciones({
    endpoints,
    instructora: instructoraFilter,
  });

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

  const estadosDisponibles =
    attendanceMode === "cafe"
      ? ESTADOS_CONTROL_ASISTENCIA_CAFE
      : ESTADOS_INSCRIPCIONES_TODERA;

  const pageTitle = attendanceMode === "cafe"
    ? "Control de asistencia Caf\u00e9"
    : "Control de asistencia Todera";

  const visibleSidebarViews =
    isCafeInstructor
      ? [
          "CONTROL_ASISTENCIA",
          "CONTROL_ASISTENCIA_TODERA",
        ]
      : ["CONTROL_ASISTENCIA"];

  return (
    <>
      <Navbar
        userData={userData}
        onLogout={onLogout}
        visibleViews={visibleSidebarViews}
        showInscripciones={false}
      />

      <div className="admin-content">
        <div className="page-header attendance-header">
          <div>
            <h2>{pageTitle}</h2>
            <p>
              {isCafeInstructor
                ? attendanceMode === "cafe"
                  ? "Confirmacion exclusiva para las inscripciones de la escuela del Cafe."
                  : "Aqui aparecen solo las inscripciones de Toderas asignadas a tu nombre."
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
          />
        </div>
      </div>
    </>
  );
}
