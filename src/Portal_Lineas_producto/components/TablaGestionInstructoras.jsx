import {
  Card,
  Button,
  Tag,
} from "antd";

import {
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import "../styles/gestionInstructoras.css";

const categorias = [
  "sal",
  "dulce",
  "bebidas",
  "brunch",
];

const TablaGestionInstructoras = ({
  data,
  abrirModal,
  eliminarAsignacion,
}) => {
  return (
    <div className="gestion-grid">
      {data.map((item) => (
        <Card
          key={item.key}
          className="gestion-card"
        >
          <h3 className="gestion-title">
            {item.puntoVenta}
          </h3>

          <div className="gestion-categorias">
            {categorias.map(
              (categoria) => {
                const asignacion =
                  item[categoria];

                return (
                  <div
                    key={
                      categoria
                    }
                    className="categoria-row"
                  >
                    <div className="categoria-info">
                      <span className="categoria-label">
                        {categoria.toUpperCase()}
                      </span>

                      {asignacion ? (
                        <Tag color="green">
                          {
                            asignacion.instructoraNombre
                          }
                        </Tag>
                      ) : (
                        <Tag color="red">
                          Sin asignar
                        </Tag>
                      )}
                    </div>

                    {asignacion ? (
                      <Button
                        danger
                        size="small"
                        icon={
                          <DeleteOutlined />
                        }
                        onClick={() =>
                          eliminarAsignacion(
                            item.pdvId,
                            asignacion.instructoraId
                          )
                        }
                      />
                    ) : (
                      <Button
                        type="primary"
                        size="small"
                        icon={
                          <PlusOutlined />
                        }
                        onClick={() =>
                          abrirModal(
                            item.pdvId,
                            categoria
                          )
                        }
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TablaGestionInstructoras;