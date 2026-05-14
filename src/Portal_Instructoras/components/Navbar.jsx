import {
  getInitials
} from "../utils/dateUtils";

function Navbar({
  user,
  onProfileClick
}) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">
          Mis Horarios
        </h1>

        <button
          className="profile-button-avatar"
          onClick={onProfileClick}
        >
          {user?.foto ? (
            <img
              src={user.foto}
              alt="perfil"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar-initials">
              {getInitials(user?.nombre)}
            </div>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;