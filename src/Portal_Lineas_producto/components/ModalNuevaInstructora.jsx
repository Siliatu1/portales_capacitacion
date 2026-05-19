import {
  Modal,
  Form,
  Input,
  Checkbox,
  message,
} from "antd";

import {
  useState,
} from "react";

import {
  crearInstructoraService,
} from "../services/instructorasService";

const ModalNuevaInstructora =
  ({
    open,
    onClose,
    onSuccess,
  }) => {
    const [form] =
      Form.useForm();

    const [
      loading,
      setLoading,
    ] = useState(false);

    const handleSubmit =
      async () => {
        try {
          const values =
            await form.validateFields();

          setLoading(true);

          const payload =
            {
              data: {
                Nombre:
                  values.nombre,

                sal:
                  values.sal ||
                  false,

                dulce:
                  values.dulce ||
                  false,

                bebidas:
                  values.bebidas ||
                  false,

                brunch:
                  values.brunch ||
                  false,
              },
            };

          await crearInstructoraService(
            payload
          );

          message.success(
            "Instructora creada correctamente"
          );

          form.resetFields();

          onSuccess?.();

          onClose?.();
        } catch (error) {
          console.error(
            error
          );

          message.error(
            "Error al crear instructora"
          );
        } finally {
          setLoading(false);
        }
      };

    return (
      <Modal
        open={open}
        title="Agregar instructora"
        onCancel={
          onClose
        }
        onOk={
          handleSubmit
        }
        confirmLoading={
          loading
        }
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[
              {
                required: true,
                message:
                  "Ingrese el nombre",
              },
            ]}
          >
            <Input placeholder="Nombre instructora" />
          </Form.Item>

          <Form.Item
            name="sal"
            valuePropName="checked"
          >
            <Checkbox>
              Sal
            </Checkbox>
          </Form.Item>

          <Form.Item
            name="dulce"
            valuePropName="checked"
          >
            <Checkbox>
              Dulce
            </Checkbox>
          </Form.Item>

          <Form.Item
            name="bebidas"
            valuePropName="checked"
          >
            <Checkbox>
              Bebidas
            </Checkbox>
          </Form.Item>

          <Form.Item
            name="brunch"
            valuePropName="checked"
          >
            <Checkbox>
              Brunch
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

export default ModalNuevaInstructora;