import { Input, Space, Button, Select } from "antd";

export default function FiltrosInscripciones({ filtros, setFiltros, fechasDisponibles = [] }) {
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

      <Select
        placeholder="Fecha"
        style={{ minWidth: 160 }}
        value={filtros.fecha || undefined}
        onChange={value => setFiltros({ ...filtros, fecha: value || "" })}
        options={(fechasDisponibles || []).map(f => ({ label: f, value: f }))}
        allowClear
      />

      <Button onClick={() => setFiltros({ cedula: "", puntoVenta: "", fecha: "", formulario: 'todos' })}>
        Limpiar
      </Button>
    </Space>
  );
}