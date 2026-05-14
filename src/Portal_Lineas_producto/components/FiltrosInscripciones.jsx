import { Input, Space, Button, Select } from "antd";
import "../styles/FiltrosInscripciones.css";

export default function FiltrosInscripciones({
  filtros,
  setFiltros,
  fechasDisponibles = [],
}) {
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
          options={(fechasDisponibles || []).map((f) => ({
            label: f,
            value: f,
          }))}
          allowClear
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