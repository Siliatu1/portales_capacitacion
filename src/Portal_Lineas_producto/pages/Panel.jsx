import { useState, useMemo } from "react";
import Navbar from "../components/navbar";
import { useInscripciones } from "../hooks/useInscripciones";
import { filtrarInscripciones } from "../utils/filters";
import "../styles/panel.css";
import InscripcionesTable from "../components/InscripcionesTable";
import FiltrosInscripciones from "../components/FiltrosInscripciones"; 

export default function Panel ({ userData, onLogout }) {
  const { data, loading, refetch, deleteInscripcion } = useInscripciones();

  const [filtros, setFiltros] = useState({
    cedula: "",
    puntoVenta: "",
    fecha: "",
    formulario: 'todos'
  });

  const dataFiltrada = useMemo(() => {
    return filtrarInscripciones(data, filtros);
  }, [data, filtros]);

  const formTypes = useMemo(() => {
    const set = new Set((dataFiltrada || []).map(i => (i.tipo_formulario || 'heladeria')));
    return Array.from(set);
  }, [dataFiltrada]);

  const fechasDisponibles = useMemo(() => {
    const set = new Set((data || []).map(i => i.dia).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data]);

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
          fechasDisponibles={fechasDisponibles}
        />

        {/* TABLAS POR FORMULARIO */}
        {formTypes.map((ft) => (
          <div className="table-card" key={ft} style={{ marginBottom: 18 }}>
            <div className="table-header">
              <div className="table-title">{ft.charAt(0).toUpperCase() + ft.slice(1)} ({dataFiltrada.filter(i => (i.tipo_formulario || 'heladeria') === ft).length})</div>
            </div>
            <InscripcionesTable
              data={dataFiltrada.filter(i => (i.tipo_formulario || 'heladeria') === ft)}
              loading={loading}
              formType={ft}
              onDelete={deleteInscripcion}
            />
          </div>
        ))}
      </div>
    </>
  );
}