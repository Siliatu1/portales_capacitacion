import {
  Input,
  Button,
  Space,
} from "antd";

import {
  SearchOutlined,
} from "@ant-design/icons";

const FiltrosGestionInstructoras =
  ({
    filtros,
    setFiltros,
  }) => {
    return (
      <Space>
        <Input
          placeholder="Buscar punto de venta..."
          prefix={
            <SearchOutlined />
          }
          value={
            filtros.puntoVenta
          }
          onChange={(
            e
          ) =>
            setFiltros({
              ...filtros,
              puntoVenta:
                e.target
                  .value,
            })
          }
        />

        <Button
          onClick={() =>
            setFiltros({
              puntoVenta:
                "",
            })
          }
        >
          Limpiar
        </Button>
      </Space>
    );
  };

export default FiltrosGestionInstructoras;