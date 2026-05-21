import {
  Modal,
  Button,
} from "antd";

import {
  motivosOptions,
} from "../utils/motivos";

const ModalActividad = ({
  open,
  onClose,
  onGuardar,
  formData,
  onChange,
  puntosVenta,
  loading,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Actividad"
      centered
    >
      <div className="modal-form">
        {/* =========================
            PUNTO DE VENTA
        ========================= */}

        <div className="form-group">
          <label>
            Punto de Venta
          </label>

          <select
            name="puntoVenta"
            value={
              formData.puntoVenta
            }
            onChange={onChange}
          >
            <option value="">
              Seleccionar PDV
            </option>

            {puntosVenta.map(
              (pdv) => (
                <option
                  key={pdv.id}
                  value={pdv.id}
                >
                  {pdv.nombre}
                </option>
              )
            )}
          </select>
        </div>

        {/* =========================
            HORAS
        ========================= */}

        <div className="time-grid">
          <div className="form-group">
            <label>
              Hora Inicio
            </label>

            <input
              type="time"
              name="horaInicio"
              value={
                formData.horaInicio
              }
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label>
              Hora Fin
            </label>

            <input
              type="time"
              name="horaFin"
              value={
                formData.horaFin
              }
              onChange={onChange}
            />
          </div>
        </div>

        {/* =========================
            MOTIVO
        ========================= */}

        <div className="form-group">
          <label>
            Actividad
          </label>

          <select
            name="motivo"
            value={
              formData.motivo
            }
            onChange={onChange}
          >
            <option value="">
              Seleccionar actividad
            </option>

            {motivosOptions.map(
              (motivo) => (
                <option
                  key={
                    motivo.value
                  }
                  value={
                    motivo.value
                  }
                >
                  {
                    motivo.label
                  }
                </option>
              )
            )}
          </select>
        </div>

        {/* =========================
            OTRO
        ========================= */}

        {formData.motivo ===
          "otro" && (
          <div className="form-group">
            <label>
              Detalle
            </label>

            <textarea
              name="detalleOtro"
              placeholder="Describe la actividad"
              value={
                formData.detalleOtro
              }
              onChange={onChange}
            />
          </div>
        )}

        {/* =========================
            ACTIONS
        ========================= */}

        <div className="modal-actions">
          <Button
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            type="primary"
            loading={loading}
            onClick={onGuardar}
          >
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalActividad;