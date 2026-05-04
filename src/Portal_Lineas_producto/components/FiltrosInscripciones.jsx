import { Input, Space, Button } from "antd";

export default function FiltrosInscripciones({ filtros, setFiltros }) {
  return (
    <Space>
      <Input
        placeholder="Cédula"
        value={filtros.cedula}
        onChange={e => setFiltros({ ...filtros, cedula: e.target.value })}
      />

      <Input
        placeholder="Punto de venta"
        value={filtros.puntoVenta}
        onChange={e => setFiltros({ ...filtros, puntoVenta: e.target.value })}
      />

      <Button onClick={() => setFiltros({ cedula: "", puntoVenta: "", fecha: "" })}>
        Limpiar
      </Button>
    </Space>
  );
}