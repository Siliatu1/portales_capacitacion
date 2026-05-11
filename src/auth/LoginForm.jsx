import React, { useState } from 'react';
import { CreditCard, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { getEmpleados } from "./api/api";
import { useAuth } from "./hooks/useAuth";
import './LoginForm.css';

const LoginForm = () => {
  // Estados de lógica interna
  const [cedula, setCedula] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); // Previene la recarga de la página
    setIsLoading(true);
    setError("");

    try {
      const empleados = await getEmpleados(cedula);
      
      if (empleados?.ok && empleados?.data) {
        login(empleados.data);
        navigate("/dashboard");
      } else {
        setError("No tienes acceso o documento inválido");
      }
    } catch (err) {
      setError("Ocurrió un error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        
        <div className="input-group">
          <div className="input-wrapper">
            <div className="input-icon">
              <CreditCard size={18} />
            </div>
            <input
              type="text"
              value={cedula}
              // Mantiene el filtro de solo números
              onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
              placeholder="Documento del colaborador"
              className={`login-input ${error ? "input-error" : ""}`}
              required
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            <>
              Validar
              <ChevronRight size={18} className="arrow-icon" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;