import { Input, Space, Button, Select } from "antd";
import "../styles/FiltrosInscripciones.css";

const getDateOnly = (value) => String(value || "").split("T")[0];

export default function FiltrosInscripciones({
  filtros,
  setFiltros,
  fechasDisponibles = [],
  puntosVentaDisponibles = [],
  instructorasDisponibles = [],
  showInstructoraFilter = false,
}) {
  const toArrayValue = (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    return value ? [value] : [];
  };

  const buildOptions = (values) => Array.from(
    new Set((values || []).map((value) => String(value || "").trim()).filter(Boolean))
  )
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((value) => ({
      label: value,
      value,
    }));

  const fechaOptions = Array.from(
    new Set((fechasDisponibles || []).map(getDateOnly).filter(Boolean))
  ).map((fecha) => ({
    label: fecha,
    value: fecha,
  }));

  const puntoVentaOptions = buildOptions(puntosVentaDisponibles);
  const instructoraOptions = buildOptions(instructorasDisponibles);

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

        <Select
          className="filtro-select filtro-select-wide"
          mode="multiple"
          placeholder="Puntos de venta"
          value={toArrayValue(filtros.puntoVenta)}
          onChange={(value) =>
            setFiltros({
              ...filtros,
              puntoVenta: value,
            })
          }
          options={puntoVentaOptions}
          allowClear
          showSearch
          maxTagCount="responsive"
          optionFilterProp="label"
          filterOption={(input, option) =>
            String(option?.label || "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          notFoundContent="No se encontraron puntos de venta"
        />

        <Select
          className="filtro-select filtro-select-wide"
          mode="multiple"
          placeholder="Fechas"
          value={toArrayValue(filtros.fecha)}
          onChange={(value) =>
            setFiltros({
              ...filtros,
              fecha: value,
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

        {showInstructoraFilter && (
          <Select
            className="filtro-select filtro-select-wide"
            mode="multiple"
            placeholder="Instructoras"
            value={toArrayValue(filtros.instructora)}
            onChange={(value) =>
              setFiltros({
                ...filtros,
                instructora: value,
              })
            }
            options={instructoraOptions}
            allowClear
            showSearch
            maxTagCount="responsive"
            optionFilterProp="label"
            filterOption={(input, option) =>
              String(option?.label || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            notFoundContent="No se encontraron instructoras"
          />
        )}

        <Button
          className="filtro-btn"
          onClick={() =>
            setFiltros({
              cedula: "",
              puntoVenta: [],
              fecha: [],
              instructora: [],
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
