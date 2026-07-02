import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import '../styles/GestionLineasInstructoras.css';
import {
  createGestionLineaInstructora,
  deleteGestionLineaInstructora,
  fetchGestionLineasInstructoras,
  updateGestionLineaInstructora,
} from '../services/gestionLineasInstructoras.service';

const LINE_OPTIONS = [
  { value: 'sal', label: 'Sal', color: 'green' },
  { value: 'dulce', label: 'Dulce', color: 'magenta' },
  { value: 'bebidas', label: 'Bebidas', color: 'blue' },
  { value: 'Brunch', label: 'Especiales', color: 'gold' },
];

const SEARCH_FIELDS = ['Nombre', 'documento', 'correo', 'telefono'];

const getAttrs = (record) => record?.attributes || {};

const getActiveLines = (attrs = {}) =>
  LINE_OPTIONS.filter((line) => attrs[line.value] === true);

const getPrimaryLine = (attrs = {}) => getActiveLines(attrs)[0]?.value || '';

const buildPayload = (values) => {
  const lineData = LINE_OPTIONS.reduce((acc, line) => {
    acc[line.value] = line.value === values.linea;
    return acc;
  }, {});

  return {
    data: {
      Nombre: values.Nombre?.trim() || '',
      documento: values.documento?.trim() || '',
      correo: values.correo?.trim() || '',
      telefono: values.telefono?.trim() || '',
      ...lineData,
    },
  };
};

const formatDateValue = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('es-CO');
};

