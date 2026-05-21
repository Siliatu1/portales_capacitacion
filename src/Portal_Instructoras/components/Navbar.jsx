import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  /* =========================
     USER
  ========================= */

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    ) || {};

  /* =========================
     PERFIL
  ========================= */

  const perfil =
    (
      user?.perfil || ""
    ).toUpperCase();

  /* =========================
     ROLES
  ========================= */

  const isCapacitadora =
    perfil.includes(
      "CAPATIDORA"
    ) ||
    perfil.includes(
      "CAPACITADORA"
    );

  const isSuperAdmin =
    perfil.includes(
      "SUPER_ADMIN"
    );

  /* =========================
     NAVIGATION
  ========================= */

  const goDashboard = () => {
    navigate(
      "/portal-instructoras/dashboard"
    );
  };

  const goProgramacion =
    () => {
      navigate(
        "/portal-instructoras/programacion"
      );
    };

  const goAdmin = () => {
    navigate(
      "/portal-instructoras/administrativo"
    );
  };

  const logout = () => {
    localStorage.clear();

    navigate("/");
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <aside className="sidebar">
      {/* =========================
          HEADER
      ========================= */}

      <div className="sidebar-header">
        <h1>
          Portal C&W
        </h1>

        <span>
          Instructoras
        </span>
      </div>

      {/* =========================
          MENU
      ========================= */}

      <nav className="sidebar-menu">
        {/* =========================
            CAPACITADORA
        ========================= */}

        {isCapacitadora && (
          <>
            <button
              className="sidebar-item"
              onClick={
                goDashboard
              }
            >
              <LayoutDashboard
                size={18}
              />

              Dashboard
            </button>

            <button
              className="sidebar-item"
              onClick={
                goProgramacion
              }
            >
              <CalendarDays
                size={18}
              />

              Programación
            </button>
          </>
        )}

        {/* =========================
            SUPER ADMIN
        ========================= */}

        {isSuperAdmin && (
          <button
            className="sidebar-item"
            onClick={goAdmin}
          >
            <ShieldCheck
              size={18}
            />

            Vista
            Administrativa
          </button>
        )}
      </nav>

      {/* =========================
          FOOTER
      ========================= */}

      <div className="sidebar-footer">
        <button
          className="logout-button"
          onClick={logout}
        >
          <LogOut size={18} />

          Salir
        </button>
      </div>
    </aside>
  );
}

export default Navbar;