import {
  Table,
  Tag,
} from "antd";

const AdminTable = ({
  loading,
  data,
}) => {
  /* =========================
     COLUMNS
  ========================= */

  const columns = [
    {
      title: "Instructora",

      dataIndex:
        "instructora",

      key: "instructora",

      fixed: "left",

      width: 220,
    },

    {
      title: "Fecha",

      render: (_, row) =>
        row.attributes?.fecha,
    },

    {
      title: "Actividad",

      render: (_, row) => (
        <Tag color="green">
          {
            row.attributes
              ?.actividad
          }
        </Tag>
      ),
    },

    {
      title: "PDV",

      render: (_, row) =>
        row.attributes
          ?.pdv_nombre,
    },

    {
      title: "Hora Inicio",

      render: (_, row) =>
        row.attributes
          ?.hora_inicio?.substring(
            0,
            5
          ),
    },

    {
      title: "Hora Fin",

      render: (_, row) =>
        row.attributes
          ?.hora_fin?.substring(
            0,
            5
          ),
    },
  ];

  /* =========================
     RENDER
  ========================= */

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 15,
      }}
      scroll={{
        x: 1200,
      }}
    />
  );
};

export default AdminTable;