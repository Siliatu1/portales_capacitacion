import { Button, Popconfirm, Switch, Table, Tag } from "antd";
import { useAuth } from "../../auth/hooks/useAuth";
import { mapAsistencia } from "../utils/asistencia.utils";
import "../styles/Table.css";

export default function InscripcionesAttendanceTable({
  data,
  loading,
  onDelete,
  onSetAsistencia,
  mode = "cafe",
}) {
  const { hasPermission } = useAuth();
  const canDelete = hasPermission("canDelete");

  const parseDate = (d) => {
    if (!d) return 0;
    const t = Date.parse(d);
    return Number.isNaN(t) ? (typeof d === "string" ? d.localeCompare("") : 0) : t;
  };

  const handleDelete = async (record) => {
    try {
      if (typeof onDelete === "function") {
        await onDelete(record.id, record.sourceEndpoint);
      }
    } catch (err) {
      console.error("Eliminar fallo", err);
    }
  };

  const handleSet = async (record, value) => {
    if (typeof onSetAsistencia === "function") {
      await onSetAsistencia(record.id, value, record.sourceEndpoint);
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
          checkedChildren="Si"
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
        onConfirm={() => handleDelete(record)}
        okText="Si"
        cancelText="No"
      >
        <Button danger>Eliminar</Button>
      </Popconfirm>
    ),
  };

  const dateColumn = {
    title: "Dia",
    dataIndex: "dia",
    sorter: (a, b) => parseDate(a.dia) - parseDate(b.dia),
    defaultSortOrder: "descend",
    render: (value) => {
      if (!value) return "-";

      try {
        return new Date(value).toLocaleDateString("es-CO");
      } catch {
        return value;
      }
    },
  };

  const cafeColumns = [
    { title: "Cedula", dataIndex: "cedula" },
    { title: "Nombres", dataIndex: "nombres" },
    { title: "Telefono", dataIndex: "telefono" },
    { title: "Cargo", dataIndex: "cargo", render: (value) => value || "-" },
    {
      title: "Punto de Venta",
      dataIndex: "puntoVenta",
      render: (_, r) => r.puntoVenta || r.area_nombre || "-",
    },
    { title: "Nombre Lider", dataIndex: "lider", render: (value) => value || "-" },
    dateColumn,
    { title: "Asistencia", dataIndex: "asistencia", render: renderAsistencia },
  ];

  const toderaColumns = [
    { title: "Cedula", dataIndex: "cedula" },
    { title: "Nombres", dataIndex: "nombres" },
    { title: "Telefono", dataIndex: "telefono", render: (value) => value || "-" },
    { title: "Cargo a Evaluar", dataIndex: "cargo", render: (value) => value || "-" },
    {
      title: "Punto de Venta",
      dataIndex: "puntoVenta",
      render: (_, r) => r.puntoVenta || r.area_nombre || "-",
    },
    { title: "Categoria", dataIndex: "categoria", render: (value) => value || "-" },
    dateColumn,
    { title: "Asistencia", dataIndex: "asistencia", render: renderAsistencia },
  ];

  const baseColumns = mode === "todera" ? toderaColumns : cafeColumns;

  const columns = canDelete ? [...baseColumns, actionColumn] : baseColumns;

  return (
    <div className="table-container">
      <Table
        className="cw-table attendance-table"
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        loading={loading}
        rowKey={(record) => String(record.id)}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
        scroll={{ x: mode === "todera" ? 1250 : 1150 }}
        locale={{
          emptyText: "No hay inscripciones asignadas",
        }}
      />
    </div>
  );
}