function GestionLineasInstructoras() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [instructoras, setInstructoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState('');

  const loadInstructoras = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchGestionLineasInstructoras();
      setInstructoras(data);
    } catch (error) {
      console.error(error);
      message.error('No fue posible cargar las instructoras');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadInstructoras();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadInstructoras]);

  const filteredInstructoras = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return instructoras.filter((item) => {
      const attrs = getAttrs(item);
      const matchesSearch = !cleanSearch || SEARCH_FIELDS.some((field) =>
        String(attrs[field] || '').toLowerCase().includes(cleanSearch)
      );

      return matchesSearch;
    });
  }, [instructoras, search]);

  const openCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      Nombre: '',
      documento: '',
      correo: '',
      telefono: '',
      linea: undefined,
    });
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    const attrs = getAttrs(record);
    setEditingRecord(record);
    form.setFieldsValue({
      Nombre: attrs.Nombre || '',
      documento: attrs.documento || '',
      correo: attrs.correo || '',
      telefono: attrs.telefono || '',
      linea: getPrimaryLine(attrs) || undefined,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = buildPayload(values);

      setSaving(true);

      if (editingRecord) {
        await updateGestionLineaInstructora(editingRecord.id, payload);
        message.success('Instructora actualizada correctamente');
      } else {
        await createGestionLineaInstructora(payload);
        message.success('Instructora creada correctamente');
      }

      closeModal();
      loadInstructoras();
    } catch (error) {
      if (error?.errorFields) return;

      console.error(error);
      message.error('No fue posible guardar la instructora');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (record) => {
    const attrs = getAttrs(record);

    Modal.confirm({
      title: 'Eliminar instructora',
      content: `Quieres eliminar a ${attrs.Nombre || 'esta instructora'}?`,
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        try {
          await deleteGestionLineaInstructora(record.id);
          message.success('Instructora eliminada correctamente');
          loadInstructoras();
        } catch (error) {
          console.error(error);
          message.error('No fue posible eliminar la instructora');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Nombre',
      key: 'Nombre',
      render: (_, record) => {
        const attrs = getAttrs(record);

        return (
          <div className="gestion-lineas-name-cell">
            <strong>{attrs.Nombre || 'Sin nombre'}</strong>
            <span>{attrs.documento || 'Sin documento'}</span>
          </div>
        );
      },
      sorter: (a, b) =>
        String(getAttrs(a).Nombre || '').localeCompare(String(getAttrs(b).Nombre || '')),
    },
    {
      title: 'Correo',
      key: 'correo',
      render: (_, record) => getAttrs(record).correo || '-',
    },
    {
      title: 'Telefono',
      key: 'telefono',
      render: (_, record) => getAttrs(record).telefono || '-',
    },
    {
      title: 'Linea',
      key: 'linea',
      render: (_, record) => {
        const activeLines = getActiveLines(getAttrs(record));

        if (!activeLines.length) {
          return <Tag>Sin linea</Tag>;
        }

        return (
          <Space size={[4, 4]} wrap>
            {activeLines.map((line) => (
              <Tag key={line.value} color={line.color}>
                {line.label}
              </Tag>
            ))}
          </Space>
        );
      },
      filters: LINE_OPTIONS.map((line) => ({ text: line.label, value: line.value })),
      onFilter: (value, record) => getAttrs(record)[value] === true,
    },
    {
      title: 'Actualizado',
      key: 'updatedAt',
      render: (_, record) => formatDateValue(getAttrs(record).updatedAt) || '-',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const editingAttrs = getAttrs(editingRecord);

  return (
    <div className="gestion-lineas-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/portal-instructoras/vista-administrativa')}
            >
              Volver
            </Button>
            <div className="navbar-titles">
              <h1 className="navbar-title">Gestion lineas instructora</h1>
              <span className="navbar-subtitle">
                Administracion de instructoras y linea activa
              </span>
            </div>
          </div>
          <div className="navbar-actions">
            <Button icon={<ReloadOutlined />} onClick={loadInstructoras}>
              Recargar
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Nueva instructora
            </Button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="welcome-section">
          <div className="gestion-lineas-hero">
            <div>
              <h2 className="welcome-greeting">Gestion lineas instructora</h2>
              <p className="welcome-description">
                Edita los datos de la instructora y deja activa una sola linea.
              </p>
            </div>

            <Space wrap>
              <Button icon={<ReloadOutlined />} onClick={loadInstructoras}>
                Recargar
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                Nueva instructora
              </Button>
            </Space>
          </div>
        </div>

        <Card className="gestion-lineas-filters">
          <Space size="middle" wrap className="gestion-lineas-filters__layout">
            <Input.Search
              allowClear
              className="gestion-lineas-search"
              placeholder="Buscar por nombre, documento, correo o telefono"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Space>
        </Card>

        <Card className="gestion-lineas-table-card">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={filteredInstructoras}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
              showTotal: (total) => `${total} instructoras`,
            }}
            scroll={{ x: 980 }}
            locale={{
              emptyText: 'No hay instructoras para mostrar',
            }}
          />
        </Card>
      </main>

      <Modal
        title={editingRecord ? 'Editar instructora' : 'Nueva instructora'}
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleSave}
        okText="Guardar"
        cancelText="Cancelar"
        confirmLoading={saving}
        centered
        width={720}
      >
        <Form form={form} layout="vertical" className="gestion-lineas-form">
          <Form.Item
            label="Nombre"
            name="Nombre"
            rules={[{ required: true, message: 'Ingresa el nombre' }]}
          >
            <Input placeholder="Nombre de la instructora" maxLength={120} />
          </Form.Item>

          <div className="gestion-lineas-form-grid">
            <Form.Item label="Documento" name="documento">
              <Input placeholder="Documento" maxLength={30} />
            </Form.Item>
            <Form.Item
              label="Correo"
              name="correo"
              rules={[
                {
                  type: 'email',
                  message: 'Ingresa un correo valido',
                },
              ]}
            >
              <Input placeholder="correo@crepes.com" maxLength={120} />
            </Form.Item>
          </div>

          <div className="gestion-lineas-form-grid">
            <Form.Item label="Telefono" name="telefono">
              <Input placeholder="Telefono" maxLength={30} />
            </Form.Item>
            <Form.Item
              label="Linea"
              name="linea"
              rules={[{ required: true, message: 'Selecciona una linea' }]}
            >
              <Radio.Group className="gestion-lineas-radio">
                {LINE_OPTIONS.map((line) => (
                  <Radio.Button key={line.value} value={line.value}>
                    {line.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>

          {editingRecord && (
            <div className="gestion-lineas-audit">
              <Form.Item label="createdAt">
                <Input disabled value={formatDateValue(editingAttrs.createdAt)} />
              </Form.Item>
              <Form.Item label="updatedAt">
                <Input disabled value={formatDateValue(editingAttrs.updatedAt)} />
              </Form.Item>
              <Form.Item label="publishedAt">
                <Input disabled value={formatDateValue(editingAttrs.publishedAt)} />
              </Form.Item>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default GestionLineasInstructoras;
