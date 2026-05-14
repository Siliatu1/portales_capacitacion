import Navbar from "../components/Navbar";

import ProfileModal from "../components/ProfileModal";

import HorariosTable from "../components/HorariosTable";

import { useDashboard } from "../hooks/useDashboard";

import "../styles/dashboard.css";

function Dashboard() {
  const {
    navigate,
    user,
    horarios,
    totalHoras,
    infoSemana,
    showProfileModal,
    setShowProfileModal,
    formatearFecha
  } = useDashboard();

  return (
    <div className="dashboard-container">
      <Navbar
        user={user}
        onProfileClick={() =>
          setShowProfileModal(true)
        }
      />

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>
            Hola,{" "}
            {user?.nombre ||
              "Instructora"}
          </h2>
        </div>

        <div className="dashboard-cards">
          <div
            className="dashboard-card"
            onClick={() =>
              navigate("/programacion")
            }
          >
            <h3>
              Programación de Horarios
            </h3>

            <p>
              Gestiona tu agenda semanal
            </p>
          </div>
        </div>

        <HorariosTable
          horarios={horarios}
          totalHoras={totalHoras}
          infoSemana={infoSemana}
          formatearFecha={
            formatearFecha
          }
        />
      </main>

      <ProfileModal
        open={showProfileModal}
        onClose={() =>
          setShowProfileModal(false)
        }
        user={user}
      />
    </div>
  );
}

export default Dashboard;