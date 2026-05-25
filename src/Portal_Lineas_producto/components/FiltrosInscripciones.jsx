import { Input, Space, Button, Select } from "antd";
import "../styles/FiltrosInscripciones.css";

const getDateOnly = (value) => String(value || "").split("T")[0];

export default function FiltrosInscripciones({
  filtros,
  setFiltros,
  fechasDisponibles = [],
}) {
  const fechaOptions = Array.from(
    new Set((fechasDisponibles || []).map(getDateOnly).filter(Boolean))
  ).map((fecha) => ({
    label: fecha,
    value: fecha,
  }));

  return (
    <div className="filtros-container">
      <Space className="filtros-space" wrap size="middle">
        <Input
          className="filtro-input"
          placeholder="Cédula"
          value={filtros.cedula}
          onChange={(e) =>
            setFiltros({
              ...filtros,
              cedula: e.target.value,
            })
          }
        />

        <Input
          className="filtro-input"
          placeholder="Punto de venta"
          value={filtros.puntoVenta}
          onChange={(e) =>
            setFiltros({
              ...filtros,
              puntoVenta: e.target.value,
            })
          }
        />

        <Select
          className="filtro-select"
          placeholder="Fecha"
          value={filtros.fecha || undefined}
          onChange={(value) =>
            setFiltros({
              ...filtros,
              fecha: value || "",
            })
          }
          options={fechaOptions}
          allowClear
          showSearch
          optionFilterProp="label"
          filterOption={(input, option) =>
            String(option?.label || "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          notFoundContent="No se encontraron fechas"
        />

        <Button
          className="filtro-btn"
          onClick={() =>
            setFiltros({
              cedula: "",
              puntoVenta: "",
              fecha: "",
              formulario: "todos",
            })
          }
        >
          Limpiar
        </Button>
      </Space>
    </div>
  );
}
