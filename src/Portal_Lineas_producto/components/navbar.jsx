import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>

        <div className="user-info">
          <div className="avatar">
            {user?.foto ? (
              <img src={user.foto} alt="user" />
            ) : (
              <div className="avatar-fallback">
                {user?.nombre?.charAt(0) || "U"}
              </div>
            )}
          </div>

          <div>
            <h4>{user?.nombre || "Usuario"}</h4>
            <span>{user?.cargo_general || ""}</span>
          </div>
        </div>
      </div>
      <h2>Portal Líneas de Producto</h2>
      <div className="navbar-actions">
        <button
          className="action-btn"
          onClick={() => navigate("/lineas-producto/form-heladeria")}
        >
          Form Heladería
        </button>

        <button
          className="action-btn"
          onClick={() => navigate("/lineas-producto/form-restaurante")}
        >
          Form Restaurante
        </button>

        <button
          className="action-btn"
          onClick={() => navigate("/lineas-producto/control-asistencia")}
        >
          Control Asistencia
        </button>
         
        <button
          className="action-btn"
          onClick={() => navigate("/lineas-producto/form-todera")}
        >
          Form Todera
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
};

export default Navbar;