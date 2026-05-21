import {
  Table,
  Tag,
  Button,
  Popconfirm,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  getColorActividad,
} from "../utils/motivos";

const HorariosTable = ({
  data = [],
  loading = false,
  onEditar,
  onEliminar,
}) => {
  /* =========================
     COLUMNS
  ========================= */

  const columns = [
    {
      title: "Fecha",

      dataIndex: "fecha",

      key: "fecha",

      width: 120,
    },

    {
      title: "Punto de Venta",

      dataIndex:
        "puntoVenta",

      key: "puntoVenta",

      width: 220,
    },

    {
      title: "Actividad",

      dataIndex: "motivo",

      key: "motivo",

      width: 180,

      render: (value) => (
        <Tag
          color={
            getColorActividad(
              value
            )
          }
        >
          {value}
        </Tag>
      ),
    },

    {
      title: "Hora Inicio",

      dataIndex:
        "horaInicio",

      key: "horaInicio",

      width: 120,
    },

    {
      title: "Hora Fin",

      dataIndex:
        "horaFin",

      key: "horaFin",

      width: 120,
    },

    {
      title: "Horas",

      key: "horas",

      width: 100,

      render: (_, row) => {
        const inicio =
          row.horaInicio
            ?.split(":")
            .map(Number);

        const fin =
          row.horaFin
            ?.split(":")
            .map(Number);

        if (
          !inicio ||
          !fin
        ) {
          return "0h";
        }

        const minutosInicio =
          inicio[0] * 60 +
          inicio[1];

        const minutosFin =
          fin[0] * 60 +
          fin[1];

        const total =
          (
            (minutosFin -
              minutosInicio) /
            60
          ).toFixed(1);

        return `${total}h`;
      },
    },

    {
      title: "Acciones",

      key: "acciones",

      fixed: "right",

      width: 140,

      render: (_, row) => (
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <Button
            icon={
              <EditOutlined />
            }
            onClick={() =>
              onEditar(row)
            }
          />

          <Popconfirm
            title="Eliminar horario"
            description="¿Deseas eliminar este horario?"
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={() =>
              onEliminar(
                row.id
              )
            }
          >
            <Button
              danger
              icon={
                <DeleteOutlined />
              }
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="horarios-table">
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
        }}
        scroll={{
          x: 1000,
        }}
      />
    </div>
  );
};

export default HorariosTable;