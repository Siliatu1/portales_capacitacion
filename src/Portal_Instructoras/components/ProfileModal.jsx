import {
  Modal,
  Button
} from "antd";

import { useNavigate } from "react-router-dom";

import {
  getInitials
} from "../utils/dateUtils";

function ProfileModal({
  open,
  onClose,
  user
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/", {
      replace: true
    });
  };

  return (
    <Modal
      title="Perfil"
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="logout"
          danger
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      ]}
    >
      <div
        style={{
          textAlign: "center"
        }}
      >
        <div className="profile-avatar-modal">
          {getInitials(user?.nombre)}
        </div>

        <h3>{user?.nombre}</h3>

        <p>{user?.cargo}</p>

        <p>
          {user?.document_number}
        </p>
      </div>
    </Modal>
  );
}

export default ProfileModal;