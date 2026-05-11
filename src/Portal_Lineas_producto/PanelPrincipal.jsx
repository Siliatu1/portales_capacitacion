import React, { useState, useMemo, useEffect } from "react";
import { AlertTriangle, Phone, BadgeCheck, Store, Hourglass, Search, ArrowLeft, LogOut, User } from "lucide-react";
import { Select, message } from "antd";
import axios from "axios";

// Mantén las importaciones de tus hooks, utilidades y servicios externos
import { useInscripciones } from "./hooks/useInscripciones";
import { filtrarInscripciones } from "./utils/filters";
import { useFormulario } from "./hooks/useFormulario";
import useEmpleado, { useEmpleadoForm } from "./hooks/useEmpleado"; 
import { useFechas } from "./hooks/useFechas";
import { guardarInscripcion } from "./services/formulario.service";
import { getInitialFormState, buildInscripcionAttributes } from "./utils/formularioHel.utils";

// Componentes secundarios externos
import InscripcionesTable from "./components/InscripcionesTable";
import InscripcionesAttendanceTable from "./components/InscripcionesAttendanceTable";
import FiltrosInscripciones from "./components/FiltrosInscripciones";
import BuscarEmpleado from "./components/BuscarEmpleado";

import "./PanelPrincipal.css";

// ==========================================
// COMPONENTE NAVBAR UNIFICADO
// ==========================================
const Navbar = ({ userData, onLogout, setView }) => {
  const user = JSON.parse(localStorage.getItem("user")) || userData;

  const handleLogout = () => {
    localStorage.removeItem("user");
    if (onLogout) onLogout();
  };

  return (
    <header className="navbar-pl">
      <div className="navbar-left-pl">
        <button className="back-btn-pl" onClick={() => setView('panel')}>
          <ArrowLeft size={20} />
        </button>
        <div className="user-info-pl">
          <div className="avatar-pl">
            {user?.foto ? (
              <img src={user.foto} alt="user" />
            ) : (
              <div className="avatar-fallback-pl"><User size={20}/></div>
            )}
          </div>
          <div>
            <h4>{user?.nombre || "Usuario"}</h4>
            <span>{user?.cargo_general || ""}</span>
          </div>
        </div>
      </div>
      <div className="navbar-actions-pl">
        <button className="action-btn-pl" onClick={() => setView('panel')}>Panel</button>
        <button className="action-btn-pl" onClick={() => setView('form-heladeria')}>Heladería</button>
        <button className="action-btn-pl" onClick={() => setView('form-restaurante')}>Restaurante</button>
        <button className="action-btn-pl" onClick={() => setView('control-asistencia')}>Asistencia</button>
        <button className="action-btn-pl" onClick={() => setView('form-todera')}>Todera</button>
        <button className="logout-btn-pl" onClick={handleLogout}><LogOut size={16} style={{marginRight: 6}}/>Salir</button>
      </div>
    </header>
  );
};

// ==========================================
// VISTA: PANEL
// ==========================================
const Panel = () => {
  const { data, loading, deleteInscripcion } = useInscripciones();
  const [filtros, setFiltros] = useState({ cedula: "", puntoVenta: "", fecha: "", formulario: "todos" });

  const dataFiltrada = useMemo(() => filtrarInscripciones(data, filtros), [data, filtros]);
  const formTypes = useMemo(() => Array.from(new Set((dataFiltrada || []).map(i => (i.tipo_formulario || 'heladeria')))), [dataFiltrada]);
  const fechasDisponibles = useMemo(() => Array.from(new Set((data || []).map(i => i.dia).filter(Boolean))).sort((a, b) => a.localeCompare(b)), [data]);

  return (
    <div className="admin-content-pl">
      <h2>Inscripciones Globales</h2>
      <FiltrosInscripciones filtros={filtros} setFiltros={setFiltros} fechasDisponibles={fechasDisponibles} />
      {formTypes.map((ft) => (
        <div className="table-card-pl" key={ft}>
          <div className="table-header-pl">
            <div className="table-title-pl">{ft.charAt(0).toUpperCase() + ft.slice(1)} ({dataFiltrada.filter(i => (i.tipo_formulario || 'heladeria') === ft).length})</div>
          </div>
          <InscripcionesTable data={dataFiltrada.filter(i => (i.tipo_formulario || 'heladeria') === ft)} loading={loading} formType={ft} onDelete={deleteInscripcion} />
        </div>
      ))}
    </div>
  );
};

