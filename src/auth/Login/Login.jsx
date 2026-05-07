import { useState } from "react";
import { getEmpleados } from "../api/api";
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
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-content animate-fade-in">
          <div className="form-section">
            <input
              type="number"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              placeholder="Ingresa con tu documento"
              className="login-input"
              disabled={loading}
            />
            <button 
              className="btn-ingresar" 
              onClick={handleLogin} 
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : (
                <>
                  Ingresar <span className="chevron">›</span>
                </>
              )}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;