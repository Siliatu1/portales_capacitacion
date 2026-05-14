import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Select,
  message,
} from "antd";

import {
  ArrowLeft,
} from "lucide-react";

import BuscarEmpleado from "../components/BuscarEmpleado";

import useEmpleado from "../hooks/useEmpleado";

import {
  obtenerInstructora,
} from "../services/instructoraService";

import {
  guardarTodera,
} from "../services/toderaService";

import {
  opcionesCargoEvaluar,
} from "../utils/toderaOptions.js";

import "../styles/formtodera.css";

const getPdvFromStorage =
  () => {
    try {
      const raw =
        localStorage.getItem(
          "user"
        );

      if (raw) {
        const user =
          JSON.parse(raw);

        return (
          user?.pdv ||
          user?.puntoVenta ||
          user?.area_nombre ||
          ""
        );
      }
    } catch (_) {}

    return (
      localStorage.getItem(
        "pdv"
      ) ||
      localStorage.getItem(
        "puntoVenta"
      ) ||
      ""
    );
  };

const FormTodera = () => {
  const navigate =
    useNavigate();

  const pdvLogin =
    getPdvFromStorage();

  const {
    documento,
    setDocumento,
    empleado,
    buscarEmpleado,
    loading:
      loadingEmpleado,
    mensaje,
    limpiarEmpleado,
  } = useEmpleado();

  const [
    categoria,
    setCategoria,
  ] = useState("");

  const [
    cargoEvaluar,
    setCargoEvaluar,
  ] = useState("");

  const [
    instructora,
    setInstructora,
  ] = useState("");

  const [
    telefono,
    setTelefono,
  ] = useState("");

  const [
    loadingInst,
    setLoadingInst,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const pdvEfectivo =
    pdvLogin ||
    empleado?.area_nombre ||
    empleado?.pdv ||
    "";

  const handleBuscarEmpleado =
    async () => {
      try {
        const empleadoEncontrado =
          await buscarEmpleado(
            documento
          );

        if (
          empleadoEncontrado
        ) {
          setTelefono(
            empleadoEncontrado.telefono ||
              empleadoEncontrado.celular ||
              ""
          );
        }
      } catch (error) {
        console.error(
          error
        );
      }
    };

  const handleCategoriaChange =
    async (e) => {
      const nuevaCategoria =
        e.target.value;

      setCategoria(
        nuevaCategoria
      );

      setCargoEvaluar("");

      setInstructora("");

      if (
        !nuevaCategoria ||
        !empleado ||
        !pdvEfectivo
      ) {
        return;
      }

      try {
        setLoadingInst(
          true
        );

        const nombre =
          await obtenerInstructora(
            pdvEfectivo,
            nuevaCategoria
          );

        setInstructora(
          nombre ||
            "Sin instructora asignada"
        );
      } catch (error) {
        console.error(
          error
        );

        setInstructora(
          "Error al buscar instructora"
        );
      } finally {
        setLoadingInst(
          false
        );
      }
    };

  const handleLimpiar =
    () => {
      limpiarEmpleado();

      setCategoria("");

      setCargoEvaluar("");

      setInstructora("");

      setTelefono("");
    };

  const handleSubmit =
    async () => {
      if (!empleado) {
        message.warning(
          "Primero busca un empleado"
        );

        return;
      }

      if (!categoria) {
        message.warning(
          "Selecciona una categoria"
        );

        return;
      }

      if (!cargoEvaluar) {
        message.warning(
          "Selecciona el cargo a evaluar"
        );

        return;
      }

      const payload = {
        Nombre:
          empleado.nombre,

        documento:
          documento,

        telefono:
          telefono,

        pdv: pdvEfectivo,

        lider:
          instructora,

        cargo:
          cargoEvaluar,

        categoria:
          categoria.toUpperCase(),

        tipo_formulario:
          "FORM_TODERA",
      };

      try {
        setLoading(true);

        await guardarTodera(
          payload
        );

        message.success(
          "Evaluacion registrada"
        );

        handleLimpiar();
      } catch (error) {
        console.error(
          error
        );

        message.error(
          "Error al guardar la evaluacion"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="form-todera-wrapper">
      <div className="todera-page-header">
        <button
          type="button"
          className="todera-back-button"
          onClick={() =>
            navigate(
              "/lineas-producto"
            )
          }
        >
          <ArrowLeft size={18} />
          Volver al panel
        </button>
      </div>

      <div className="alert-warning">
        SOLO SE PUEDE
        INSCRIBIR SI YA
        ESTA 100% LISTA
        PARA LA
        EVALUACION
      </div>

      <BuscarEmpleado
        documento={
          documento
        }
        setDocumento={
          setDocumento
        }
        onBuscar={
          handleBuscarEmpleado
        }
        loading={
          loadingEmpleado
        }
      />

      {mensaje.texto && (
        <div
          className={`mensaje-busqueda mensaje-${mensaje.tipo}`}
        >
          {mensaje.texto}
        </div>
      )}

      {empleado && (
        <div className="todera-card">
          {empleado.photo && (
            <div className="foto-empleado">
              <label>
                FOTO
              </label>

              <img
                src={
                  empleado.photo
                }
                alt="Foto empleado"
              />
            </div>
          )}

          <div className="todera-grid">
            <div className="form-field">
              <label>
                NOMBRES
                COMPLETOS *
              </label>

              <input
                value={
                  empleado.nombre ||
                  ""
                }
                readOnly
              />
            </div>

            <div className="form-field">
              <label>
                TELEFONO
              </label>

              <input
                value={
                  telefono
                }
                onChange={(
                  e
                ) =>
                  setTelefono(
                    e.target
                      .value
                  )
                }
              />
            </div>

            <div className="form-field">
              <label>
                CARGO
              </label>

              <input
                value={
                  empleado.area_nombre ||
                  ""
                }
                readOnly
              />
            </div>

            <div className="form-field">
              <label>
                PUNTO DE
                VENTA
              </label>

              <input
                value={
                  pdvEfectivo
                }
                readOnly
              />
            </div>

            <div className="form-field">
              <label>
                CATEGORIA A
                EVALUAR *
              </label>

              <select
                value={
                  categoria
                }
                onChange={
                  handleCategoriaChange
                }
              >
                <option value="">
                  Seleccione
                </option>

                <option value="sal">
                  Sal
                </option>

                <option value="dulce">
                  Dulce
                </option>

                <option value="bebidas">
                  Bebidas
                </option>
              </select>
            </div>

            {categoria && (
              <div className="form-field">
                <label>
                  CARGO A
                  EVALUAR *
                </label>

                <Select
                  className="todera-cargo-select"
                  placeholder="Seleccione cargo"
                  value={
                    cargoEvaluar ||
                    undefined
                  }
                  onChange={(val) =>
                    setCargoEvaluar(
                      val
                    )
                  }
                  optionLabelProp="label"
                  popupClassName="cargo-dropdown"
                >
                  {opcionesCargoEvaluar.map(
                    (grupo) => (
                      <Select.OptGroup
                        key={grupo.label}
                        label={
                          <span
                            className={`cargo-group-label ${grupo.color}`}
                          >
                            {
                              grupo.label
                            }
                          </span>
                        }
                      >
                        {grupo.options.map(
                          (
                            opcion
                          ) => (
                            <Select.Option
                              key={
                                opcion.value
                              }
                              value={
                                opcion.value
                              }
                              label={
                                opcion.label
                              }
                            >
                              {
                                opcion.label
                              }
                            </Select.Option>
                          )
                        )}
                      </Select.OptGroup>
                    )
                  )}
                </Select>
              </div>
            )}

            <div className="form-field">
              <label>
                NOMBRE DE LA
                INSTRUCTORA
              </label>

              <input
                value={
                  loadingInst
                    ? "Buscando..."
                    : instructora
                }
                readOnly
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn-limpiar"
              onClick={
                handleLimpiar
              }
              type="button"
            >
              Limpiar
            </button>

            <button
              className="btn-registrar"
              onClick={
                handleSubmit
              }
              disabled={
                loading ||
                loadingInst
              }
              type="button"
            >
              {loading
                ? "Guardando..."
                : "Registrar Evaluacion"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormTodera;
