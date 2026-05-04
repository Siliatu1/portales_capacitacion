import { useFormulario } from "../hooks/useFormulario";
import { useEmpleado } from "../hooks/useEmpleado";
import { useFechas } from "../hooks/useFechas";

import "../styles/formularioHel.css";

const FormRestaurante = () => {
  const { formData, handleChange, setFormData } = useFormulario({
    initialState: {
      documento: "",
      telefono: "",
      puntoVenta: "",
      fecha: "",
    },
  });

  const { empleado, buscarEmpleado } =
    useEmpleado(setFormData);

  const { fechas } = useFechas();

  return (
    <div className="inscripcion-container">
      <div className="inscripcion-card">

        <h2>ESCUELA DEL CAFÉ PDV</h2>

        {/* DOCUMENTO */}
        <input
          name="documento"
          className="form-input"
          value={formData.documento}
          onChange={(e) => {
            handleChange(e);
            buscarEmpleado(e.target.value);
          }}
        />

        {/* EMPLEADO */}
        {empleado && (
          <div className="employee-info-container">
            <img
              src={empleado.photo}
              className="employee-photo"
            />
            <p>{empleado.nombre}</p>
            <p>{empleado.cargo_general}</p>
          </div>
        )}

        {/* TELÉFONO */}
        <input
          name="telefono"
          className="form-input"
          value={formData.telefono || ""}
          onChange={handleChange}
          placeholder="Teléfono"
        />

        {/* PUNTO DE VENTA */}
        <input
          name="puntoVenta"
          className="form-input"
          value={formData.puntoVenta}
          onChange={handleChange}
          placeholder="Punto de venta"
        />

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

export default FormRestaurante;