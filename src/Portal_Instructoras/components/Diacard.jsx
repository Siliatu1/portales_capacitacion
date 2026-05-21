import EventoItem from "./EventoItem";

import { Button } from "antd";

import { calcularHorasDia } from "../utils/fechas";

const DiaCard = ({
  dia,
  label,
  fecha,
  eventos,
  onAgregar,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="day-column">
      {/* HEADER */}
      <div className="day-header">
        <div className="day-header-info">
          <h3>{label}</h3>

          <span>{fecha}</span>
        </div>

        <div className="day-hours">
          {calcularHorasDia(eventos).toFixed(1)}h
        </div>
      </div>

      {/* BODY */}
      <div className="events-list">
        {eventos.length > 0 ? (
          eventos.map((evento) => (
            <EventoItem
              key={evento.id}
              evento={evento}
              onEditar={onEditar}
              onEliminar={onEliminar}
            />
          ))
        ) : (
          <div className="empty-day">
            <span>Sin actividades</span>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="day-footer">
        <Button
          className="btn-add-event"
          onClick={onAgregar}
        >
          + Agregar
        </Button>

        <Button className="btn-rest-day">
          Descanso
        </Button>
      </div>
    </div>
  );
};

export default DiaCard;