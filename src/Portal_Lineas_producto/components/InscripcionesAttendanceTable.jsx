import { Table, Button, Popconfirm, Tag, Switch } from "antd";
import { mapAsistencia } from "../utils/asistencia.utils";

export default function InscripcionesAttendanceTable({ data, loading, onDelete, onSetAsistencia }) {
  const parseDate = (d) => {
    if (!d) return 0;
    const t = Date.parse(d);
    return isNaN(t) ? (typeof d === 'string' ? d.localeCompare('') : 0) : t;
  };

  const handleDelete = async (id) => {
    try {
      if (typeof onDelete === 'function') await onDelete(id);
    } catch (err) {
      console.error('Eliminar fallo', err);
    }
  };

  const handleSet = async (record, value) => {
    if (typeof onSetAsistencia === 'function') {
      await onSetAsistencia(record.id, value);
    }
  };

  const renderAsistencia = (value, record) => {
    const { label, color } = mapAsistencia(value);

    const checked = value === true;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Tag color={color}>{label}</Tag>
        <Switch
          checked={checked}
          onChange={async (nextChecked) => {
            try {
              await handleSet(record, nextChecked);
            } catch (err) {
            }
          }}
          checkedChildren="SI"
          unCheckedChildren="NO"
        />
      </div>
    );
  };

  const heladeriaColumns = [
    { title: "Cédula", dataIndex: "cedula" },
    { title: "Nombres", dataIndex: "nombres" },
    { title: "Teléfono", dataIndex: "telefono" },
    { title: "Cargo", dataIndex: "cargo" },
    { title: "Punto de Venta", dataIndex: "puntoVenta", render: (_, r) => r.puntoVenta || r.area_nombre || '' },
    { title: "Nombre Líder", dataIndex: "lider" },
    { title: "Día", dataIndex: "dia", sorter: (a, b) => parseDate(a.dia) - parseDate(b.dia), defaultSortOrder: 'descend' },
    { title: "Asistencia", dataIndex: "asistencia", render: renderAsistencia },
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

  return (
    <Table
      columns={heladeriaColumns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}
