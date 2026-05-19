import {
  Modal,
  Select,
  message,
} from "antd";

import {
  useEffect,
  useState,
} from "react";

import {
  obtenerInstructorasPorCategoria,
  actualizarPDVInstructoras,
} from "../services/instructorasService";

const ModalAsignarInstructora = ({
  open,
  onClose,
  categoria,
  pdvId,
  onSuccess,
}) => {
  const [
    instructoras,
    setInstructoras,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    instructoraSeleccionada,
    setInstructoraSeleccionada,
  ] = useState(null);

  useEffect(() => {
    if (
      !open ||
      !categoria
    )
      return;

    cargarInstructoras();
  }, [open, categoria]);

  const cargarInstructoras =
    async () => {
      try {
        setLoading(true);

        const result =
          await obtenerInstructorasPorCategoria(
            categoria
          );

        setInstructoras(
          result?.data || []
        );
      } catch (error) {
        console.error(
          error
        );

        message.error(
          "Error cargando instructoras"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleAsignar =
    async () => {
      if (
        !instructoraSeleccionada
      ) {
        message.warning(
          "Seleccione una instructora"
        );

        return;
      }

      try {
        setLoading(true);

        // TRAER PDV ACTUAL
        const response =
          await fetch(
            `https://macfer.crepesywaffles.com/api/cap-pdvs/${pdvId}?populate=cap_instructoras`
          );

        const pdv =
          await response.json();

        const instructorasActuales =
          pdv?.data?.attributes
            ?.cap_instructoras
            ?.data || [];

        // IDS ACTUALES
        const idsActuales =
          instructorasActuales.map(
            (item) =>
              item.id
          );

        // EVITAR DUPLICADOS
        const nuevosIds =
          [
            ...new Set([
              ...idsActuales,
              instructoraSeleccionada,
            ]),
          ];

        // GUARDAR TODAS
        await actualizarPDVInstructoras(
          pdvId,
          nuevosIds
        );

        message.success(
          "Instructora asignada correctamente"
        );

        onSuccess?.();

        onClose?.();

        setInstructoraSeleccionada(
          null
        );
      } catch (error) {
        console.error(
          error
        );

        message.error(
          "Error asignando instructora"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Modal
      open={open}
      title={`Asignar instructora - ${categoria?.toUpperCase()}`}
      onCancel={onClose}
      onOk={handleAsignar}
      confirmLoading={
        loading
      }
      okText="Asignar"
      cancelText="Cancelar"
    >
      <Select
        style={{
          width: "100%",
        }}
        placeholder="Seleccione instructora"
        value={
          instructoraSeleccionada
        }
        onChange={(value) =>
          setInstructoraSeleccionada(
            value
          )
        }
        options={instructoras.map(
          (item) => ({
            value:
              item.id,

            label:
              item.attributes
                ?.Nombre,
          })
        )}
      />
    </Modal>
  );
};

export default ModalAsignarInstructora;