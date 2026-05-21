import {
  Input,
  Select,
  Button,
} from "antd";

import {
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const AdminFilters = ({
  search,
  setSearch,
  instructora,
  setInstructora,
  instructoras,
  onRefresh,
}) => {
  return (
    <div className="admin-filters">
      {/* =========================
          SEARCH
      ========================= */}

      <Input
        placeholder="Buscar actividad, PDV o instructora"
        prefix={
          <SearchOutlined />
        }
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      {/* =========================
          INSTRUCTORA
      ========================= */}

      <Select
        placeholder="Seleccionar instructora"
        value={instructora}
        onChange={
          setInstructora
        }
        allowClear
        options={instructoras.map(
          (item) => ({
            label:
              item.attributes
                ?.nombre,

            value:
              item.attributes
                ?.nombre,
          })
        )}
      />

      {/* =========================
          REFRESH
      ========================= */}

      <Button
        icon={
          <ReloadOutlined />
        }
        onClick={onRefresh}
      >
        Actualizar
      </Button>
    </div>
  );
};

export default AdminFilters;