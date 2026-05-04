import { useState, useMemo } from "react";
import Navbar from "../components/navbar";
import { useInscripciones } from "../hooks/useInscripciones";
import { filtrarInscripciones } from "../utils/filters";
import "../styles/panel.css";
import InscripcionesTable from "../components/InscripcionesTable";
import FiltrosInscripciones from "../components/FiltrosInscripciones";

export default function Panel ({ userData, onLogout }) {
  const { data, loading, refetch } = useInscripciones();

  const [filtros, setFiltros] = useState({
    cedula: "",
    puntoVenta: "",
    fecha: ""
  });

  const dataFiltrada = useMemo(() => {
    return filtrarInscripciones(data, filtros);
  }, [data, filtros]);

  return (
    <>
      {/* NAVBAR */}
      <Navbar userData={userData} onLogout={onLogout} />

      <div className="admin-content">
        <h2>Inscripciones</h2>

        {/* FILTROS */}
        <FiltrosInscripciones
          filtros={filtros}
          setFiltros={setFiltros}
        />

        {/* TABLA */}
        <InscripcionesTable
          data={dataFiltrada}
          loading={loading}
        />
      </div>
    </>
  );
}