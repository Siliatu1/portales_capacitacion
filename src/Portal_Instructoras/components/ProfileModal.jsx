import {
  Modal,
  Tag,
} from "antd";

const ProfileModal = ({
  open,
  onClose,
  user,
}) => {
  if (!user) {
    return null;
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title="Perfil"
    >
      <div className="profile-modal">
        {/* =========================
            AVATAR
        ========================= */}

        <div className="profile-avatar">
          {user?.name
            ?.charAt(0)
            ?.toUpperCase() ||
            "U"}
        </div>

        {/* =========================
            INFO
        ========================= */}

        <div className="profile-info">
          <h2>
            {user?.name ||
              "Usuario"}
          </h2>

          <p>
            {
              user?.email
            }
          </p>

          <Tag color="green">
            Activo
          </Tag>
        </div>

        {/* =========================
            DETAILS
        ========================= */}

        <div className="profile-details">
          <div className="detail-item">
            <span>
              Documento
            </span>

            <strong>
              {user?.document_number ||
                "-"}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Perfil
            </span>

            <strong>
              {user?.profile ||
                "Capacitadora"}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Portal
            </span>

            <strong>
              Instructoras
            </strong>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;