import { useState } from "react";
import { getEmpleados } from "../api/api";
import "../styles/validacion-usuario.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ValidacionUsuario = () => {
  const [documento, setDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { validarUsuario } = useAuth();

  const handleValidacionUsuario = async () => {
    setLoading(true);
    setError("");

    const empleados = await getEmpleados(documento);
    if (empleados?.ok && empleados?.data) {
      validarUsuario(empleados.data);
      navigate("/menu");
    } else {
      setError("No tienes acceso o documento invalido");
    }

    setLoading(false);
  };

  return (
    <div className="validacion-usuario-wrapper">
      <div className="validacion-usuario-container">
        <div className="validacion-usuario-card">
          <h3>PORTAL CREPES & WAFFLES</h3>
          <div className="validacion-usuario-input-group">
            <label htmlFor="documento">NUMERO DE DOCUMENTO</label>
            <input
              id="documento"
              type="text"
              placeholder="Ej: 1023456789"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className={error ? "validacion-usuario-input-error" : ""}
            />
          </div>
          <button
            className="validacion-usuario-btn-ingresar"
            onClick={handleValidacionUsuario}
            disabled={loading}
          >
            {loading ? <span className="validacion-usuario-loader"></span> : "INGRESAR AL PORTAL"}
          </button>
          {error && <p className="validacion-usuario-error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ValidacionUsuario;

