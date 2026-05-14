import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  useState,
} from "react";

import "../styles/navbar.css";

import { useAuth } from "../../auth/hooks/useAuth";

const NAV_ITEMS = [
  {
    view: "FORM_HELADERIA",
    label: "Heladería",
    route:
      "/lineas-producto/form-heladeria",
  },

  {
    view: "FORM_RESTAURANTE",
    label: "Restaurante",
    route:
      "/lineas-producto/form-restaurante",
  },

  {
    view: "CONTROL_ASISTENCIA",
    label: "Asistencia",
    route:
      "/lineas-producto/control-asistencia",
  },

  {
    view: "FORM_TODERA",
    label: "Todera",
    route:
      "/lineas-producto/form-todera",
  },
];

const INSCRIPCIONES_ITEMS = [
  {
    label: "Escuela Café",
    route:
      "/lineas-producto/inscripciones/cafe",
  },

  {
    label: "Todera",
    route:
      "/lineas-producto/inscripciones/todera",
  },

  
];

const Navbar = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [openSubmenu, setOpenSubmenu] =
    useState(true);

  const {
    logout,
    canAccessView,
  } = useAuth();

  const handleLogout =
    () => {
      logout();
      navigate("/");
    };

  return (
    <aside className="sidebar">
      {/* TOP */}
      <div className="sidebar-top">
        <div className="brand">
          <h2>Portal C&W</h2>

          <p>
            Líneas de Producto
          </p>
        </div>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        {NAV_ITEMS.filter(
          (item) =>
            canAccessView(
              item.view
            )
        ).map((item) => {
          const isActive =
            location.pathname ===
            item.route;

          return (
            <button
              key={item.view}
              className={`menu-item ${
                isActive
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                navigate(
                  item.route
                )
              }
            >
              {item.label}
            </button>
          );
        })}

        {/* SUBMENU */}

        <div className="submenu-wrapper">
          <button
            className="submenu-toggle"
            onClick={() =>
              setOpenSubmenu(
                !openSubmenu
              )
            }
          >
            <span>
              Inscripciones
            </span>

            <span
              className={`arrow ${
                openSubmenu
                  ? "open"
                  : ""
              }`}
            >
              ▼
            </span>
          </button>

          {openSubmenu && (
            <div className="submenu-items">
              {INSCRIPCIONES_ITEMS.map(
                (item) => {
                  const isActive =
                    location.pathname ===
                    item.route;

                  return (
                    <button
                      key={item.route}
                      className={`submenu-item ${
                        isActive
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        navigate(
                          item.route
                        )
                      }
                    >
                      {item.label}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        <button
          className="logout-btn"
          onClick={
            handleLogout
          }
        >
          Salir
        </button>
      </div>
    </aside>
  );
};

export default Navbar;