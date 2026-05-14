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
      puntoVenta: "",
      fecha: "",
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

  const inscripcionesCafe =
    useMemo(() => {
      return data.filter(
        (item) =>
          item.sourceEndpoint ===
          "cap-cafes"
      );
    }, [data]);

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

  return (
    <>
      <Navbar
        userData={userData}
        onLogout={onLogout}
      />

      <div className="admin-content">
        <div className="page-header">
          <h2>
            Inscripciones Escuela del Cafe
          </h2>
        </div>

        <FiltrosInscripciones
          filtros={filtros}
          setFiltros={setFiltros}
          fechasDisponibles={
            fechasDisponibles
          }
        />

        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              Escuela del Cafe (
              {dataFiltrada.length})
            </div>
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
