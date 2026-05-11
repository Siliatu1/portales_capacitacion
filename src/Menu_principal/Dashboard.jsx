import React from 'react';
import { LogOut, Coffee } from 'lucide-react';
import { useMenu } from "./hooks/useMenu";
import { useAuth } from "../auth/hooks/useAuth";
import "./Dashboard.css";

const Dashboard = () => {
  const { menu, loading, goTo } = useMenu();
  const { user } = useAuth();

  // Función para asignar iconos dinámicamente (opcional)
  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('café') || t.includes('línea')) return <Coffee size={28} />;
    return <Coffee size={28} />; // Icono por defecto
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="user-profile">
          <img 
            src={user?.foto || "https://api.dicebear.com/9.x/pixel-art/svg"} 
            className="user-avatar" 
            alt="User" 
          />
          <div className="user-info">
            <h2 className="user-name">{user?.nombre || "Nombre"}</h2>
            <p className="user-role">{user?.cargo_general || "CARGO"}</p>
          </div>
        </div>

        <button className="logout-button">
          <LogOut size={18} /> Salir
        </button>
      </header>

      {/* MAIN CONTENT */}
      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Cargando...</p>
        </div>
      ) : (
        <div className="portals-grid">
          {menu.map((item, index) => (
            <div 
              key={item.id || index}
              onClick={() => goTo(item.route)}
              className="portal-card active animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="icon-wrapper">
                {getIcon(item.title)}
              </div>
              <h3 className="portal-title">{item.title}</h3>
              <p className="portal-description">
                {item.description || "Accede a este módulo para gestionar tus tareas."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;