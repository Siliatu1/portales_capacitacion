import {
  Table,
  Button,
  Tooltip,
} from "antd";

import {
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const renderInstructora = (
  categoria
) => (
  <span
    className={
      categoria
        ? "nombre-instructora"
        : "sin-asignar"
    }
  >
    {categoria
      ? categoria.instructoraNombre
      : "Sin asignar"}
  </span>
);

const renderAccionCategoria = (
  categoria,
  pdvId,
  categoriaKey,
  abrirModal,
  eliminarAsignacion
) => {
  if (!categoria) {
    return (
      <Tooltip title="Asignar instructora">
        <Button
          type="primary"
          shape="circle"
          size="small"
          icon={<PlusOutlined />}
          onClick={() =>
            abrirModal(
              pdvId,
              categoriaKey
            )
          }
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Eliminar">
      <Button
        danger
        size="small"
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={() =>
          eliminarAsignacion(
            pdvId,
            categoria.instructoraId
          )
        }
      />
    </Tooltip>
  );
};

const buildLineaColumns = (
  title,
  dataIndex,
  abrirModal,
  eliminarAsignacion
) => ({
  title,
  children: [
    {
      title: "Instructora",
      dataIndex,
      key: `${dataIndex}-instructora`,
      render: renderInstructora,
    },
    {
      title: "Acciones",
      key: `${dataIndex}-acciones`,
      align: "center",
      width: 96,
      render: (_, record) =>
        renderAccionCategoria(
          record[dataIndex],
          record.pdvId,
          dataIndex,
          abrirModal,
          eliminarAsignacion
        ),
    },
  ],
});

const TablaGestionInstructoras = ({
  data,
  loading,
  abrirModal,
  eliminarAsignacion,
}) => {
  const columns = [
    {
      title: "PUNTO DE VENTA",

      dataIndex: "puntoVenta",

      key: "puntoVenta",

      render: (text) => (
        <span className="pdv-text">
          {text}
        </span>
      ),
    },

    buildLineaColumns(
      "SAL",
      "sal",
      abrirModal,
      eliminarAsignacion
    ),

    buildLineaColumns(
      "DULCE",
      "dulce",
      abrirModal,
      eliminarAsignacion
    ),

    buildLineaColumns(
      "BEBIDAS",
      "bebidas",
      abrirModal,
      eliminarAsignacion
    ),
  ];

  return (
    <div className="tabla-container-custom">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 12,
        }}
        rowClassName={() =>
          "fila-tabla"
        }
        scroll={{
          x: 1100,
        }}
      />
    </div>
  );
};

export default TablaGestionInstructoras;
