import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
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
    } catch {
      // Continua con el PDV guardado en las llaves antiguas.
    }

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

const getEmpleadoValue = (empleado, ...keys) => {
  const source = empleado?.attributes || empleado || {};

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
      return source[key];
    }
  }

  return "";
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
    getEmpleadoValue(empleado, "area_nombre", "area", "pdv", "puntoVenta", "pdv_nombre") ||
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
            getEmpleadoValue(
              empleadoEncontrado,
              "celular",
              "Celular",
              "telefono",
              "Telefono",
              "mobile",
              "phone"
            ) ||
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
    (askConfirmation = true) => {
      const confirmed = !askConfirmation || window.confirm("Desea cancelar y limpiar la reserva?");

      if (!confirmed) return;

      limpiarEmpleado();

      setCategoria("");

      setCargoEvaluar("");

      setInstructora("");

      setTelefono("");

      if (askConfirmation) {
        window.alert("Reserva cancelada");
      }
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
          getEmpleadoValue(empleado, "nombre", "fullName", "nombres", "name", "nombre_completo"),

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
        const confirmed = window.confirm("Desea registrar esta evaluacion?");

        if (!confirmed) return;

        setLoading(true);

        await guardarTodera(
          payload
        );

        message.success(
          "Evaluacion registrada"
        );
        window.alert("Reserva confirmada!");

        handleLimpiar(false);
      } catch (error) {
        console.error(
          error
        );

        message.error(
          "Error al guardar la evaluacion"
        );
        window.alert("No se pudo confirmar la reserva");
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
                  getEmpleadoValue(empleado, "nombre", "fullName", "nombres", "name", "nombre_completo")
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
                  getEmpleadoValue(empleado, "cargo", "position", "cargo_general")
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

                <select
                  className="todera-cargo-select"
                  value={
                    cargoEvaluar
                  }
                  onChange={(event) =>
                    setCargoEvaluar(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Seleccione cargo
                  </option>

                  {opcionesCargoEvaluar.map(
                    (grupo) => (
                      <optgroup
                        key={grupo.label}
                        label={
                          grupo.label
                        }
                      >
                        {grupo.options.map(
                          (
                            opcion
                          ) => (
                            <option
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
                            </option>
                          )
                        )}
                      </optgroup>
                    )
                  )}
                </select>
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
