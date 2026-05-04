import { useState } from "react";
import { getEmpleados } from "../api/api";
import { validarUsuario } from "../utils/validacion.utils";
import "../styles/login.css";

const Login = () => {
  const [documento, setDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const empleados = await getEmpleados(documento);
    console.log("Empleados obtenidos:", empleados);
    if (empleados) {
    
      alert("Bienvenido " + empleados.data.nombre);
    } else {
      setError("No tienes acceso o documento inválido");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h3>PORTAL LINEAS DE PRODUCTO C&W</h3>

        <label>NÚMERO DE DOCUMENTO</label>

        <input
          type="text"
          placeholder="Ingresa tu documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Cargando..." : "INGRESAR"}
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;