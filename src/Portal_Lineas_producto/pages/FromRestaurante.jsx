import { useFormulario } from "../hooks/useFormulario";
import { useEmpleado } from "../hooks/useEmpleado";
import { useFechas } from "../hooks/useFechas";
import { guardarInscripcion } from "../services/formulario.service";
import { getInitialFormState, buildInscripcionAttributes } from "../utils/formularioHel.utils";
import { useState, useMemo, useEffect } from "react";

import "../styles/formularioHel.css";

const FormRestaurante = () => {
  const { formData, handleChange, setFormData, setLoading } = useFormulario({
    initialState: getInitialFormState(),
  });

  const { empleado, buscarEmpleado, clearEmpleado } = useEmpleado(setFormData);

  // martes(2), miércoles(3), jueves(4)
  const { fechas } = useFechas([2, 3, 4]);

  // paginación fechas
  const [page, setPage] = useState(0);
  const pageSize = 3;
  const paginas = useMemo(() => Math.max(1, Math.ceil(fechas.length / pageSize)), [fechas.length]);
  const fechasPaginadas = useMemo(() => {
    const start = page * pageSize;
    return fechas.slice(start, start + pageSize);
  }, [fechas, page]);

  useEffect(() => setPage(0), [fechas.length]);

  const [message, setMessage] = useState(null);
  const [lider, setLider] = useState("");

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

      setLoading(true);
      const attributes = buildInscripcionAttributes(formData, empleado);
      const res = await guardarInscripcion(attributes);
      if (res && (res.data || res.id)) {
        // reset
        setFormData(getInitialFormState());
        if (typeof clearEmpleado === 'function') clearEmpleado();
        setMessage({ type: 'success', text: 'Inscripción guardada correctamente' });
      } else {
        setMessage({ type: 'error', text: 'Error al guardar la inscripción' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error de conexión al guardar' });
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setFormData(getInitialFormState());
    if (typeof clearEmpleado === 'function') clearEmpleado();
  };

  const onSelectFecha = (f) => {
    if (!f.disponible) return;
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

        {empleado && (
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
            <button
              key={f.fecha}
              type="button"
              className={`fecha-card ${!f.disponible ? 'no-disponible' : ''} ${formData.fecha === f.fecha ? 'selected' : ''}`}
              onClick={() => onSelectFecha(f)}
              disabled={!f.disponible}
            >
              {!f.disponible && <div className="fecha-no-disponible-label">{f.esFestivo ? 'FESTIVO' : 'COMPLETO'}</div>}
              <div className="fecha-mes">{f.mes ? f.mes.toUpperCase() : ''}</div>
              <div className="fecha-dia">{f.dia}</div>
              <div className="fecha-texto">{f.texto}</div>
              <div className="fecha-contador">{f.inscripciones || 0}/3</div>
            </button>
          ))}
        </div>

        <div className="fechas-pagination-container">
          <button className="pagination-button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page <= 0}>‹</button>
          <div className="pagination-info">Página {page + 1} de {paginas}</div>
          <button className="pagination-button" onClick={() => setPage((p) => Math.min(paginas - 1, p + 1))} disabled={page >= paginas - 1}>›</button>
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