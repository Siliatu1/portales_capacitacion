import { useState } from "react";
import { getEmpleados } from "../api/api";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [documento, setDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const empleados = await getEmpleados(documento);
    console.log("Empleados obtenidos:", empleados);
    if (empleados?.ok && empleados?.data) {
      login(empleados.data);
      navigate("/menu");
    } else {
      setError("No tienes acceso o documento inválido");
    }

    setLoading(false);
    
  };

  return (
<div className="login-wrapper">
  <div className="login-container">
    <div className="login-card">
      <h3>PORTAL CREPES & WAFFLES</h3>
      <div className="input-group">
        <label htmlFor="documento">NÚMERO DE DOCUMENTO</label>
        <input
          id="documento"
          type="text"
          placeholder="Ej: 1023456789"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          className={error ? "input-error" : ""}
        />
      </div>
      <button className="btn-ingresar" onClick={handleLogin} disabled={loading}>
        {loading ? <span className="loader"></span> : "INGRESAR AL PORTAL"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  </div>
</div>
  );
};

export default Login;