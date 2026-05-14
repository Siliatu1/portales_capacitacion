import { Button, Input, Modal, Popconfirm, Switch, Table, Tag } from "antd";
import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { mapAsistencia } from "../utils/asistencia.utils";
import "../styles/Table.css";

const { TextArea } = Input;

export default function InscripcionesAttendanceTable({
  data,
  loading,
  onDelete,
  onSetAsistencia,
  onSetEstado,
  onSaveObservacion,
  mode = "cafe",
}) {
  const { hasPermission } = useAuth();
  const canDelete = hasPermission("canDelete");
  const [observacionModalOpen, setObservacionModalOpen] = useState(false);
  const [observacion, setObservacion] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

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

  const handleSetEstado = async (record, value) => {
    if (typeof onSetEstado === "function") {
      await onSetEstado(record.id, value, record.sourceEndpoint);
    }
  };

  const openObservacionModal = (record) => {
    setSelectedRecord(record);
    setObservacion(record.observacion || "");
    setObservacionModalOpen(true);
  };

  const closeObservacionModal = () => {
    setSelectedRecord(null);
    setObservacion("");
    setObservacionModalOpen(false);
  };

  const saveObservacion = async () => {
    if (!selectedRecord || typeof onSaveObservacion !== "function") {
      closeObservacionModal();
      return;
    }

    await onSaveObservacion(
      selectedRecord.id,
      observacion,
      selectedRecord.sourceEndpoint
    );

    closeObservacionModal();
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

  const isEvaluado = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    return (
      value === true ||
      normalized === "evaluado" ||
      normalized === "true" ||
      normalized === "si"
    );
  };

  const renderEstado = (value, record) => {
    const checked = isEvaluado(value);

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Tag color={checked ? "green" : "red"}>
          {checked ? "Evaluado" : "No evaluado"}
        </Tag>
        <Switch
          checked={checked}
          onChange={async (nextChecked) => {
            try {
              await handleSetEstado(record, nextChecked);
            } catch (err) {
              console.error("Actualizar estado fallo", err);
            }
          }}
          checkedChildren="SI"
          unCheckedChildren="NO"
        />
      </div>
    );
  };

  const renderObservacion = (_, record) => (
    <Button
      type={record.observacion ? "primary" : "default"}
      onClick={() => openObservacionModal(record)}
    >
      {record.observacion ? "Editar" : "Agregar"}
    </Button>
  );

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

  const fechaInscripcionColumn = {
    ...dateColumn,
    title: "Fecha Inscripción",
  };

  const cafeColumns = [
    { title: "Cédula", dataIndex: "cedula" },
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
    { title: "Teléfono", dataIndex: "telefono", render: (value) => value || "-" },
    { title: "Cargo a Evaluar", dataIndex: "cargo", render: (value) => value || "-" },
    {
      title: "Punto de Venta",
      dataIndex: "puntoVenta",
      render: (_, r) => r.puntoVenta || r.area_nombre || "-",
    },
    { title: "Nombre Líder", dataIndex: "lider", render: (value) => value || "-" },
    { title: "Categoría", dataIndex: "categoria", render: (value) => value || "-" },
    fechaInscripcionColumn,
    { title: "Estado", dataIndex: "estado", render: renderEstado },
    { title: "Observación", dataIndex: "observacion", render: renderObservacion },
  ];

  const baseColumns = mode === "todera" ? toderaColumns : cafeColumns;

  const columns =
    mode === "todera"
      ? baseColumns
      : canDelete
        ? [...baseColumns, actionColumn]
        : baseColumns;

  return (
    <>
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
          scroll={{ x: mode === "todera" ? 1500 : 1150 }}
          locale={{
            emptyText: "No hay inscripciones asignadas",
          }}
        />
      </div>

      <Modal
        open={observacionModalOpen}
        title="Observación"
        onOk={saveObservacion}
        onCancel={closeObservacionModal}
        okText="Guardar"
        cancelText="Cancelar"
      >
        {selectedRecord && (
          <div style={{ marginBottom: 16 }}>
            <strong>{selectedRecord.nombres}</strong>
            <br />
            {selectedRecord.cedula}
          </div>
        )}

        <TextArea
          rows={5}
          value={observacion}
          onChange={(event) => setObservacion(event.target.value)}
          placeholder="Escribe una observación"
        />
      </Modal>
    </>
  );
}
