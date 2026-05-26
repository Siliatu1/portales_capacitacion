import {
  useMemo,
  useState,
} from "react";

import Navbar from "../components/navbar";
import FiltrosInscripciones from "../components/FiltrosInscripciones";
import InscripcionesTable from "../components/InscripcionesTable";
import { useAuth } from "../../auth/hooks/useAuth";
import { useInscripciones } from "../hooks/useInscripciones";
import { filtrarInscripciones } from "../utils/filters";
import {
  getStoredUser,
  getUserPdv,
} from "../utils/userPdv.utils";
import "../styles/panel.css";

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
      instructora: [],
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

  const {
    data,
    loading,
    deleteInscripcion,
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

  return (
    <>
      <Navbar
        userData={userData}
        onLogout={onLogout}
      />

      <div className="admin-content">
        <div className="page-header">
          <h2>
            Inscripciones Todera
          </h2>
        </div>

        <FiltrosInscripciones
          filtros={filtros}
          setFiltros={setFiltros}
          fechasDisponibles={
            fechasDisponibles
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
          />
        </div>
      </div>
    </>
  );
}