// ==========================================
// VISTA: CONTROL DE ASISTENCIA
// ==========================================
const ControlAsistencia = () => {
  const { data, loading, deleteInscripcion, setAsistencia } = useInscripciones();
  const [filtros, setFiltros] = useState({ cedula: "", puntoVenta: "", fecha: "", formulario: "todos" });

  const dataFiltrada = useMemo(() => filtrarInscripciones(data, filtros), [data, filtros]);
  const formTypes = useMemo(() => Array.from(new Set((dataFiltrada || []).map(i => (i.tipo_formulario || 'heladeria')))), [dataFiltrada]);

  return (
    <div className="admin-content-pl">
      <h2>Control de Asistencia</h2>
      <FiltrosInscripciones filtros={filtros} setFiltros={setFiltros} fechasDisponibles={Array.from(new Set((data || []).map(i => i.dia).filter(Boolean))).sort((a,b)=>a.localeCompare(b))} />
      {formTypes.map((ft) => (
        <div className="table-card-pl" key={ft}>
          <div className="table-header-pl">
            <div className="table-title-pl">{ft.charAt(0).toUpperCase() + ft.slice(1)} ({dataFiltrada.filter(i => (i.tipo_formulario || 'heladeria') === ft).length})</div>
          </div>
          <InscripcionesAttendanceTable data={dataFiltrada.filter(i => (i.tipo_formulario || 'heladeria') === ft)} loading={loading} onDelete={deleteInscripcion} onSetAsistencia={setAsistencia} />
        </div>
      ))}
    </div>
  );
};

