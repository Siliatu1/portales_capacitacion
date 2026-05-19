import { Eye, EyeOff, MapPin } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const EmpleadoInfo = ({
  empleado,
  formData = {},
  handleChange,
  lider = "",
  showDetails = true,
  onToggleDetails,
}) => {
  if (!empleado) return null;

  const telefono = formData.telefono || empleado.celular || empleado.telefono || "";
  const puntoVenta = formData.area_nombre || empleado.area_nombre || empleado.pdv || "";
  const cargo = empleado.cargo_general || empleado.cargo || "";

  return (
    <div className="employee-info-container">
      <button
        type="button"
        className="toggle-details"
        onClick={onToggleDetails}
      >
        {showDetails ? <EyeOff size={14} /> : <Eye size={14} />}
        {showDetails ? "Ocultar informacion" : "Mostrar informacion"}
      </button>

      {showDetails && (
        <div className="employee-details-panel">
          <div className="employee-photo-block">
            <span className="employee-field-label">Foto</span>
            {empleado.photo ? (
              <img
                src={empleado.photo}
                className="employee-photo"
                alt="foto"
              />
            ) : (
              <div className="employee-photo employee-photo-placeholder">
                {getInitials(empleado.nombre) || "SF"}
              </div>
            )}
          </div>

          <div className="employee-details">
            <div className="detail-row employee-detail-full">
              <label>Nombres completos *</label>
              <input className="form-input" value={empleado.nombre || ""} readOnly />
            </div>

            <div className="detail-row employee-detail-full">
              <label>Telefono *</label>
              <input
                name="telefono"
                className="form-input"
                value={telefono}
                onChange={handleChange}
              />
            </div>

            <div className="detail-row employee-detail-full">
              <label>Cargo *</label>
              <input className="form-input" value={cargo} readOnly />
            </div>

            <div className="detail-row employee-detail-full employee-location-row">
              <label>Punto de venta</label>
              <div className="employee-input-with-icon">
                <input
                  name="area_nombre"
                  className="form-input"
                  value={puntoVenta}
                  onChange={handleChange}
                />
                <MapPin size={16} />
              </div>
            </div>

            <div className="detail-row employee-detail-full">
              <label>Lider</label>
              <input className="form-input" value={lider || ""} readOnly />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpleadoInfo;
