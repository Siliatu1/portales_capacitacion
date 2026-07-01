import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  ClipboardList,
  ClipboardCheck,
  Coffee,
  House,
  IceCreamBowl,
  UtensilsCrossed,
  UserCog,
} from "lucide-react";

import "../styles/navbar.css";

import { useAuth } from "../../auth/hooks/useAuth";

const NAV_ITEMS = [
  {
    view: "FORM_HELADERIA",
    label: "Formulario Inscripción Heladería",
    route:
      "/lineas-producto/form-heladeria",
    icon: IceCreamBowl,
  },

  {
    view: "FORM_RESTAURANTE",
    label: "Formulario Inscripción Restaurante",
    route:
      "/lineas-producto/form-restaurante",
    icon: UtensilsCrossed,
  },

  {
    view: "CONTROL_ASISTENCIA",
    label: "Asistencia",
    route:
      "/lineas-producto/control-asistencia",
    hidden: true,
    icon: ClipboardCheck,
  },

  {
    view: "CONTROL_ASISTENCIA_TODERA",
    label: "Todera",
    route:
      "/lineas-producto/control-asistencia/todera",
    hidden: true,
    icon: ClipboardCheck,
  },

  {
    view: "FORM_TODERA",
    label: "Formulario Inscripción Todera",
    route:
      "/lineas-producto/form-todera",
    icon: ClipboardList,
  },

  // NUEVO ITEM
  {
    view:
      "GESTION_INSTRUCTORAS",

    label:
      "Gestión Instructoras",

    route:
      "/lineas-producto/gestion-instructoras",
    icon: UserCog,
  },
];

const INSCRIPCIONES_ITEMS = [
  {
    label:
      "Escuela Café",

    view:
      "INSCRIPCIONES_CAFE",

    route:
      "/lineas-producto/inscripciones/cafe",
    icon: Coffee,
  },

  {
    label: "Todera",

    view:
      "INSCRIPCIONES_TODERA",

    route:
      "/lineas-producto/inscripciones/todera",
    icon: ClipboardCheck,
  },
];

const getInitials = (name = "") => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return words[0]?.[0]?.toUpperCase() || "U";
};

const Navbar = ({
  visibleViews,
  showInscripciones = true,
}) => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    openSubmenu,
    setOpenSubmenu,
  ] = useState(true);

  const { canAccessView, user } =
    useAuth();

  const visibleViewSet =
    Array.isArray(
      visibleViews
    )
      ? new Set(
          visibleViews
        )
      : null;

  const handleLogout =
    () => {
      navigate("/menu");
    };

  return (
    <aside className="sidebar">
      {/* TOP */}
      <div className="sidebar-top">
        <div className="brand">
          <h2>
            Portal C&W
          </h2>

          <p>
            Líneas de
            Producto
          </p>
        </div>

        <div className="sidebar-user">
          {user?.foto ? (
            <img
              src={user.foto}
              alt="Perfil"
              className="sidebar-user-avatar"
            />
          ) : (
            <div className="sidebar-user-initials">
              {getInitials(user?.nombre)}
            </div>
          )}

          <div className="sidebar-user-text">
            <strong>
              {user?.nombre || "Usuario"}
            </strong>
            <span>
              {user?.cargo ||
                user?.perfil ||
                "Lineas de Producto"}
            </span>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        {NAV_ITEMS.filter(
          (item) => {
            const isForcedVisible =
              visibleViewSet?.has(
                item.view
              );

            return (
              (!item.hidden ||
                isForcedVisible) &&
              (canAccessView(
                item.view
              ) ||
                isForcedVisible) &&
              (!visibleViewSet ||
                isForcedVisible)
            );
          }
        ).map((item) => {
          const isActive =
            location.pathname ===
            item.route;

          return (
            <button
              key={
                item.view
              }
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
              <item.icon
                size={18}
                strokeWidth={2.2}
              />
              <span>
              {
                item.label
              }
              </span>
            </button>
          );
        })}

        {/* SUBMENU */}
        {showInscripciones && (
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
                {INSCRIPCIONES_ITEMS.filter(
                  (item) =>
                    canAccessView(
                      item.view
                    )
                ).map(
                  (item) => {
                    const isActive =
                      location.pathname ===
                      item.route;

                    return (
                      <button
                        key={
                          item.route
                        }
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
                        <item.icon
                          size={16}
                          strokeWidth={2.2}
                        />
                        <span>
                          {
                            item.label
                          }
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        <button
          className="logout-btn"
          onClick={
            handleLogout
          }
        >
          <House
            size={18}
            strokeWidth={2.2}
          />
          <span>
            Menu principal
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
