import { useFormulario } from "../hooks/useFormulario";
import { useEmpleado } from "../hooks/useEmpleado";
import { useFechas } from "../hooks/useFechas";
import { guardarInscripcion } from "../services/formulario.service";
import { getInitialFormState, buildInscripcionAttributes } from "../utils/formularioHel.utils";
import { useState, useMemo, useEffect } from "react";

import "../styles/formularioHel.css";

const FormHeladeria = () => {
  const { formData, handleChange, setFormData, resetForm, setLoading } = useFormulario({
    initialState: getInitialFormState(),
  });

  const { empleado, buscarEmpleado, loading, clearEmpleado } = useEmpleado(setFormData);

  const { fechas } = useFechas([1, 5]);

  // paginación de fechas: 3 por página
  const [page, setPage] = useState(0);
  const pageSize = 3;

  const paginas = useMemo(() => Math.max(1, Math.ceil(fechas.length / pageSize)), [fechas.length]);
  const fechasPaginadas = useMemo(() => {
    const start = page * pageSize;
    return fechas.slice(start, start + pageSize);
  }, [fechas, page]);

  // reset page when fechas change
  useEffect(() => {
    setPage(0);
  }, [fechas.length]);

  const [showDetails, setShowDetails] = useState(true);
  const [message, setMessage] = useState(null);
  const [lider, setLider] = useState("");

  const onSearch = async () => {
    setMessage(null);
    try {
      await buscarEmpleado(formData.documento);
      if (localStorage.getItem("lastEmpleado")) {
        // algunos hooks pueden guardar datos, pero mostramos mensaje según `empleado`
      }
      setMessage({ type: "success", text: "✓ Empleado encontrado" });
    } catch (err) {
      setMessage({ type: "error", text: "No se encontró empleado" });
    }
  };

  const onClear = () => {
    // reset to initial state and clear empleado
    setFormData(getInitialFormState());
    if (typeof clearEmpleado === 'function') clearEmpleado();
    setMessage(null);
    setPage(0);
  };

  const onSubmit = async () => {
    setMessage(null);
    try {
      setLoading(true);

      // validar fecha seleccionada y disponibilidad
      if (!formData.fecha) {
        setMessage({ type: 'error', text: 'Seleccione una fecha' });
        setLoading(false);
        return;
      }

      const fechaObj = fechas.find((x) => x.fecha === formData.fecha);
      if (!fechaObj || !fechaObj.disponible) {
        setMessage({ type: 'error', text: 'La fecha seleccionada no está disponible' });
        setLoading(false);
        return;
      }

      const attributes = buildInscripcionAttributes(formData, empleado);

      const res = await guardarInscripcion(attributes);

      if (res && (res.data || res.id)) {
        setMessage({ type: "success", text: "Inscripción guardada correctamente" });
        // limpiar completamente el formulario y empleado
        setFormData(getInitialFormState());
        if (typeof clearEmpleado === 'function') clearEmpleado();
        setPage(0);
      } else {
        setMessage({ type: "error", text: "Error al guardar la inscripción" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error de conexión al guardar" });
    } finally {
      setLoading(false);
    }
  };

  const onSelectFecha = (f) => {
    setFormData((prev) => ({ ...prev, fecha: f.fecha }));
  };

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLider(user?.nombre || "");
    } catch (err) {
      setLider("");
    }
  }, []);

  return (
    <div className="inscripcion-container">
      <div className="inscripcion-card">

        <h2 className="inscripcion-title">ESCUELA DEL CAFÉ HELADERÍA</h2>

        <div className="search-row">
          <div className="search-input-container">
            <input
              name="documento"
              className="form-input search-input"
              placeholder="Número de documento"
              value={formData.documento}
              onChange={(e) => handleChange(e)}
            />
            <button className="search-button" onClick={onSearch}>
              Buscar
            </button>
          </div>
        </div>

        {message && (
          <div className={`mensaje ${message.type === "success" ? "success" : "error"}`}>
            {message.text}
          </div>
        )}

        {empleado && (
          <div className="employee-info-container">
            <div className="employee-top">
              <img
                src={empleado.photo || ''}
                className="employee-photo"
                alt="foto"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="%23F5E6D3"/><text x="50%" y="55%" font-size="18" font-family="Arial" fill="%238B7355" text-anchor="middle">Sin foto</text></svg>'; }}
              />
              <div className="employee-meta">
                <div className="employee-name">{empleado.nombre}</div>
                <div className="employee-role">{empleado.cargo_general}</div>
              </div>
            </div>

            <button
              className="toggle-details"
              onClick={() => setShowDetails((s) => !s)}
            >
              {showDetails ? "Ocultar información " : "Mostrar información "}
            </button>

            {showDetails && (
              <div className="employee-details">
                <div className="detail-row">
                  <label>Nombre completo</label>
                  <input className="form-input" value={empleado.nombre} readOnly />
                </div>
                <div className="detail-row">
                  <label>Teléfono</label>
                  <input
                    name="telefono"
                    className="form-input"
                    value={formData.telefono || empleado.celular || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="detail-row">
                  <label>Punto de venta</label>
                  <input
                    name="area_nombre"
                    className="form-input"
                    value={formData.area_nombre|| ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="detail-row">
                  <label>Líder</label>
                  <input className="form-input" value={lider || ""} readOnly />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="fechas-section">
          <div className="fechas-grid">
            {fechasPaginadas.map((f) => (
              <button
                key={f.fecha}
                type="button"
                className={`fecha-card ${!f.disponible ? 'no-disponible' : ''} ${formData.fecha === f.fecha ? 'selected' : ''}`}
                onClick={() => f.disponible && onSelectFecha(f)}
                disabled={!f.disponible}
              >
                {!f.disponible && (
                  <div className="fecha-no-disponible-label">{f.esFestivo ? 'FESTIVO' : 'COMPLETO'}</div>
                )}

                <div className="fecha-mes">{f.mes ? f.mes.toUpperCase() : ''}</div>
                <div className="fecha-dia">{f.dia}</div>
                  <div className="fecha-texto">{f.texto || f.fecha}</div>
                  <div className="fecha-contador">{f.inscripciones || 0}/3</div>
              </button>
            ))}
          </div>

          <div className="fechas-pagination-container">
            <button
              className="pagination-button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page <= 0}
            >
              ‹
            </button>

            <div className="pagination-info">Página {page + 1} de {paginas}</div>

            <button
              className="pagination-button"
              onClick={() => setPage((p) => Math.min(paginas - 1, p + 1))}
              disabled={page >= paginas - 1}
            >
              ›
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button className="cancel-button" onClick={onClear}>
            Limpiar
          </button>
          <button
            className="submit-button"
            onClick={onSubmit}
            disabled={false}
          >
            Inscribir
          </button>
        </div>

      </div>
    </div>
  );
};

export default FormHeladeria;