import { useMenu } from "../hooks/useMenu";
import "../styles/menu.css";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const MenuPrincipal = () => {
  const { menu, loading, goTo } = useMenu();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const getCardClassName = (title = "") => {
    const normalizedTitle = title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (normalizedTitle.includes("instructora")) {
      return "menu-card menu-card-instructoras animate-fade-in";
    }

    return "menu-card menu-card-lineas animate-fade-in";
  };

  return (
    <div className="menu-container">
      <header className="menu-header">
        <div className="header-content">
          <div className="user-info">
            {user?.foto && <img src={user.foto} alt="Perfil" className="user-avatar" />}
            <div className="user-details">
              <p className="user-name">{user?.nombre || "Usuario"}</p>
            </div>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
              aria-label="Cerrar sesion"
            >
              <LogOut size={18} />
              Cerrar sesion
            </button>
          </div>
        </div>
      </header>

      <main className="menu-body">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Cargando opciones del sistema...</p>
          </div>
        ) : (
          <div className="menu-wrapper">
            <div className="menu-header-section">
              <h2>Bienvenido</h2>
              <p>Selecciona una opción para continuar</p>
            </div>
            <div className="menu-cards">
              {menu.map((item, index) => (
                <article
                  key={item.id}
                  className={getCardClassName(item.title)}
                  style={{ animationDelay: `${index * 0.1}s` }} /* Detalle extra para entrada escalonada */
                  onClick={() => goTo(item.route)}
                >
                  <div className="card-header">
                    <h3>{item.title}</h3>
                    <span className="arrow-icon">›</span>
                  </div>
                  <p className="card-description">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuPrincipal;
