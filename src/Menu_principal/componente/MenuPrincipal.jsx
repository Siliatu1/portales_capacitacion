import { useMenu } from "../hooks/useMenu";
import "../styles/menu.css";
import { useAuth } from "../../auth/hooks/useAuth";

const MenuPrincipal = () => {
  const { menu, loading, goTo } = useMenu();
  const { user } = useAuth();

  return (
    <div className="menu-container">
      {/* HEADER / NAVBAR */}
      <header className="menu-header">
        <div className="header-content">
          <div className="user-info">
            {user?.foto && <img src={user.foto} alt="Perfil" />}
            <h4>{user?.nombre || "Usuario"}</h4>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="menu-body">
        <header className="menu-title-section">
          <h1>Panel Principal</h1>
          <p style={{textAlign: 'left', color: '#7C6F64', letterSpacing: 'normal'}}>
            Selecciona una opción para comenzar a trabajar.
          </p>
        </header>

        {loading ? (
          <div className="loading-container">
            <p>Cargando opciones del sistema...</p>
          </div>
        ) : (
          <div className="menu-cards">
            {menu.map((item) => (
              <article
                key={item.id}
                className="menu-card"
                onClick={() => goTo(item.route)}
              >
                <h3>
                  {item.title}
                  <span className="arrow-icon">→</span>
                </h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuPrincipal;
