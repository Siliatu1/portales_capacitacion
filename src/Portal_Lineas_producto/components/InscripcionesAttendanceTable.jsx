import { Button, Popconfirm, Switch, Table, Tag } from "antd";
import { useAuth } from "../../auth/hooks/useAuth";
import { mapAsistencia } from "../utils/asistencia.utils";

export default function InscripcionesAttendanceTable({ data, loading, onDelete, onSetAsistencia }) {
  const { hasPermission } = useAuth();
  const canDelete = hasPermission("canDelete");

  const parseDate = (d) => {
    if (!d) return 0;
    const t = Date.parse(d);
    return Number.isNaN(t) ? (typeof d === "string" ? d.localeCompare("") : 0) : t;
  };

  const handleDelete = async (id) => {
    try {
      if (typeof onDelete === "function") await onDelete(id);
    } catch (err) {
      console.error("Eliminar fallo", err);
    }
  };

  const handleSet = async (record, value) => {
    if (typeof onSetAsistencia === "function") {
      await onSetAsistencia(record.id, value);
    }
  };

  const renderAsistencia = (value, record) => {
    const { label, color } = mapAsistencia(value);
    const checked = value === true;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Tag color={color}>{label}</Tag>
        <Switch
          checked={checked}
          onChange={async (nextChecked) => {
            try {
              await handleSet(record, nextChecked);
            } catch (err) {
              console.error("Actualizar asistencia fallo", err);
            }
          }}
          checkedChildren="SI"
          unCheckedChildren="NO"
        />
      </div>
    );
  };

  const actionColumn = {
    title: "Acciones",
    key: "acciones",
    render: (_, record) => (
      <Popconfirm
        title="Eliminar inscripcion?"
        onConfirm={() => handleDelete(record.id)}
        okText="Si"
        cancelText="No"
      >
        <Button danger>Eliminar</Button>
      </Popconfirm>
    ),
  };

  const baseColumns = [
    { title: "Cedula", dataIndex: "cedula" },
    { title: "Nombres", dataIndex: "nombres" },
    { title: "Telefono", dataIndex: "telefono" },
    { title: "Cargo", dataIndex: "cargo" },
    { title: "Punto de Venta", dataIndex: "puntoVenta", render: (_, r) => r.puntoVenta || r.area_nombre || "" },
    { title: "Nombre Lider", dataIndex: "lider" },
    { title: "Dia", dataIndex: "dia", sorter: (a, b) => parseDate(a.dia) - parseDate(b.dia), defaultSortOrder: "descend" },
    { title: "Asistencia", dataIndex: "asistencia", render: renderAsistencia },
  ];

  const columns = canDelete ? [...baseColumns, actionColumn] : baseColumns;

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
