import {
  Table,
  Button,
  Tooltip,
} from "antd";

import {
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const renderCategoria = (
  categoria,
  pdvId,
  categoriaKey,
  abrirModal,
  eliminarAsignacion
) => {
  if (!categoria) {
    return (
      <div className="categoria-cell">
        <span className="sin-asignar">
          Sin asignar
        </span>

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
      </div>
    );
  }

  return (
    <div className="categoria-cell">
      <span className="nombre-instructora">
        {categoria.instructoraNombre}
      </span>

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
    </div>
  );
};

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

    {
      title: "SAL",

      dataIndex: "sal",

      render: (value, record) =>
        renderCategoria(
          value,
          record.pdvId,
          "sal",
          abrirModal,
          eliminarAsignacion
        ),
    },

    {
      title: "DULCE",

      dataIndex: "dulce",

      render: (value, record) =>
        renderCategoria(
          value,
          record.pdvId,
          "dulce",
          abrirModal,
          eliminarAsignacion
        ),
    },

    {
      title: "BEBIDAS",

      dataIndex: "bebidas",

      render: (value, record) =>
        renderCategoria(
          value,
          record.pdvId,
          "bebidas",
          abrirModal,
          eliminarAsignacion
        ),
    },

    {
      title: "BRUNCH",

      dataIndex: "brunch",

      render: (value, record) =>
        renderCategoria(
          value,
          record.pdvId,
          "brunch",
          abrirModal,
          eliminarAsignacion
        ),
    },
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
          x: 900,
        }}
      />
    </div>
  );
};

export default TablaGestionInstructoras;
