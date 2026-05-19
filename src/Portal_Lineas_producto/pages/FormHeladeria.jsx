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
import Swal from "sweetalert2";

import "../styles/formularioHel.css";

const MAX_CUPOS_POR_FECHA = 3;

const FormHeladeria = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canBlockDates = hasPermission("canBlockDates");

  const { formData, handleChange, setFormData, setLoading } = useFormulario({
    initialState: getInitialFormState(),
  });

  const { empleado, buscarEmpleado, clearEmpleado } = useEmpleadoForm(setFormData);

  const { fechas, toggleFechaBloqueada, refreshFechas } = useFechas([1, 5]);

  // paginación de fechas: 3 por página
  const [page, setPage] = useState(0);

  const pageSize = 3;

  const paginas = useMemo(
    () => Math.max(1, Math.ceil(fechas.length / pageSize)),
    [fechas.length]
  );

  const currentPage = Math.min(page, paginas - 1);

  const fechasPaginadas = useMemo(() => {
    const start = currentPage * pageSize;

    return fechas.slice(start, start + pageSize);
  }, [fechas, currentPage]);

  useEffect(() => {
    if (!formData.fecha || !fechas.length) return;

    const fechaSeleccionada = fechas.find(
      (x) => x.fecha === formData.fecha
    );

    if (!fechaSeleccionada?.disponible) {
      setFormData((prev) => ({
        ...prev,
        fecha: "",
      }));
    }
  }, [fechas, formData.fecha, setFormData]);

  const [showDetails, setShowDetails] = useState(true);

  const [message, setMessage] = useState(null);

  const [lider] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      return user?.nombre || "";
    } catch {
      return "";
    }
  });

  const onSearch = async () => {
    setMessage(null);

    try {
      await buscarEmpleado(formData.documento);

      if (localStorage.getItem("lastEmpleado")) {
        // algunos hooks pueden guardar datos
      }

      setMessage({
        type: "success",
        text: "✓ Empleado encontrado",
      });
    } catch {
      setMessage({
        type: "error",
        text: "No se encontró empleado",
      });
    }
  };

  const onClear = async () => {
    const result = await Swal.fire({
      title: "¡Atención!",
      text: "¿Está seguro que desea cancelar y limpiar la inscripción?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    // reset
    setFormData(getInitialFormState());

    if (typeof clearEmpleado === "function") {
      clearEmpleado();
    }

    setMessage(null);

    setPage(0);

    Swal.fire({
      title: "Cancelado",
      text: "La reserva fue cancelada correctamente",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
  };

  const onSubmit = async () => {
    setMessage(null);

    try {
      // validar fecha seleccionada y disponibilidad
      if (!formData.fecha) {
        setMessage({
          type: "error",
          text: "Seleccione una fecha",
        });

        return;
      }

      const fechaObj = fechas.find(
        (x) => x.fecha === formData.fecha
      );

      if (!fechaObj || !fechaObj.disponible) {
        setMessage({
          type: "error",
          text: "La fecha seleccionada no está disponible",
        });

        return;
      }

      const result = await Swal.fire({
        title: "¡Atención!",
        text: "¿Desea inscribir esta reserva?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (!result.isConfirmed) return;

      setLoading(true);

      const cuposActuales = await getCuposFechaCapCafe(formData.fecha);

      if (cuposActuales >= MAX_CUPOS_POR_FECHA) {
        const text = "La fecha seleccionada ya completó los 3 cupos";

        setMessage({
          type: "error",
          text,
        });

        Swal.fire({
          title: "Sin cupos",
          text,
          icon: "error",
          confirmButtonColor: "#3085d6",
        });

        refreshFechas();

        return;
      }

      const attributes = buildInscripcionAttributes(formData, empleado);

      const res = await guardarInscripcion(attributes);

      if (res && (res.data || res.id)) {
        setMessage({
          type: "success",
          text: "Inscripción guardada correctamente",
        });

        Swal.fire({
          title: "¡Reserva confirmada!",
          text: "La inscripción fue realizada correctamente",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        refreshFechas();

        // limpiar completamente el formulario y empleado
        setFormData(getInitialFormState());

        if (typeof clearEmpleado === "function") {
          clearEmpleado();
        }

        setPage(0);
      } else {
        setMessage({
          type: "error",
          text: "Error al guardar la inscripción",
        });

        Swal.fire({
          title: "Error",
          text: "No se pudo confirmar la reserva",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Error de conexión al guardar",
      });

      Swal.fire({
        title: "Error",
        text: "Error de conexión al guardar la reserva",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSelectFecha = (f) => {
    setFormData((prev) => ({
      ...prev,
      fecha: f.fecha,
    }));
  };

  const onToggleFechaBloqueada = (event, f) => {
    event.stopPropagation();

    const action = f.estaBloqueada ? "desbloquear" : "bloquear";

    const confirmed = window.confirm(
      `Esta seguro de ${action} esta fecha?`
    );

    if (!confirmed) return;

    toggleFechaBloqueada(f.fecha);

    setMessage({
      type: "success",
      text: f.estaBloqueada
        ? "Fecha desbloqueada correctamente"
        : "Fecha bloqueada correctamente",
    });

    window.alert("Reserva actualizada");
  };

  const getFechaNoDisponibleLabel = (f) => {
    if (f.esFestivo) return "FESTIVO";

    if (f.estaBloqueada) return "BLOQUEADA";

    return "COMPLETO";
  };

  const onFechaKeyDown = (event, f) => {
    if (
      !f.disponible ||
      (event.key !== "Enter" && event.key !== " ")
    )
      return;

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

        <h2 className="inscripcion-title">
          ESCUELA DEL CAFÉ HELADERÍA
        </h2>

        <div className="search-row">
          <div className="search-input-container">
            <input
              name="documento"
              className="form-input search-input"
              placeholder="Número de documento"
              value={formData.documento}
              onChange={(e) => handleChange(e)}
            />

            <button
              className="search-button"
              onClick={onSearch}
            >
              Buscar
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mensaje ${
              message.type === "success"
                ? "success"
                : "error"
            }`}
          >
            {message.text}
          </div>
        )}

        <EmpleadoInfo
          empleado={empleado}
          formData={formData}
          handleChange={handleChange}
          lider={lider}
          showDetails={showDetails}
          onToggleDetails={() =>
            setShowDetails((s) => !s)
          }
        />

        {showDetails === "legacy" && empleado && (
          <div className="employee-info-container">
            <div className="employee-top">
              <img
                src={empleado.photo || ""}
                className="employee-photo"
                alt="foto"
                onError={(e) => {
                  e.currentTarget.onerror = null;

                  e.currentTarget.src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="%23F5E6D3"/><text x="50%" y="55%" font-size="18" font-family="Arial" fill="%238B7355" text-anchor="middle">Sin foto</text></svg>';
                }}
              />

              <div className="employee-meta">
                <div className="employee-name">
                  {empleado.nombre}
                </div>

                <div className="employee-role">
                  {empleado.cargo_general}
                </div>
              </div>
            </div>

            <button
              className="toggle-details"
              onClick={() =>
                setShowDetails((s) => !s)
              }
            >
              {showDetails
                ? "Ocultar información "
                : "Mostrar información "}
            </button>

            {showDetails && (
              <div className="employee-details">
                <div className="detail-row">
                  <label>Nombre completo</label>

                  <input
                    className="form-input"
                    value={empleado.nombre}
                    readOnly
                  />
                </div>

                <div className="detail-row">
                  <label>Teléfono</label>

                  <input
                    name="telefono"
                    className="form-input"
                    value={
                      formData.telefono ||
                      empleado.celular ||
                      ""
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="detail-row">
                  <label>Punto de venta</label>

                  <input
                    name="area_nombre"
                    className="form-input"
                    value={
                      formData.area_nombre || ""
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="detail-row">
                  <label>Líder</label>

                  <input
                    className="form-input"
                    value={lider || ""}
                    readOnly
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="fechas-section">
          <div className="fechas-grid">
            {fechasPaginadas.map((f) => (
              <div
                key={f.fecha}
                role="button"
                tabIndex={f.disponible ? 0 : -1}
                className={`fecha-card ${
                  !f.disponible
                    ? "no-disponible"
                    : ""
                } ${
                  f.estaBloqueada
                    ? "bloqueada"
                    : ""
                } ${
                  formData.fecha === f.fecha
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  f.disponible &&
                  onSelectFecha(f)
                }
                onKeyDown={(event) =>
                  onFechaKeyDown(event, f)
                }
                aria-disabled={!f.disponible}
              >
                {canBlockDates && (
                  <button
                    type="button"
                    className={`fecha-lock-toggle ${
                      f.estaBloqueada
                        ? "is-unlock"
                        : "is-lock"
                    }`}
                    title={
                      f.estaBloqueada
                        ? "Desbloquear fecha"
                        : "Bloquear fecha"
                    }
                    aria-label={
                      f.estaBloqueada
                        ? "Desbloquear fecha"
                        : "Bloquear fecha"
                    }
                    onClick={(event) =>
                      onToggleFechaBloqueada(
                        event,
                        f
                      )
                    }
                  >
                    {f.estaBloqueada ? (
                      <Unlock size={14} />
                    ) : (
                      <Lock size={14} />
                    )}
                  </button>
                )}

                {!f.disponible && (
                  <div className="fecha-no-disponible-label">
                    {getFechaNoDisponibleLabel(f)}
                  </div>
                )}

                <div className="fecha-mes">
                  {f.mes
                    ? f.mes.toUpperCase()
                    : ""}
                </div>

                <div className="fecha-dia">
                  {f.dia}
                </div>

                <div className="fecha-texto">
                  {f.texto || f.fecha}
                </div>

                <div className="fecha-contador">
                  {f.inscripciones || 0}/3
                </div>
              </div>
            ))}
          </div>

          <div className="fechas-pagination-container">
            <button
              className="pagination-button"
              onClick={() =>
                setPage((p) =>
                  Math.max(0, p - 1)
                )
              }
              disabled={page <= 0}
            >
              ‹
            </button>

            <div className="pagination-info">
              Página {currentPage + 1} de{" "}
              {paginas}
            </div>

            <button
              className="pagination-button"
              onClick={() =>
                setPage((p) =>
                  Math.min(
                    paginas - 1,
                    p + 1
                  )
                )
              }
              disabled={
                currentPage >= paginas - 1
              }
            >
              ›
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="cancel-button"
            onClick={onClear}
          >
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