
// TABLA ES PARA LAS INSTRUCTORAS DE TODERAS


import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tag,
  message,
} from "antd";
import { useState } from "react";
import { UserRoundCheck } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { mapAsistencia } from "../utils/asistencia.utils";
import "../styles/table.css";

const { TextArea } = Input;

export default function InscripcionesAttendanceTable({
  data,
  loading,
  onDelete,
  onSetAsistencia,
  onSetEstado,
  onSaveObservacion,
  onSetInstructora,
  canReassignInstructora = false,
  instructorasPorCategoria = {},
  mode = "cafe",
}) {
  const { hasPermission } = useAuth();
  const canDelete = hasPermission("canDelete");
  const [observacionModalOpen, setObservacionModalOpen] = useState(false);
  const [observacion, setObservacion] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reassigningRecordId, setReassigningRecordId] = useState(null);

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

  const handleSetInstructora = async (record, value) => {
    if (typeof onSetInstructora !== "function") {
      return;
    }

    setReassigningRecordId(record.id);
    await onSetInstructora(record.id, value, record.sourceEndpoint);
    setReassigningRecordId(null);
    message.success("Instructora reasignada");
  };

  const confirmSetInstructora = (record, nextValue, currentValue) => {
    if (!nextValue || nextValue === currentValue) {
      return;
    }

    Modal.confirm({
      title: "Confirmar cambio de instructora",
      content: (
        <div className="reassign-confirm-content">
          <p>
            Esta evaluación dejará de aparecerle a la instructora actual y
            pasará a la nueva instructora seleccionada.
          </p>
          <div>
            <span>Actual</span>
            <strong>{currentValue || "-"}</strong>
          </div>
          <div>
            <span>Nueva</span>
            <strong>{nextValue}</strong>
          </div>
        </div>
      ),
      okText: "Confirmar cambio",
      cancelText: "Cancelar",
      centered: true,
      onOk: async () => {
        try {
          await handleSetInstructora(record, nextValue);
        } catch (err) {
          setReassigningRecordId(null);
          console.error("Reasignar instructora fallo", err);
          message.error("No se pudo reasignar la instructora");
          throw err;
        }
      },
    });
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
  return value === true;
};
const renderEstado = (value, record) => { 
  const checked = isEvaluado(value); 
  return (
     <div style={{ display: "flex", alignItems: "center", gap: 12 }}> 
     <Tag color={checked ? "green" : "red"}>
       {checked ? "Evaluado" : "No evaluado"} 
       </Tag> 
       <Switch checked={checked} onChange={async (nextChecked) => {
        try { await handleSetEstado(record, nextChecked); }
        catch (err) { console.error("Actualizar estado fallo", err); } 
      }} checkedChildren="SI" unCheckedChildren="NO" /> 
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

  const renderInstructora = (value, record) => {
    const categoriaKey = String(record.categoria || "")
      .trim()
      .toLowerCase();
    const currentValue = String(value || record.lider || "").trim();

    if (!canReassignInstructora) {
      return currentValue || "-";
    }

    const instructorasCategoria = instructorasPorCategoria[categoriaKey] || [];
    const options = Array.from(
      new Set([
        currentValue,
        ...instructorasCategoria,
      ].filter(Boolean))
    )
      .sort((a, b) => a.localeCompare(b, "es"))
      .map((name) => ({
        label: name,
        value: name,
      }));

    return (
      <Select
        size="small"
        className="instructora-reassign-select"
        popupClassName="instructora-reassign-dropdown"
        value={currentValue || undefined}
        options={options}
        showSearch
        optionFilterProp="label"
        placeholder="Seleccione instructora"
        disabled={options.length === 0 || reassigningRecordId === record.id}
        loading={reassigningRecordId === record.id}
        suffixIcon={<UserRoundCheck size={15} strokeWidth={2.2} />}
        onChange={(nextValue) =>
          confirmSetInstructora(record, nextValue, currentValue)
        }
        filterOption={(input, option) =>
          String(option?.label || "")
            .toLowerCase()
            .includes(input.toLowerCase())
        }
      />
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
    { title: "Instructora", dataIndex: "instructora", width: 320, render: renderInstructora },
    { title: "Categoría", dataIndex: "categoria", render: (value) => value || "-" },
    fechaInscripcionColumn,
    { title: "Observación", dataIndex: "observacion", render: renderObservacion },
    { title: "Evaluado", dataIndex: "estado", render: renderEstado },

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
          scroll={{ x: mode === "todera" ? 1650 : 1150 }}
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
