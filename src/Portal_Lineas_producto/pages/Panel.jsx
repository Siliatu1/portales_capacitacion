import Navbar from "../components/navbar";
import { useAuth } from "../../auth/hooks/useAuth";
import "../styles/panel.css";

export default function Panel({
  userData,
  onLogout,
}) {
  const { user } = useAuth();

  return (
    <>
      <Navbar
        userData={userData}
        onLogout={onLogout}
      />

      <div className="admin-content">
        <div className="page-header">
          <h2>
            {user?.foto && (
              <img
                src={user.foto}
                alt="Perfil"
                className="user-avatar"
              />
            )}
            BIENVENIDO A TU PANEL DE CONTROL
          </h2>
        </div>
      </div>
    </>
  );
}
