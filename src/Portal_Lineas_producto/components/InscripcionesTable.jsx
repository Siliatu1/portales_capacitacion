import { Table, Button, Popconfirm } from "antd";

export default function InscripcionesTable({ data, loading, formType, onDelete }) {
  const handleDelete = async (id) => {
    try {
      if (typeof onDelete === 'function') await onDelete(id);
    } catch (err) {
      console.error('Eliminar fallo', err);
    }
  };

  const heladeriaColumns = [
    { title: "Cédula", dataIndex: "cedula" },
    { title: "Nombres", dataIndex: "nombres" },
    { title: "Teléfono", dataIndex: "telefono" },
    { title: "Cargo a Evaluar", dataIndex: "cargo" },
    { title: "Punto de Venta", dataIndex: "puntoVenta", render: (_, r) => r.puntoVenta || r.area_nombre || '' },
    { title: "Nombre Líder", dataIndex: "lider" },
    { title: "Día", dataIndex: "dia" },
    { title: "Asistencia", dataIndex: "asistencia", render: (a) => (a === null ? '-' : a ? 'Sí' : 'No') },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Popconfirm title="Eliminar inscripción?" onConfirm={() => handleDelete(record.id)} okText="Sí" cancelText="No">
          <Button danger>Eliminar</Button>
        </Popconfirm>
      ),
    },
  ];

  const defaultColumns = [
    { title: "Cédula", dataIndex: "cedula" },
    { title: "Nombre", dataIndex: "nombres" },
    { title: "Teléfono", dataIndex: "telefono" },
    { title: "Punto Venta", dataIndex: "puntoVenta", render: (_, r) => r.puntoVenta || r.area_nombre || '' },
    { title: "Fecha", dataIndex: "dia" },
    { title: "Líder", dataIndex: "lider" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Popconfirm title="Eliminar inscripción?" onConfirm={() => handleDelete(record.id)} okText="Sí" cancelText="No">
          <Button danger>Eliminar</Button>
        </Popconfirm>
      ),
    },
  ];

  const columns = (formType || '').toLowerCase() === 'heladeria' ? heladeriaColumns : defaultColumns;

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}