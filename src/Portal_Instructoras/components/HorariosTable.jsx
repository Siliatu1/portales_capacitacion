import {
  Card,
  Table,
  Tag
} from "antd";

function HorariosTable({
  horarios,
  totalHoras,
  infoSemana,
  formatearFecha
}) {
  return (
    <div className="horarios-table-section">
      <div className="table-header">
        <div>
          <h3 className="table-title">
            Horarios Programados
          </h3>

          {infoSemana && (
            <p>
              {formatearFecha(
                infoSemana.fechaInicio
              )}{" "}
              -{" "}
              {formatearFecha(
                infoSemana.fechaFin
              )}
            </p>
          )}
        </div>

        <Tag color="green">
          {totalHoras.toFixed(1)}h
        </Tag>
      </div>

      <Card>
        <Table
          dataSource={horarios}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: "PDV",
              render: (_, item) =>
                item.attributes
                  ?.pdv_nombre
            },
            {
              title: "Actividad",
              render: (_, item) => (
                <Tag color="blue">
                  {
                    item.attributes
                      ?.actividad
                  }
                </Tag>
              )
            },
            {
              title: "Horario",
              render: (_, item) =>
                `${item.attributes?.hora_inicio?.substring(
                  0,
                  5
                )} - ${item.attributes?.hora_fin?.substring(
                  0,
                  5
                )}`
            }
          ]}
        />
      </Card>
    </div>
  );
}

export default HorariosTable;