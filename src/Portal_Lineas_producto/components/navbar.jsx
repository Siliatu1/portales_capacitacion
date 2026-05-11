import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { useAuth } from "../../auth/hooks/useAuth";

const NAV_ITEMS = [
  {
    view: "FORM_HELADERIA",
    label: "Form Heladeria",
    route: "/lineas-producto/form-heladeria",
  },
  {
    view: "FORM_RESTAURANTE",
    label: "Form Restaurante",
    route: "/lineas-producto/form-restaurante",
  },
  {
    view: "CONTROL_ASISTENCIA",
    label: "Control Asistencia",
    route: "/lineas-producto/control-asistencia",
  },
  {
    view: "FORM_TODERA",
    label: "Form Todera",
    route: "/lineas-producto/form-todera",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, canAccessView } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &larr;
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
      <h2>Portal Lineas de Producto</h2>
      <div className="navbar-actions">
        {NAV_ITEMS.filter((item) => canAccessView(item.view)).map((item) => (
          <button
            key={item.view}
            className="action-btn"
            onClick={() => navigate(item.route)}
          >
            {item.label}
          </button>
        ))}

        <button className="logout-btn" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
};

export default Navbar;
