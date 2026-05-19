import {
  Button,
  Popconfirm,
  Table,
  Tag,
} from "antd";

import { useAuth } from "../../auth/hooks/useAuth";
import "../styles/Table.css";
import {
  mapAsistencia,
} from "../utils/asistencia.utils";

export default function InscripcionesTable({
  data,
  loading,
  formType,
  onDelete,
}) {
  const { hasPermission } =
    useAuth();

  const canDelete =
    hasPermission(
      "canDelete"
    );

  const parseDate = (
    value
  ) => {
    if (!value) {
      return 0;
    }

    const parsed =
      Date.parse(value);

    return Number.isNaN(
      parsed
    )
      ? 0
      : parsed;
  };

  const handleDelete =
    async (record) => {
      try {
        if (
          typeof onDelete ===
          "function"
        ) {
          await onDelete(
            record.id,
            record.sourceEndpoint
          );
        }
      } catch (err) {
        console.error(
          "ERROR ELIMINANDO:",
          err
        );
      }
    };

  const commonColumns = [
    {
      title: "Cedula",
      dataIndex: "cedula",
      key: "cedula",
    },

    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
    },

    {
      title: "Telefono",
      dataIndex: "telefono",
      key: "telefono",
    },

    {
      title:
        "Punto de Venta",

      dataIndex:
        "puntoVenta",

      key: "puntoVenta",

      render: (
        text,
        record
      ) =>
        record.puntoVenta ||
        record.area_nombre ||
        "-",
    },

    {
      title:
        "Nombre Lider",

      dataIndex: "lider",

      key: "lider",
    },

    {
      title: "Dia",

      dataIndex: "dia",

      key: "dia",

      sorter: (a, b) =>
        parseDate(a.dia) -
        parseDate(b.dia),

      defaultSortOrder:
        "descend",

      render: (value) => {
        if (!value) {
          return "-";
        }

        try {
          return new Date(
            value
          ).toLocaleDateString(
            "es-CO"
          );
        } catch {
          return value;
        }
      },
    },
  ];

  const asistenciaColumn = {
    title: "Asistencia",

    dataIndex:
      "asistencia",

    key: "asistencia",

    render: (value) => {
      const {
        label,
        color,
      } =
        mapAsistencia(
          value
        );

      return (
        <Tag color={color}>
          {label}
        </Tag>
      );
    },
  };

  const actionColumn = {
    title: "Acciones",

    key: "acciones",

    render: (
      text,
      record
    ) => (
      <Popconfirm
        title="Eliminar inscripcion?"
        onConfirm={() =>
          handleDelete(
            record
          )
        }
        okText="Si"
        cancelText="No"
      >
        <Button danger>
          Eliminar
        </Button>
      </Popconfirm>
    ),
  };

  const heladeriaColumns =
    [
      ...commonColumns.slice(
        0,
        3
      ),

      {
        title:
          "Cargo a Evaluar",

        dataIndex:
          "cargo",

        key: "cargo",
      },

      ...commonColumns.slice(
        3
      ),

      asistenciaColumn,
    ];

  const toderaColumns = [
  {
    title: "Cédula",
    dataIndex: "cedula",
    key: "cedula",
  },

  {
    title: "Nombres",
    dataIndex: "nombres",
    key: "nombres",
  },

  {
    title: "Teléfono",
    dataIndex: "telefono",
    key: "telefono",
  },

  {
    title: "Cargo a Evaluar",
    dataIndex: "cargo",
    key: "cargo",
    render: (value) => value || "-",
  },

  {
    title: "Punto de Venta",
    dataIndex: "puntoVenta",
    key: "puntoVenta",
    render: (text, record) =>
      record.puntoVenta ||
      record.area_nombre ||
      "-",
  },

  {
    title: "Instructora",
    dataIndex: "instructora",
    key: "instructora",
    render: (value) => value || "-",
  },

  {
    title: "Categoría",
    dataIndex: "categoria",
    key: "categoria",
    render: (value) => value || "-",
  },

  {
    title: "Día Inscripción",
    dataIndex: "dia",
    key: "dia",

    sorter: (a, b) =>
      parseDate(a.dia) -
      parseDate(b.dia),

    defaultSortOrder: "descend",

    render: (value) => {
      if (!value) {
        return "-";
      }

      try {
        return new Date(
          value
        ).toLocaleDateString(
          "es-CO"
        );
      } catch {
        return value;
      }
    },
  },

  {
    title: "ESTADO",
    dataIndex: "estado",
    key: "estado",

    render: (value) => {
      const estado =
        value || "No evaluado";

      return (
        <Tag
          color={
            estado ===
            true
              ? "black"
              : "red"
          }
        >
          {estado === true
            ? "Aprobado"
            : estado === false
            ? "Rechazado"
            : estado}
        </Tag>
      );
    },
  },

  {
    title: "Observación",
    dataIndex: "observacion",
    key: "observacion",

    render: (value) =>
      value || "Sin observación",
  },
];

  const restauranteColumns =
    commonColumns;

  const formTypeLower =
    String(
      formType || ""
    ).toLowerCase();

  let baseColumns =
    restauranteColumns;

  if (
    formTypeLower ===
    "heladeria"
  ) {
    baseColumns =
      heladeriaColumns;
  }

  if (
    formTypeLower ===
    "todera"
  ) {
    baseColumns =
      toderaColumns;
  }

  const columns =
    canDelete
      ? [
          ...baseColumns,
          actionColumn,
        ]
      : baseColumns;

  console.log(
    "RENDER TABLA:",
    {
      formType,
      total:
        data?.length ||
        0,
      data,
    }
  );

  return (
  <div className="table-container">
    <Table
      className="cw-table"
      columns={columns}
      dataSource={
        Array.isArray(data)
          ? data
          : []
      }
      loading={loading}
      rowKey={(record) =>
        String(record.id)
      }
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
      }}
      scroll={{ x: 1200 }}
      locale={{
        emptyText:
          "No hay inscripciones",
      }}
    />
  </div>
);
}
