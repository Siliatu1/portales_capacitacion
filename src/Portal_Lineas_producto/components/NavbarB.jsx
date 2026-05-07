import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const NavbarCompact = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    if (typeof onLogout === 'function') onLogout();
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
            <span className="cargo">{user?.cargo_general || ""}</span>
          </div>
        </div>
      </div>
      <h2>Portal Líneas de Producto</h2>
      <div className="navbar-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
};

export default NavbarCompact;
