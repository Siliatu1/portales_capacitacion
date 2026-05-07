import { Button, Popconfirm, Table, Tag } from "antd";
import { useAuth } from "../../auth/hooks/useAuth";
import { mapAsistencia } from "../utils/asistencia.utils";

export default function InscripcionesTable({ data, loading, formType, onDelete }) {
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

  const heladeriaColumns = [
    { title: "Cedula", dataIndex: "cedula" },
    { title: "Nombres", dataIndex: "nombres" },
    { title: "Telefono", dataIndex: "telefono" },
    { title: "Cargo a Evaluar", dataIndex: "cargo" },
    { title: "Punto de Venta", dataIndex: "puntoVenta", render: (_, r) => r.puntoVenta || r.area_nombre || "" },
    { title: "Nombre Lider", dataIndex: "lider" },
    { title: "Dia", dataIndex: "dia", sorter: (a, b) => parseDate(a.dia) - parseDate(b.dia), defaultSortOrder: "descend" },
    {
      title: "Asistencia",
      dataIndex: "asistencia",
      render: (value) => {
        const { label, color } = mapAsistencia(value);
        return <Tag color={color}>{label}</Tag>;
      },
    },
  ];

  const defaultColumns = [
    { title: "Cedula", dataIndex: "cedula" },
    { title: "Nombre", dataIndex: "nombres" },
    { title: "Telefono", dataIndex: "telefono" },
    { title: "Punto Venta", dataIndex: "puntoVenta", render: (_, r) => r.puntoVenta || r.area_nombre || "" },
    { title: "Fecha", dataIndex: "dia", sorter: (a, b) => parseDate(a.dia) - parseDate(b.dia), defaultSortOrder: "descend" },
    { title: "Lider", dataIndex: "lider" },
  ];

  const baseColumns = (formType || "").toLowerCase() === "heladeria" ? heladeriaColumns : defaultColumns;
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
