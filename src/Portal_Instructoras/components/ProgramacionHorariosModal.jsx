import { Select } from 'antd';

function ProgramacionHorariosModal({
  open,
  editing,
  formData,
  puntosVenta,
  loadingPuntos,
  guardandoDia,
  showMoreMotivos,
  motivoOptions,
  onClose,
  onSave,
  onDelete,
  onFieldChange,
  onSelectMotivo,
  onToggleMotivos,
}) {
  if (!open) {
    return null;
  }

  const motivos = motivoOptions || [];
  const puntosVentaOptions = puntosVenta.map((puntoVenta) => ({
    value: String(puntoVenta.id),
    label: puntoVenta.nombre,
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-edicion" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{editing ? 'Editar Actividad' : 'Agregar Actividad'}</h3>
          <button className="btn-cerrar-modal" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group-modal">
            <label>
              Punto de Venta {formData.motivo === 'vacaciones' ? '(opcional)' : '*'}
            </label>
            <Select
              className="pdv-select"
              popupClassName="pdv-select-dropdown"
              value={formData.puntoVenta || undefined}
              onChange={(value) => onFieldChange('puntoVenta', value)}
              placeholder={loadingPuntos ? 'Cargando puntos de venta...' : 'Selecciona un punto de venta'}
              size="large"
              options={puntosVentaOptions}
              loading={loadingPuntos}
              showSearch
              allowClear
              optionFilterProp="label"
              notFoundContent={loadingPuntos ? 'Cargando...' : 'No se encontraron puntos de venta'}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>

          <div className="form-row-modal">
            <div className="form-group-modal">
              <label htmlFor="horaInicio-modal">Hora Inicio <span className="form-label-helper">(formato 24h)</span></label>
              <input
                type="time"
                id="horaInicio-modal"
                name="horaInicio"
                value={formData.horaInicio}
                onChange={(event) => onFieldChange('horaInicio', event.target.value)}
                disabled={formData.motivo === 'vacaciones'}
                className="form-input-modal"
              />
            </div>

            <div className="form-group-modal">
              <label htmlFor="horaFin-modal">Hora Fin <span className="form-label-helper">(formato 24h)</span></label>
              <input
                type="time"
                id="horaFin-modal"
                name="horaFin"
                value={formData.horaFin}
                onChange={(event) => onFieldChange('horaFin', event.target.value)}
                disabled={formData.motivo === 'vacaciones'}
                className="form-input-modal"
              />
            </div>
          </div>

          <div className="form-group-modal">
            <label>Motivo / Actividad *</label>
            <div className="motivos-grid-modal">
              {motivos.map((motivo) => (
                <button
                  key={motivo.value}
                  type="button"
                  className={`motivo-btn-modal ${formData.motivo === motivo.value ? 'active' : ''}`}
                  onClick={() => onSelectMotivo(motivo.value)}
                >
                  {motivo.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn-ver-mas-modal"
              onClick={onToggleMotivos}
            >
              {showMoreMotivos ? 'Ver menos opciones' : 'Ver más opciones'}
            </button>
          </div>

          {formData.motivo === 'cubrir_puesto' && (
            <div className="form-group-modal">
              <label htmlFor="detalleCubrir-modal">¿A quién vas a cubrir? *</label>
              <input
                type="text"
                id="detalleCubrir-modal"
                name="detalleCubrir"
                value={formData.detalleCubrir}
                onChange={(event) => onFieldChange('detalleCubrir', event.target.value)}
                placeholder="Nombre de la persona"
                className="form-input-modal"
              />
            </div>
          )}

          {formData.motivo === 'otro' && (
            <div className="form-group-modal">
              <label htmlFor="detalleOtro-modal">Especifica la actividad *</label>
              <input
                type="text"
                id="detalleOtro-modal"
                name="detalleOtro"
                value={formData.detalleOtro}
                onChange={(event) => onFieldChange('detalleOtro', event.target.value)}
                placeholder="Describe la actividad"
                className="form-input-modal"
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          {editing && (
            <button className="btn-eliminar-modal" onClick={onDelete} disabled={guardandoDia}>
              {guardandoDia ? 'Procesando...' : 'Eliminar'}
            </button>
          )}
          <button className="btn-cancelar-modal" onClick={onClose} disabled={guardandoDia}>
            Cancelar
          </button>
          <button className="btn-guardar-modal" onClick={onSave} disabled={guardandoDia}>
            {guardandoDia ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgramacionHorariosModal;
