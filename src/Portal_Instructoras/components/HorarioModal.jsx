import { Button, Col, Form, Input, Modal, Row, Select, Space } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {
  MOTIVOS_BASICOS,
  MOTIVOS_LABELS,
  MOTIVOS_SIN_HORA,
} from './dashboard.helpers';

function HorarioModal({
  open,
  formData,
  motivoOptions,
  pdvOptions,
  puntosVenta,
  showMoreMotivos,
  onCancel,
  onClose,
  onFieldChange,
  onSave,
  onShowMoreMotivos,
  onSelectMotivo,
  onToggleMotivos,
  variant = 'select',
  title = 'Editar Horario',
  centered = false,
  buttonClassName = '',
}) {
 
  const shouldShowTimeFields =
    variant === 'select'
      ? formData.motivo !== 'dia_descanso' && formData.motivo !== 'vacaciones'
      : !MOTIVOS_SIN_HORA.includes(formData.motivo);

  const handleCancel = onCancel || onClose;

  const handleSelectMotivo = (motivo) => {
    if (onSelectMotivo) {
      onSelectMotivo(motivo);
    } else {
      onFieldChange('motivo', motivo);
    }
  };

  // Handler para toggle de motivos
  const handleToggleMotivos = () => {
    if (onToggleMotivos) {
      onToggleMotivos();
    } else if (onShowMoreMotivos) {
      onShowMoreMotivos();
    }
  };

  // Renderizar selector de punto de venta basado en la variante
  const renderPdvSelector = () => {
    if (variant === 'buttons' && puntosVenta) {
      
      return (
        <Select
          className="pdv-select"
          popupClassName="pdv-select-dropdown"
          value={formData.puntoVenta || undefined}
          onChange={(value) => onFieldChange('puntoVenta', value)}
          placeholder="Selecciona un punto de venta"
          size="large"
          options={puntosVenta.map((puntoVenta) => ({
            value: String(puntoVenta.id),
            label: puntoVenta.nombre,
          }))}
          showSearch
          allowClear
          optionFilterProp="label"
          notFoundContent="No se encontraron puntos de venta"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      );
    }
    // Para EditHorarioModal: renderizar con options prop
    return (
      <Select
        className="pdv-select"
        popupClassName="pdv-select-dropdown"
        value={formData.puntoVenta}
        onChange={(value) => onFieldChange('puntoVenta', value)}
        placeholder="Selecciona un punto de venta"
        options={pdvOptions}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        showSearch
        allowClear
        optionFilterProp="label"
        notFoundContent="No se encontraron puntos de venta"
      />
    );
  };

 
  const renderMotivoSelector = () => {
    if (variant === 'buttons') {
      // Para DashboardEditModal: botones
      return (
        <Space wrap size="small" className="dashboard-motivos-space">
          {MOTIVOS_BASICOS.map((motivo) => (
            <Button
              key={motivo}
              type={formData.motivo === motivo ? 'primary' : 'default'}
              onClick={() => handleSelectMotivo(motivo)}
              className={
                formData.motivo === motivo
                  ? 'dashboard-motivo-btn dashboard-motivo-btn--active'
                  : 'dashboard-motivo-btn'
              }
            >
              {MOTIVOS_LABELS[motivo]}
            </Button>
          ))}

          {showMoreMotivos &&
            Object.entries(MOTIVOS_LABELS)
              .filter(([key]) => !MOTIVOS_BASICOS.includes(key))
              .map(([key, label]) => (
                <Button
                  key={key}
                  type={formData.motivo === key ? 'primary' : 'default'}
                  onClick={() => handleSelectMotivo(key)}
                  className={
                    formData.motivo === key
                      ? 'dashboard-motivo-btn dashboard-motivo-btn--active'
                      : 'dashboard-motivo-btn'
                  }
                >
                  {label}
                </Button>
              ))}

          <Button
            type="link"
            onClick={handleToggleMotivos}
            icon={showMoreMotivos ? <UpOutlined /> : <DownOutlined />}
          >
            {showMoreMotivos ? 'Ver menos' : 'Ver más opciones'}
          </Button>
        </Space>
      );
    }

    // Para EditHorarioModal: Select
    return (
      <>
        <Select
          value={formData.motivo}
          onChange={(value) => onFieldChange('motivo', value)}
          placeholder="Selecciona un motivo"
          options={motivoOptions}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          showSearch
          allowClear
        />
        {!showMoreMotivos && (
          <Button
            type="link"
            onClick={handleToggleMotivos}
            className="vista-admin-link-button"
          >
            Ver más motivos
          </Button>
        )}
      </>
    );
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      width={700}
      centered={centered}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSave}
          className={buttonClassName || 'vista-admin-btn vista-admin-btn--pdf'}
        >
          Guardar Cambios
        </Button>,
      ]}
    >
      <Form layout="vertical" className={variant === 'buttons' ? 'dashboard-edit-form' : 'vista-admin-form'}>
        <Form.Item label="Punto de Venta" required={variant === 'select'}>
          {renderPdvSelector()}
        </Form.Item>

        {shouldShowTimeFields && (
          <div className={variant === 'buttons' ? 'dashboard-edit-time-row' : undefined}>
            <Row gutter={16} style={variant === 'buttons' ? { display: 'flex' } : undefined}>
              <Col span={12}>
                <Form.Item label="Hora Inicio" required={variant === 'select'}>
                  <Input
                    type="time"
                    value={formData.horaInicio}
                    onChange={(event) => onFieldChange('horaInicio', event.target.value)}
                    disabled={variant === 'buttons' && MOTIVOS_SIN_HORA.includes(formData.motivo)}
                    size={variant === 'buttons' ? 'large' : undefined}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Hora Fin" required={variant === 'select'}>
                  <Input
                    type="time"
                    value={formData.horaFin}
                    onChange={(event) => onFieldChange('horaFin', event.target.value)}
                    disabled={variant === 'buttons' && MOTIVOS_SIN_HORA.includes(formData.motivo)}
                    size={variant === 'buttons' ? 'large' : undefined}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}

        <Form.Item label="Motivo/Actividad" required={variant === 'select'}>
          {renderMotivoSelector()}
        </Form.Item>

        {formData.motivo === 'cubrir_puesto' && (
          <Form.Item label="¿A quién vas a cubrir?" required>
            <Input
              value={formData.detalleCubrir}
              onChange={(event) => onFieldChange('detalleCubrir', event.target.value)}
              placeholder={
                variant === 'buttons'
                  ? 'Nombre de la persona'
                  : 'Nombre de la persona a cubrir'
              }
              size={variant === 'buttons' ? 'large' : undefined}
            />
          </Form.Item>
        )}

        {formData.motivo === 'otro' && (
          <Form.Item label={variant === 'buttons' ? 'Especifica el motivo' : 'Especifica cuál'} required>
            <Input
              value={formData.detalleOtro}
              onChange={(event) => onFieldChange('detalleOtro', event.target.value)}
              placeholder="Describe la actividad"
              size={variant === 'buttons' ? 'large' : undefined}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default HorarioModal;
