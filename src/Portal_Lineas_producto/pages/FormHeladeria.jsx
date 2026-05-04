import { useFormulario } from "../hooks/useFormulario";
import { useEmpleado } from "../hooks/useEmpleado";
import { useFechas } from "../hooks/useFechas";
import { obtenerMeses } from "../utils/fechasHel.utils";

import "../styles/formularioHel.css";

const FormHeladeria = () => {
  const { formData, handleChange, setFormData } = useFormulario({
    initialState: {
      documento: "",
      telefono: "",
      fecha: "",
    },
  });

  const { empleado, buscarEmpleado, loading } =
    useEmpleado(setFormData);

  const { fechas } = useFechas();

  return (
    <div className="inscripcion-container">
      <div className="inscripcion-card">

        <h2>ESCUELA DEL CAFÉ HELADERÍA</h2>

        {/* DOCUMENTO */}
        <div className="search-input-container">
          <input
            name="documento"
            className="form-input"
            value={formData.documento}
            onChange={(e) => {
              handleChange(e);
              buscarEmpleado(e.target.value);
            }}
          />
        </div>

        {/* EMPLEADO */}
        {empleado && (
          <div className="employee-info-container">
            <img
              src={empleado.photo}
              className="employee-photo"
            />
            <p>{empleado.nombre}</p>
          </div>
        )}

        {/* TELÉFONO (EDITABLE) */}
        <div className="form-section">
          <label className="form-label">TELÉFONO</label>

          <input
            name="telefono"
            className="form-input"
            value={formData.telefono || ""}
            onChange={handleChange}
            placeholder="Ingrese teléfono"
          />

          {!empleado?.telefono && (
            <small style={{ color: "orange" }}>
              Este usuario no tiene teléfono, debes ingresarlo
            </small>
          )}
        </div>

        {/* FECHAS */}
        <div className="fechas-grid">
          {fechas.map((f) => (
            <div
              key={f.fecha}
              className={`fecha-card ${
                formData.fecha === f.fecha ? "selected" : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  fecha: f.fecha,
                }))
              }
            >
              {f.dia}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FormHeladeria;