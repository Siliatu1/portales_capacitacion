import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import React, { useState } from "react";
import "./login.css";
import { loginByDocumento } from "../services/apiService";
import { useAuth } from "../shared/context/AuthContext";
import { validateUserAccess } from "./authRoles";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [documento, setDocumento] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const normalizarDocumento = (valor) => String(valor || '').replace(/\D/g, '');

  const handleLogin = async () => {
    if (!documento.trim()) {
      setMensaje({ texto: "Por favor ingrese su número de documento", tipo: "error" });
      return;
    }

    setLoading(true);
    setMensaje({ texto: "", tipo: "" });
    
    try {
      const rawData = await loginByDocumento(documento);
        
      
        const data = rawData;
        
        const validationResult = validateUserAccess(data);
        if (!validationResult.authorized) {
          setMensaje({ 
            texto: validationResult.message, 
            tipo: "error" 
          });
          setLoading(false);
          return;
        }
        
        setMensaje({ texto: "Documento validado correctamente", tipo: "success" });
    } 
    
    catch (error) {
      if (error?.status) {
        setMensaje({ 
          texto: `Documento no autorizado (Error ${error.status})`, 
          tipo: "error" 
        });
      } else {
        setMensaje({ texto: "Error de conexión al validar el documento", tipo: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  
  return (
    <div className="login-container">
      
    </div>
  );
};

export default Login;
