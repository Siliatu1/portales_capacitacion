import { useState, useMemo } from "react";
import NavbarCompact from "../components/NavbarB";
import { useInscripciones } from "../hooks/useInscripciones";
import { filtrarInscripciones } from "../utils/filters";
import "../styles/panel.css";
import InscripcionesAttendanceTable from "../components/InscripcionesAttendanceTable";
import FiltrosInscripciones from "../components/FiltrosInscripciones";

export default function ControlAsistencia({ userData, onLogout }) {
  const { data, loading, refetch, deleteInscripcion, setAsistencia } = useInscripciones();

  const [filtros, setFiltros] = useState({
    cedula: "",
    puntoVenta: "",
    fecha: "",
    formulario: 'todos'
  });

  const dataFiltrada = useMemo(() => filtrarInscripciones(data, filtros), [data, filtros]);

  const formTypes = useMemo(() => {
    const set = new Set((dataFiltrada || []).map(i => (i.tipo_formulario || 'heladeria')));
    return Array.from(set);
  }, [dataFiltrada]);

  return (
    <>
      <NavbarCompact onLogout={onLogout} />

      <div className="admin-content">
        <h2>Control de Asistencia</h2>

        <FiltrosInscripciones
          filtros={filtros}
          setFiltros={setFiltros}
          fechasDisponibles={Array.from(new Set((data || []).map(i => i.dia).filter(Boolean))).sort((a,b)=>a.localeCompare(b))}
        />

        {formTypes.map((ft) => (
          <div className="table-card" key={ft} style={{ marginBottom: 18 }}>
            <div className="table-header">
              <div className="table-title">{ft.charAt(0).toUpperCase() + ft.slice(1)} ({dataFiltrada.filter(i => (i.tipo_formulario || 'heladeria') === ft).length})</div>
            </div>
            <InscripcionesAttendanceTable
              data={dataFiltrada.filter(i => (i.tipo_formulario || 'heladeria') === ft)}
              loading={loading}
              onDelete={deleteInscripcion}
              onSetAsistencia={setAsistencia}
            />
          </div>
        ))}
      </div>
    </>
  );
}
