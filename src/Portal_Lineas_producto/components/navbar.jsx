import { useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut, IceCream, Utensils, User, Bell } from 'lucide-react';
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="navbar-container">
        {/* Sección Izquierda: Navegación y Perfil */}
        <div className="navbar-left">
          <button 
            className="back-btn" 
            onClick={() => navigate(-1)}
            title="Volver"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="user-profile">
            <div className="avatar-wrapper">
              {user?.foto ? (
                <img src={user.foto} className="avatar" alt="Perfil" />
              ) : (
                <div className="avatar-fallback">
                  {user?.nombre?.charAt(0) || <User size={20} />}
                </div>
              )}
            </div>
            <div className="user-details">
              <h4>{user?.nombre || "Usuario Invitado"}</h4>
              <span>{user?.cargo_general || "Sin cargo asignado"}</span>
            </div>
          </div>
        </div>

        {/* Sección Derecha: Acciones Rápidas */}
        <div className="navbar-actions">
          <button
            className="action-btn"
            onClick={() => navigate("/lineas-producto/form-heladeria")}
          >
            <IceCream />
            <span>Heladería</span>
          </button>

          <button
            className="action-btn"
            onClick={() => navigate("/lineas-producto/form-restaurante")}
          >
            <Utensils />
            <span>Restaurante</span>
          </button>

          <button 
            className="logout-btn" 
            onClick={handleLogout}
            title="Cerrar Sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>
  );
};

export default Navbar;