// ==========================================
// VISTA: FORM HELADERIA & RESTAURANTE (Reutilizable)
// ==========================================
const FormInscripcionBase = ({ titulo, diasHabiles }) => {
  const { formData, handleChange, setFormData, setLoading } = useFormulario({ initialState: getInitialFormState() });
  const { empleado, buscarEmpleado, clearEmpleado } = useEmpleadoForm(setFormData);
  const { fechas } = useFechas(diasHabiles);

  const [page, setPage] = useState(0);
  const pageSize = 3;
  const paginas = useMemo(() => Math.max(1, Math.ceil(fechas.length / pageSize)), [fechas.length]);
  const fechasPaginadas = useMemo(() => fechas.slice(page * pageSize, (page + 1) * pageSize), [fechas, page]);

  useEffect(() => setPage(0), [fechas.length]);

  const [messageLocal, setMessageLocal] = useState(null);
  const [lider, setLider] = useState("");

  useEffect(() => {
    try { setLider(JSON.parse(localStorage.getItem("user"))?.nombre || ""); } catch (err) {}
  }, []);

  const onSearch = async () => {
    setMessageLocal(null);
    try {
      await buscarEmpleado(formData.documento);
      setMessageLocal({ type: "success", text: "✓ Empleado encontrado" });
    } catch (err) {
      setMessageLocal({ type: "error", text: "No se encontró empleado" });
    }
  };

  const onSubmit = async () => {
    setMessageLocal(null);
    if (!formData.fecha) return setMessageLocal({ type: 'error', text: 'Seleccione una fecha' });
    const fechaObj = fechas.find((x) => x.fecha === formData.fecha);
    if (!fechaObj || !fechaObj.disponible) return setMessageLocal({ type: 'error', text: 'La fecha seleccionada no está disponible' });

    try {
      setLoading(true);
      const attributes = buildInscripcionAttributes(formData, empleado);
      const res = await guardarInscripcion(attributes);
      if (res && (res.data || res.id)) {
        setMessageLocal({ type: "success", text: "Inscripción guardada correctamente" });
        setFormData(getInitialFormState());
        if (typeof clearEmpleado === 'function') clearEmpleado();
        setPage(0);
      } else {
        setMessageLocal({ type: "error", text: "Error al guardar la inscripción" });
      }
    } catch (err) {
      setMessageLocal({ type: "error", text: "Error de conexión al guardar" });
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setFormData(getInitialFormState());
    if (typeof clearEmpleado === 'function') clearEmpleado();
    setMessageLocal(null);
    setPage(0);
  };

  return (
    <div className="inscripcion-container-pl">
      <div className="inscripcion-card-pl">
        <h2 className="inscripcion-title-pl">{titulo}</h2>
        <div className="search-row-pl">
          <input name="documento" className="form-input-pl search-input-pl" placeholder="Número de documento" value={formData.documento} onChange={handleChange} />
          <button className="btn-primary-pl search-button-pl" onClick={onSearch}><Search size={16} /> Buscar</button>
        </div>

        {messageLocal && <div className={`mensaje-pl ${messageLocal.type}`}>{messageLocal.text}</div>}

        {empleado && (
          <div className="employee-info-container-pl">
            <div className="employee-top-pl">
              <img src={empleado.photo || ''} className="employee-photo-pl" alt="foto" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="%23F5E6D3"/><text x="50%" y="55%" font-size="18" fill="%238B7355" text-anchor="middle">Sin foto</text></svg>'; }} />
              <div className="employee-meta-pl">
                <div className="employee-name-pl">{empleado.nombre}</div>
                <div className="employee-role-pl">{empleado.cargo_general}</div>
              </div>
            </div>
            <div className="employee-details-pl">
              <div className="detail-row-pl"><label>Teléfono</label><input name="telefono" className="form-input-pl" value={formData.telefono || empleado?.celular || ""} onChange={handleChange} /></div>
              <div className="detail-row-pl"><label>Punto de venta</label><input name="area_nombre" className="form-input-pl" value={formData.area_nombre || empleado?.area_nombre || ""} onChange={handleChange} /></div>
              <div className="detail-row-pl"><label>Líder</label><input className="form-input-pl" value={lider} readOnly disabled /></div>
            </div>
          </div>
        )}

        <div className="fechas-section-pl">
          <div className="fechas-grid-pl">
            {fechasPaginadas.map((f) => (
              <button key={f.fecha} type="button" className={`fecha-card-pl ${!f.disponible ? 'no-disponible' : ''} ${formData.fecha === f.fecha ? 'selected' : ''}`} onClick={() => f.disponible && setFormData(p => ({ ...p, fecha: f.fecha }))} disabled={!f.disponible}>
                {!f.disponible && <div className="fecha-badge-pl">{f.esFestivo ? 'FESTIVO' : 'COMPLETO'}</div>}
                <div className="fecha-mes-pl">{f.mes?.toUpperCase()}</div>
                <div className="fecha-dia-pl">{f.dia}</div>
                <div className="fecha-texto-pl">{f.texto || f.fecha}</div>
                <div className="fecha-contador-pl">{f.inscripciones || 0}/3</div>
              </button>
            ))}
          </div>
          <div className="pagination-pl">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page <= 0}>‹</button>
            <span>Página {page + 1} de {paginas}</span>
            <button onClick={() => setPage(p => Math.min(paginas - 1, p + 1))} disabled={page >= paginas - 1}>›</button>
          </div>
        </div>

        <div className="form-actions-pl">
          <button className="btn-secondary-pl" onClick={onClear}>Limpiar</button>
          <button className="btn-primary-pl" onClick={onSubmit}>Inscribir</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// VISTA: FORMULARIO TODERAS
// ==========================================
const opcionesCargoEvaluar = [
  { label: <span>SAL</span>, options: [{ value: 'Plancha Sal', label: 'Plancha Sal' }, { value: 'Cocina', label: 'Cocina' }, { value: 'Pitas y Ensaladas', label: 'Pitas y Ensaladas' }] },
  { label: <span>DULCE</span>, options: [{ value: 'Postres y Helados', label: 'Postres y Helados' }] },
  { label: <span>BEBIDAS</span>, options: [{ value: 'Bebidas Frias y Calientes', label: 'Bebidas Frias y Calientes' }] },
  { label: <span>BRUNCH</span>, options: [{ value: 'Plancha Sal Brunch', label: 'Plancha Sal Brunch' }, { value: 'Cocina Brunch', label: 'Cocina Brunch' }] }
];

const FormTodera = ({ coordinadoraData }) => {
  const cargoCoordinadora = coordinadoraData?.data?.cargo_general || '';
  const puntoVentaCoordinadora = coordinadoraData?.data?.area_nombre || '';
  const nombreLider = coordinadoraData?.data?.nombre || '';

  const { documento, setDocumento, empleado, buscarEmpleado, loading, mensaje, limpiarEmpleado } = useEmpleado(puntoVentaCoordinadora);
  const [formData, setFormData] = useState({ foto: '', nombres: '', telefono: '', cargo: cargoCoordinadora, puntoVenta: puntoVentaCoordinadora, nombreLider: nombreLider });
  const [categoria, setCategoria] = useState('');
  const [cargoEvaluar, setCargoEvaluar] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [instructora, setInstructora] = useState(null);
  const [loadingInstructora, setLoadingInstructora] = useState(false);

  useEffect(() => {
    if (empleado) {
      setFormData({ foto: empleado.foto || '', nombres: empleado.nombre || '', telefono: empleado.Celular || '', cargo: empleado.cargo || cargoCoordinadora, puntoVenta: empleado.area_nombre || puntoVentaCoordinadora, nombreLider });
    }
  }, [empleado]);

  const buscarInstructora = async (cat) => {
    if (!puntoVentaCoordinadora || !cat) return;
    setLoadingInstructora(true);
    try {
      const res = await fetch(`https://macfer.crepesywaffles.com/api/cap-pdvs?filters[cap_instructoras][${cat}][$eq]=true&filters[nombre][$eq]=${encodeURIComponent(puntoVentaCoordinadora)}&populate[cap_instructoras][filters][${cat}][$eq]=true`);
      const data = await res.json();
      const instr = data?.data?.[0]?.attributes?.cap_instructoras?.data?.[0];
      if (instr) {
        setInstructora(instr.attributes?.Nombre || '');
        message.success(`Instructora asignada: ${instr.attributes?.Nombre}`);
      } else {
        setInstructora(null);
        message.warning('No se encontró instructora.');
      }
    } catch (err) { setInstructora(null); } finally { setLoadingInstructora(false); }
  };

  useEffect(() => { if (categoria && empleado) buscarInstructora(categoria); }, [categoria]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!empleado || !categoria || !cargoEvaluar) return message.error('Complete los campos obligatorios');
    setMostrarModal(true);
  };

  const confirmarGuardado = async () => {
    setMostrarModal(false);
    try {
      await axios.post('https://macfer.crepesywaffles.com/api/cap-toderas', {
        data: {
          Nombre: formData.nombres, documento: documento.toString(), telefono: String(formData.telefono).replace(/\D/g, ''), pdv: formData.puntoVenta, lider: instructora || formData.nombreLider || '', foto: formData.foto || '', cargo: cargoEvaluar, cargo_empleado: formData.cargo, cargo_evaluar: cargoEvaluar, cargoEvaluar: cargoEvaluar, fecha: new Date().toISOString().split('T')[0], categoria: categoria?.toUpperCase()
        }
      });
      message.success('✓ Evaluación registrada');
      limpiarEmpleado(); setCategoria(''); setCargoEvaluar('');
    } catch (error) { message.error('Error al guardar la evaluación'); }
  };

  return (
    <div className="evaluacion-container-pl">
      <div className="evaluacion-header-pl">
        <h1>EVALUACIÓN TODERAS</h1>
        <p>Registra la evaluación cuando la persona esté 100% lista</p>
      </div>
      <div className="alerta-pl"><AlertTriangle size={20}/> SOLO SE PUEDE INSCRIBIR SI YA ESTÁ 100% LISTA</div>

      <form className="evaluacion-form-pl" onSubmit={handleSubmit}>
        <BuscarEmpleado documento={documento} setDocumento={(v) => setDocumento(v.replace(/\D/g, ''))} onBuscar={() => buscarEmpleado()} loading={loading} />
        {mensaje.texto && <div className={`mensaje-pl ${mensaje.tipo}`}>{mensaje.texto}</div>}

        {empleado && (
          <>
            {formData.foto && (
              <div className="employee-card-et-pl">
                <img src={formData.foto} alt="Foto empleado" className="employee-photo-et-pl"/>
                <div className="employee-info-et-pl">
                  <h3>{formData.nombres}</h3>
                  <p><Phone size={14}/> {formData.telefono}</p>
                  <p><BadgeCheck size={14}/> {formData.cargo}</p>
                  <p><Store size={14}/> {formData.puntoVenta}</p>
                </div>
              </div>
            )}
            <div className="form-section-pl">
              <label>CATEGORÍA A EVALUAR *</label>
              <select className="form-select-pl" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                <option value="">Seleccione la categoría</option>
                <option value="sal">Sal</option>
                <option value="dulce">Dulce</option>
                <option value="bebidas">Bebidas</option>
              </select>
            </div>
            <div className="form-section-pl">
              <label>CARGO A EVALUAR *</label>
              <Select className="form-select-pl" value={cargoEvaluar} onChange={setCargoEvaluar} options={opcionesCargoEvaluar} placeholder="Seleccione cargo" />
            </div>
            {categoria && (
              <div className="form-section-pl">
                <label>NOMBRE INSTRUCTORA {loadingInstructora && <Hourglass size={14} className="spin" />}</label>
                <input className="form-input-pl" value={loadingInstructora ? 'Buscando...' : (instructora || 'Sin asignar')} disabled />
              </div>
            )}
            <div className="form-actions-pl">
              <button type="button" className="btn-secondary-pl" onClick={limpiarEmpleado}>Limpiar</button>
              <button type="submit" className="btn-primary-pl">Registrar Evaluación</button>
            </div>
          </>
        )}
      </form>

      {mostrarModal && (
        <div className="modal-overlay-pl">
          <div className="modal-pl">
            <div className="modal-header-pl"><AlertTriangle size={24}/><h2> ADVERTENCIA</h2></div>
            <p>LA PERSONA INSCRITA DEBE ASISTIR OBLIGATORIAMENTE</p>
            <div className="modal-footer-pl">
              <button className="btn-secondary-pl" onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button className="btn-primary-pl" onClick={confirmarGuardado}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL (HUB DE RUTAS)
// ==========================================
export default function PortalLineasProducto({ userData, onLogout }) {
  const [currentView, setCurrentView] = useState('panel');

  return (
    <div className="portal-master-wrapper">
      <Navbar userData={userData} onLogout={onLogout} setView={setCurrentView} />
      <div className="portal-content-area">
        {currentView === 'panel' && <Panel />}
        {currentView === 'control-asistencia' && <ControlAsistencia />}
        {currentView === 'form-heladeria' && <FormInscripcionBase titulo="ESCUELA DEL CAFÉ HELADERÍA" diasHabiles={[1, 5]} />}
        {currentView === 'form-restaurante' && <FormInscripcionBase titulo="ESCUELA DEL CAFÉ PDV (RESTAURANTE)" diasHabiles={[2, 3, 4]} />}
        {currentView === 'form-todera' && <FormTodera />}
      </div>
    </div>
  );
}