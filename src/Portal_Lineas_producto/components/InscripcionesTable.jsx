import { Table } from "antd";

const columns = [
  { title: "Cédula", dataIndex: "cedula" },
  { title: "Nombre", dataIndex: "nombres" },
  { title: "Teléfono", dataIndex: "telefono" },
  { title: "Punto Venta", dataIndex: "puntoVenta" },
  { title: "Fecha", dataIndex: "dia" }
];

export default function InscripcionesTable({ data, loading }) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
}