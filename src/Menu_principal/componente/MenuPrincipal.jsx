import { useMenu } from "../hooks/useMenu";
import "../styles/menu.css";

const MenuPrincipal = () => {
  const { menu, loading, goTo } = useMenu();

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="menu-container">
      
      {/* HEADER */}
      <header className="menu-header">
        <div className="user-info">
          <div className="avatar">
            {user?.foto && (
              <img src={user.foto} alt="Avatar" />
            )}
          </div>
          <div>
            <h4>{user?.nombre || "Usuario"}</h4>
            <span>{user?.cargo_general || "Cargo"}</span>
          </div>
        </div>

        <h2>PORTAL CREPES & WAFFLES</h2>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Salir
        </button>
      </header>

      {/* BODY */}
      <div className="menu-body">
        <h3>Selecciona un portal</h3>

        {loading ? (
          <p>Cargando menú...</p>
        ) : (
          <div className="menu-cards">
            {menu.map((item) => (
              <div
                key={item.id}
                className="menu-card"
                onClick={() => goTo(item.route)}
              >
                <div className="icon"></div>

                <h4>{item.title}</h4>
                <p>{item.description}</p>

                <span className="arrow">→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPrincipal;