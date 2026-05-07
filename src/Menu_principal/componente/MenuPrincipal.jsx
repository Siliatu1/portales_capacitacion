import { useMenu } from "../hooks/useMenu";
import "../styles/menu.css";

const MenuPrincipal = () => {
  const { menu, loading, goTo } = useMenu();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="menu-container">
      {/* HEADER / NAVBAR */}
      <header className="menu-header">
        <div className="header-content">
          <div className="user-info">
            {user?.foto && <img src={user.foto} alt="Perfil" className="user-avatar" />}
            <div className="user-details">
              <p className="user-name">{user?.nombre || "Usuario"}</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
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
                  className="menu-card animate-fade-in"
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