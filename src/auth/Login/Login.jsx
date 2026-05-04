import { useState } from "react";
import { getEmpleados } from "../api/api";
import { validarUsuario } from "../utils/validacion.utils";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [documento, setDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const empleados = await getEmpleados(documento);
    console.log("Empleados obtenidos:", empleados);
    if (empleados?.ok && empleados?.data) {
      localStorage.setItem("user", JSON.stringify(empleados.data));
      navigate("/menu");
    } else {
      setError("No tienes acceso o documento inválido");
    }

    setLoading(false);
    
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h3>PORTAL CREPES & WAFFLES</h3>

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