import { useFormulario } from "../hooks/useFormulario";
import { useEmpleadoForm } from "../hooks/useEmpleado";
import { useFechas } from "../hooks/useFechas";
import { useAuth } from "../../auth/hooks/useAuth";
import { getCuposFechaCapCafe, guardarInscripcion } from "../services/formulario.service";
import { getInitialFormState, buildInscripcionAttributes } from "../utils/formularioHel.utils";
import EmpleadoInfo from "../components/EmpleadoInfo";
import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Lock, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../styles/formularioHel.css";

const MAX_CUPOS_POR_FECHA = 3;

const FormRestaurante = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canBlockDates = hasPermission("canBlockDates");
  const { formData, handleChange, setFormData, setLoading } = useFormulario({
    initialState: getInitialFormState(),
  });

  const { empleado, buscarEmpleado, clearEmpleado } = useEmpleadoForm(setFormData);

  // martes(2), miércoles(3), jueves(4)
  const { fechas, toggleFechaBloqueada, refreshFechas } = useFechas([2, 3, 4]);

  // paginación fechas
  const [page, setPage] = useState(0);
  const pageSize = 3;
  const paginas = useMemo(() => Math.max(1, Math.ceil(fechas.length / pageSize)), [fechas.length]);
  const currentPage = Math.min(page, paginas - 1);
  const fechasPaginadas = useMemo(() => {
    const start = currentPage * pageSize;
    return fechas.slice(start, start + pageSize);
  }, [fechas, currentPage]);

  useEffect(() => {
    if (!formData.fecha || !fechas.length) return;

    const fechaSeleccionada = fechas.find((x) => x.fecha === formData.fecha);
    if (!fechaSeleccionada?.disponible) {
      setFormData((prev) => ({ ...prev, fecha: "" }));
    }
  }, [fechas, formData.fecha, setFormData]);

  const [message, setMessage] = useState(null);
  const [lider] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.nombre || "";
    } catch {
      return "";
    }
  });
  const [showDetails, setShowDetails] = useState(true);

  const onSubmit = async () => {
    try {
      setMessage(null);
      if (!formData.fecha) {
        setMessage({ type: 'error', text: 'Seleccione una fecha' });
        return;
      }

      const fechaObj = fechas.find((x) => x.fecha === formData.fecha);
      if (!fechaObj || !fechaObj.disponible) {
        setMessage({ type: 'error', text: 'La fecha seleccionada no está disponible' });
        return;
      }

      const confirmed = window.confirm("Desea inscribir esta reserva?");

      if (!confirmed) return;

      setLoading(true);

      const cuposActuales = await getCuposFechaCapCafe(formData.fecha);

      if (cuposActuales >= MAX_CUPOS_POR_FECHA) {
        const text = "La fecha seleccionada ya completo los 3 cupos";
        setMessage({ type: "error", text });
        window.alert(text);
        refreshFechas();
        return;
      }

      const attributes = buildInscripcionAttributes(formData, empleado);
      const res = await guardarInscripcion(attributes);
      if (res && (res.data || res.id)) {
        // reset
        setFormData(getInitialFormState());
        if (typeof clearEmpleado === 'function') clearEmpleado();
        setMessage({ type: 'success', text: 'Inscripción guardada correctamente' });
        window.alert("Reserva confirmada!");
        refreshFechas();
      } else {
        setMessage({ type: 'error', text: 'Error al guardar la inscripción' });
        window.alert("No se pudo confirmar la reserva");
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión al guardar' });
      window.alert("Error de conexion al guardar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    const confirmed = window.confirm("Desea cancelar y limpiar la reserva?");

    if (!confirmed) return;

    setFormData(getInitialFormState());
    if (typeof clearEmpleado === 'function') clearEmpleado();
    window.alert("Reserva cancelada");
  };

  const onSelectFecha = (f) => {
    if (!f.disponible) return;
    setFormData((prev) => ({ ...prev, fecha: f.fecha }));
  };

  const onToggleFechaBloqueada = (event, f) => {
    event.stopPropagation();
    const action = f.estaBloqueada ? "desbloquear" : "bloquear";
    const confirmed = window.confirm(`Esta seguro de ${action} esta fecha?`);

    if (!confirmed) return;

    toggleFechaBloqueada(f.fecha);
    setMessage({
      type: "success",
      text: f.estaBloqueada ? "Fecha desbloqueada correctamente" : "Fecha bloqueada correctamente",
    });
    window.alert("Reserva actualizada");
  };

  const getFechaNoDisponibleLabel = (f) => {
    if (f.esFestivo) return "FESTIVO";
    if (f.estaBloqueada) return "BLOQUEADA";
    return "COMPLETO";
  };

  const onFechaKeyDown = (event, f) => {
    if (!f.disponible || (event.key !== "Enter" && event.key !== " ")) return;

    event.preventDefault();
    onSelectFecha(f);
  };

  return (
    <div className="inscripcion-container">
      <div className="inscripcion-card">
        <div className="form-page-header">
          <button
            type="button"
            className="back-to-panel-button"
            onClick={() => navigate("/lineas-producto")}
          >
            <ArrowLeft size={18} />
            Volver al panel
          </button>
        </div>

        <h2>ESCUELA DEL CAFÉ PDV</h2>

        <div className="search-row">
          <div className="search-input-container">
            <input
              name="documento"
              className="form-input search-input"
              placeholder="Número de documento"
              value={formData.documento}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <button
              className="search-button"
              onClick={() => buscarEmpleado(formData.documento)}
            >
              Buscar
            </button>
          </div>
        </div>

        <EmpleadoInfo
          empleado={empleado}
          formData={formData}
          handleChange={handleChange}
          lider={lider}
          showDetails={showDetails}
          onToggleDetails={() => setShowDetails((s) => !s)}
        />

        {showDetails === "legacy" && empleado && (
          <div className="employee-info-container">
            <img src={empleado.photo || ''} className="employee-photo" alt="foto" />
            <div className="employee-meta">
              <div className="employee-name">{empleado.nombre}</div>
              <div className="employee-role">{empleado.cargo_general}</div>
            </div>
                    <div className="detail-row">
          <label>Teléfono</label>
          <input
            name="telefono"
            className="form-input"
            value={formData.telefono || empleado?.celular || ''}
            onChange={handleChange}
          />
        </div>

        <div className="detail-row">
          <label>Punto de venta</label>
          <input
            name="area_nombre"
            className="form-input"
            value={formData.area_nombre || empleado?.area_nombre || ''}
            onChange={handleChange}
          />
        </div>
        <div className="detail-row">
          <label>Líder</label>
          <input className="form-input" value={lider || ""} readOnly />
        </div>
          </div>
        )}

        {message && (
          <div className={`mensaje ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <div className="fechas-grid">
          {fechasPaginadas.map((f) => (
            <div
              key={f.fecha}
              role="button"
              tabIndex={f.disponible ? 0 : -1}
              className={`fecha-card ${!f.disponible ? 'no-disponible' : ''} ${f.estaBloqueada ? 'bloqueada' : ''} ${formData.fecha === f.fecha ? 'selected' : ''}`}
              onClick={() => onSelectFecha(f)}
              onKeyDown={(event) => onFechaKeyDown(event, f)}
              aria-disabled={!f.disponible}
            >
              {canBlockDates && (
                <button
                  type="button"
                  className={`fecha-lock-toggle ${f.estaBloqueada ? "is-unlock" : "is-lock"}`}
                  title={f.estaBloqueada ? "Desbloquear fecha" : "Bloquear fecha"}
                  aria-label={f.estaBloqueada ? "Desbloquear fecha" : "Bloquear fecha"}
                  onClick={(event) => onToggleFechaBloqueada(event, f)}
                >
                  {f.estaBloqueada ? <Unlock size={14} /> : <Lock size={14} />}
                </button>
              )}

              {!f.disponible && <div className="fecha-no-disponible-label">{getFechaNoDisponibleLabel(f)}</div>}
              <div className="fecha-mes">{f.mes ? f.mes.toUpperCase() : ''}</div>
              <div className="fecha-dia">{f.dia}</div>
              <div className="fecha-texto">{f.texto}</div>
              <div className="fecha-contador">{f.inscripciones || 0}/3</div>
            </div>
          ))}
        </div>

        <div className="fechas-pagination-container">
          <button className="pagination-button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page <= 0}>‹</button>
          <div className="pagination-info">Página {currentPage + 1} de {paginas}</div>
          <button className="pagination-button" onClick={() => setPage((p) => Math.min(paginas - 1, p + 1))} disabled={currentPage >= paginas - 1}>›</button>
        </div>

        <div className="form-actions">
          <button className="cancel-button" onClick={onClear}>Limpiar</button>
          <button className="submit-button" onClick={onSubmit}>Inscribir</button>
        </div>

      </div>
    </div>
  );
};

export default FormRestaurante;
