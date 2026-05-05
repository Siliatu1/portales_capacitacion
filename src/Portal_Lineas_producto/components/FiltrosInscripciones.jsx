import { Input, Space, Button, Select } from "antd";

export default function FiltrosInscripciones({ filtros, setFiltros }) {
  return (
    <Space>
      <Select
        value={filtros.formulario || 'todos'}
        style={{ width: 160 }}
        onChange={(val) => setFiltros({ ...filtros, formulario: val })}
      >
        <Select.Option value="todos">Todos los formularios</Select.Option>
        <Select.Option value="heladeria">Heladería</Select.Option>
        <Select.Option value="restaurante">PDV / Restaurante</Select.Option>
        <Select.Option value="todera">Todera</Select.Option>
      </Select>

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