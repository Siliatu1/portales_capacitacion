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

  /* =========================================
     COLUMNAS GENERALES
  ========================================= */

  const commonColumns = [
    {
      title: "Cedula",
      dataIndex: "cedula",
      key: "cedula",

      responsive: ["md"],

      ellipsis: true,
    },

    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",

      ellipsis: true,
    },

    {
      title: "Telefono",
      dataIndex: "telefono",
      key: "telefono",

      responsive: ["lg"],

      ellipsis: true,
    },

    {
      title:
        "Punto de Venta",

      dataIndex:
        "puntoVenta",

      key: "puntoVenta",

      responsive: ["xl"],

      ellipsis: true,

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

      responsive: ["xl"],

      ellipsis: true,
    },

    {
      title: "Dia",

      dataIndex: "dia",

      key: "dia",

      responsive: ["md"],

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

  /* =========================================
     ASISTENCIA
  ========================================= */

  const asistenciaColumn = {
    title: "Asistencia",

    dataIndex:
      "asistencia",

    key: "asistencia",

    responsive: ["sm"],

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

  /* =========================================
     ACCIONES
  ========================================= */

  const actionColumn = {
    title: "Acciones",

    key: "acciones",

    fixed: "right",

    responsive: ["md"],

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

  /* =========================================
     HELADERIA
  ========================================= */

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

        responsive: ["md"],

        ellipsis: true,
      },

      ...commonColumns.slice(
        3
      ),

      asistenciaColumn,
    ];

  /* =========================================
     TODERA
  ========================================= */

  const toderaColumns = [
    {
      title: "Cédula",
      dataIndex: "cedula",
      key: "cedula",

      responsive: ["md"],

      ellipsis: true,
    },

    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",

      ellipsis: true,
    },

    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",

      responsive: ["lg"],

      ellipsis: true,
    },

    {
      title:
        "Cargo a Evaluar",

      dataIndex:
        "cargo",

      key: "cargo",

      responsive: ["md"],

      ellipsis: true,

      render: (value) =>
        value || "-",
    },

    {
      title:
        "Punto de Venta",

      dataIndex:
        "puntoVenta",

      key: "puntoVenta",

      responsive: ["xl"],

      ellipsis: true,

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
        "Instructora",

      dataIndex:
        "instructora",

      key: "instructora",

      responsive: ["xl"],

      ellipsis: true,

      render: (value) =>
        value || "-",
    },

    {
      title:
        "Categoría",

      dataIndex:
        "categoria",

      key: "categoria",

      responsive: ["lg"],

      render: (value) =>
        value || "-",
    },

    {
      title:
        "Día Inscripción",

      dataIndex: "dia",

      key: "dia",

      responsive: ["md"],

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

    {
      title: "Estado",

      dataIndex:
        "estado",

      key: "estado",

      responsive: ["sm"],

      render: (value) => {
        return (
          <Tag
            color={
              value === true
                ? "green"
                : "red"
            }
          >
            {value === true
              ? "Aprobado"
              : "Pendiente"}
          </Tag>
        );
      },
    },

    {
      title:
        "Observación",

      dataIndex:
        "observacion",

      key: "observacion",

      responsive: ["xl"],

      ellipsis: true,

      render: (value) =>
        value ||
        "Sin observación",
    },
  ];

  /* =========================================
     RESTAURANTE
  ========================================= */

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

        scroll={{
          x: "max-content",
        }}

        locale={{
          emptyText:
            "No hay inscripciones",
        }}
      />

    </div>
  );
}