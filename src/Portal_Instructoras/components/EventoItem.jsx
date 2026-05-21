import { Button } from "antd";

const EventoItem = ({
  evento,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="event-card">
      {/* =========================
          INFO
      ========================= */}

      <div className="event-content">
        <strong>
          {evento.puntoVenta}
        </strong>

        <p>
          {evento.motivo}
        </p>

        <span>
          {evento.horaInicio}
          {" - "}
          {evento.horaFin}
        </span>
      </div>

      {/* =========================
          ACTIONS
      ========================= */}

      <div className="event-actions">
        <Button
          size="small"
          onClick={() =>
            onEditar(evento)
          }
        >
          Editar
        </Button>

        <Button
          size="small"
          danger
          onClick={() =>
            onEliminar(
              evento.id
            )
          }
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default EventoItem;