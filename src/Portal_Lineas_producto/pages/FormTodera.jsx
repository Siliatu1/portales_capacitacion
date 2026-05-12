import React, { useState } from "react";
import { Select, message } from "antd";

import BuscarEmpleado from "../components/BuscarEmpleado";

import useEmpleado from "../hooks/useEmpleado";

import { obtenerInstructora } from "../services/instructoraService";
import { guardarTodera } from "../services/toderaService";

import "../styles/formTodera.css";

const OPCIONES_POR_CATEGORIA = {
  sal: [
    { value: "Plancha Sal", label: "Plancha Sal" },
    { value: "Cocina", label: "Cocina" },
    {
      value: "Pitas y Ensaladas",
      label: "Pitas y Ensaladas",
    },
  ],

  dulce: [
    {
      value: "Postres y Helados",
      label: "Postres y Helados",
    },
  ],

  bebidas: [
    {
      value: "Bebidas Frias y Calientes",
      label: "Bebidas Frias y Calientes",
    },
  ],
};

const OPCIONES_BRUNCH = [
  {
    value: "Plancha Sal Brunch",
    label: "Plancha Sal Brunch",
  },

  {
    value: "Cocina Brunch",
    label: "Cocina Brunch",
  },

  {
    value: "Postres y Helados Brunch",
    label: "Postres y Helados Brunch",
  },

  {
    value: "Bebidas Brunch",
    label: "Bebidas Brunch",
  },
];

const getPdvFromStorage = () => {
  try {
    const raw =
      localStorage.getItem("user");

    if (raw) {
      const user = JSON.parse(raw);

      return (
        user?.pdv ||
        user?.puntoVenta ||
        user?.area_nombre ||
        ""
      );
    }
  } catch (_) {}

  return (
    localStorage.getItem("pdv") ||
    localStorage.getItem("puntoVenta") ||
    ""
  );
};

const FormTodera = () => {
  const pdvLogin =
    getPdvFromStorage();

  const {
    documento,
    setDocumento,
    empleado,
    buscarEmpleado,
    loading: loadingEmpleado,
    mensaje,
    limpiarEmpleado,
  } = useEmpleado();

  const [categoria, setCategoria] =
    useState("");

  const [cargoEvaluar, setCargoEvaluar] =
    useState("");

  const [instructora, setInstructora] =
    useState("");

  const [telefono, setTelefono] =
    useState("");

  const [loadingInst, setLoadingInst] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const pdvEfectivo =
    pdvLogin ||
    empleado?.area_nombre ||
    empleado?.pdv ||
    "";

  const opcionesCargo = categoria
    ? [
        ...(OPCIONES_POR_CATEGORIA[
          categoria
        ] || []),

        ...OPCIONES_BRUNCH,
      ]
    : [];

  const handleBuscarEmpleado =
    async () => {
      try {
        const empleadoEncontrado =
          await buscarEmpleado(
            documento
          );

        if (empleadoEncontrado) {
          setTelefono(
            empleadoEncontrado.telefono ||
              empleadoEncontrado.celular ||
              ""
          );
        }
      } catch (error) {
        console.error(error);
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
        setLoadingInst(true);

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
        console.error(error);

        setInstructora(
          "Error al buscar instructora"
        );
      } finally {
        setLoadingInst(false);
      }
    };

  const handleLimpiar = () => {
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
        Nombre: empleado.nombre,

        documento: documento,

        telefono: telefono,

        pdv: pdvEfectivo,

        lider: instructora,

        cargo: cargoEvaluar,

        categoria:
          categoria.toUpperCase(),

        tipo_formulario:
          "FORM_TODERA",
      };

      try {
        setLoading(true);

        console.log(
          "Payload a enviar:",
          payload
        );

        await guardarTodera(
          payload
        );

        message.success(
          "Evaluacion registrada"
        );

        handleLimpiar();
      } catch (error) {
        console.error(error);

        message.error(
          "Error al guardar la evaluacion"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="form-todera-wrapper">
      <div className="alert-warning">
        SOLO SE PUEDE INSCRIBIR SI YA ESTA
        100% LISTA PARA LA EVALUACION
      </div>

      <BuscarEmpleado
        documento={documento}
        setDocumento={setDocumento}
        onBuscar={handleBuscarEmpleado}
        loading={loadingEmpleado}
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
              <label>FOTO</label>

              <img
                src={empleado.photo}
                alt="Foto empleado"
              />
            </div>
          )}

          <div className="todera-grid">
            <div className="form-field">
              <label>
                NOMBRES COMPLETOS *
              </label>

              <input
                value={
                  empleado.nombre || ""
                }
                readOnly
              />
            </div>

            <div className="form-field">
              <label>TELEFONO</label>

              <input
                value={telefono}
                onChange={(e) =>
                  setTelefono(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-field">
              <label>CARGO</label>

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
                PUNTO DE VENTA
              </label>

              <input
                value={pdvEfectivo}
                readOnly
              />
            </div>

            <div className="form-field">
              <label>
                CATEGORIA A EVALUAR *
              </label>

              <select
                value={categoria}
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
                  CARGO A EVALUAR *
                </label>

                <Select
                  style={{
                    width: "100%",
                  }}
                  placeholder="Seleccione cargo"
                  value={
                    cargoEvaluar ||
                    undefined
                  }
                  onChange={(val) =>
                    setCargoEvaluar(val)
                  }
                  options={opcionesCargo}
                />
              </div>
            )}

            <div className="form-field">
              <label>
                NOMBRE DE LA INSTRUCTORA
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
              onClick={handleLimpiar}
              type="button"
            >
              Limpiar
            </button>

            <button
              className="btn-registrar"
              onClick={handleSubmit}
              disabled={
                loading || loadingInst
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