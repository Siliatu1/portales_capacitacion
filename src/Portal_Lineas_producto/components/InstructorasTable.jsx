import {
  Button,
  Input,
  Modal,
  Switch,
  Table,
  Tag,
} from "antd";

import {
  useState,
} from "react";

const { TextArea } =
  Input;

export default function InstructorasTable({
  data,
  loading,
  onEstadoChange,
  onGuardarObservacion,
}) {
  const [
    modalVisible,
    setModalVisible,
  ] = useState(false);

  const [
    observacion,
    setObservacion,
  ] = useState("");

  const [
    registro,
    setRegistro,
  ] = useState(null);

  const abrirModal =
    (item) => {
      setRegistro(item);

      setObservacion(
        item.observacion ||
          ""
      );

      setModalVisible(
        true
      );
    };

  const cerrarModal =
    () => {
      setModalVisible(
        false
      );

      setObservacion(
        ""
      );

      setRegistro(
        null
      );
    };

  const guardar =
    async () => {
      if (!registro) {
        return;
      }

      await onGuardarObservacion(
        registro.id,
        observacion
      );

      cerrarModal();
    };

  const renderEstado =
    (value) => {
      if (
        value === true
      ) {
        return (
          <Tag color="green">
            Evaluado
          </Tag>
        );
      }

      if (
        value === false
      ) {
        return (
          <Tag color="red">
            No Evaluado
          </Tag>
        );
      }

      return (
        <Tag color="gold">
          Pendiente
        </Tag>
      );
    };

  const columns = [
    {
      title: "Foto",

      dataIndex:
        "foto",

      key: "foto",

      width: 100,

      render: (
        foto
      ) => {
        if (
          !foto
        ) {
          return (
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius:
                  "50%",
                background:
                  "#f0f0f0",
              }}
            />
          );
        }

        return (
          <img
            src={foto}
            alt="foto"
            style={{
              width: 50,
              height: 50,
              borderRadius:
                "50%",
              objectFit:
                "cover",
            }}
          />
        );
      },
    },

    {
      title:
        "Cedula",

      dataIndex:
        "cedula",

      width: 140,
    },

    {
      title:
        "Nombres",

      dataIndex:
        "nombres",

      width: 220,
    },

    {
      title:
        "Telefono",

      dataIndex:
        "telefono",

      width: 160,
    },

    {
      title:
        "Cargo",

      dataIndex:
        "cargoEvaluar",

      width: 220,
    },

    {
      title:
        "Punto Venta",

      dataIndex:
        "puntoVenta",

      width: 220,
    },

    {
      title:
        "Categoria",

      dataIndex:
        "categoria",

      width: 140,

      render: (
        value
      ) => (
        <Tag color="blue">
          {value ||
            "N/A"}
        </Tag>
      ),
    },

    {
      title:
        "Fecha",

      dataIndex:
        "dia",

      width: 150,

      render: (
        value
      ) => {
        if (
          !value
        ) {
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
      title:
        "Estado",

      width: 180,

      fixed: "right",

      render: (
        _,
        record
      ) => {
        return (
          <div
            style={{
              display:
                "flex",
              flexDirection:
                "column",
              gap: 8,
            }}
          >
            {renderEstado(
              record.evaluado
            )}

            <Switch
              checked={
                record.evaluado ===
                true
              }
              checkedChildren="SI"
              unCheckedChildren="NO"
              onChange={(
                checked
              ) =>
                onEstadoChange(
                  record.id,
                  checked
                )
              }
            />
          </div>
        );
      },
    },

    {
      title:
        "Observacion",

      width: 180,

      fixed: "right",

      render: (
        _,
        record
      ) => {
        return (
          <Button
            type={
              record.observacion
                ? "primary"
                : "default"
            }
            onClick={() =>
              abrirModal(
                record
              )
            }
          >
            {record.observacion
              ? "Editar"
              : "Agregar"}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={
          columns
        }
        dataSource={
          data
        }
        loading={
          loading
        }
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        scroll={{
          x: 1800,
        }}
      />

      <Modal
        open={
          modalVisible
        }
        title="Observacion"
        onOk={guardar}
        onCancel={
          cerrarModal
        }
        okText="Guardar"
        cancelText="Cancelar"
      >
        {registro && (
          <div
            style={{
              marginBottom: 16,
            }}
          >
            <strong>
              {
                registro.nombres
              }
            </strong>

            <br />

            {
              registro.cedula
            }
          </div>
        )}

        <TextArea
          rows={5}
          value={
            observacion
          }
          onChange={(
            e
          ) =>
            setObservacion(
              e.target.value
            )
          }
          placeholder="Escribe una observacion"
        />
      </Modal>
    </>
  );
}