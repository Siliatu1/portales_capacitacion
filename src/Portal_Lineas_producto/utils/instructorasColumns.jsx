import {
  Button,
  Popconfirm,
  Tooltip,
} from "antd";

import {
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

export const renderCeldaCategoria =
  (
    asignacion,
    pdvId,
    categoria,
    abrirModal,
    eliminar
  ) => {
    if (!asignacion) {
      return (
        <div
          style={{
            textAlign:
              "center",
          }}
        >
          <Tooltip
            title={`Agregar instructora para ${categoria}`}
          >
            <Button
              type="primary"
              shape="circle"
              icon={
                <PlusOutlined />
              }
              size="small"
              onClick={() =>
                abrirModal(
                  pdvId,
                  categoria
                )
              }
            />
          </Tooltip>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          gap: "6px",
          alignItems:
            "center",
          justifyContent:
            "space-between",
        }}
      >
        <span>
          {
            asignacion.instructoraNombre
          }
        </span>

        <Popconfirm
          title="¿Eliminar?"
          onConfirm={() =>
            eliminar(
              pdvId,
              asignacion.instructoraId
            )
          }
        >
          <Button
            danger
            size="small"
            icon={
              <DeleteOutlined />
            }
          />
        </Popconfirm>
      </div>
    );
  };

export const getColumnsGestionInstructoras =
  (
    abrirModal,
    eliminar
  ) => [
    {
      title:
        "Punto de Venta",

      dataIndex:
        "puntoVenta",

      key: "puntoVenta",
    },

    {
      title: "SAL",

      dataIndex: "sal",

      key: "sal",

      render: (
        sal,
        record
      ) =>
        renderCeldaCategoria(
          sal,
          record.pdvId,
          "SAL",
          abrirModal,
          eliminar
        ),
    },

    {
      title: "DULCE",

      dataIndex:
        "dulce",

      key: "dulce",

      render: (
        dulce,
        record
      ) =>
        renderCeldaCategoria(
          dulce,
          record.pdvId,
          "DULCE",
          abrirModal,
          eliminar
        ),
    },
  ];