import React, { useState, useEffect } from 'react';
import '../styles/evaluacion-todera.css';
import { Select, message } from 'antd';

import BuscarEmpleado from '../components/BuscarEmpleado';
import useEmpleado from '../hooks/useEmpleado';

const opcionesCargoEvaluar = [
  {
    label: <span className="cargo-group-title cargo-group-sal">SAL</span>,
    options: [
      { value: 'Plancha Sal', label: 'Plancha Sal' },
      { value: 'Cocina', label: 'Cocina' },
      { value: 'Pitas y Ensaladas', label: 'Pitas y Ensaladas' }
    ]
  },
  {
    label: <span className="cargo-group-title cargo-group-dulce">DULCE</span>,
    options: [
      { value: 'Postres y Helados', label: 'Postres y Helados' }
    ]
  },
  {
    label: <span className="cargo-group-title cargo-group-bebidas">BEBIDAS</span>,
    options: [
      { value: 'Bebidas Frias y Calientes', label: 'Bebidas Frias y Calientes' }
    ]
  },
  {
    label: <span className="cargo-group-title cargo-group-brunch">BRUNCH (Solo 1 punto)</span>,
    options: [
      { value: 'Plancha Sal Brunch', label: 'Plancha Sal Brunch' },
      { value: 'Cocina Brunch', label: 'Cocina Brunch' },
      { value: 'Postres y Helados Brunch', label: 'Postres y Helados Brunch' },
      { value: 'Bebidas Brunch', label: 'Bebidas Brunch' }
    ]
  }
];

const FormTodera = () => {

  const [categoria, setCategoria] = useState("");
  const [cargoEvaluar, setCargoEvaluar] = useState("");

  const {
    formData,
    setFormData,
    setLoading,
    handleChange
  } = useFormulario({
    initialState: getInitialFormState(),
  });

  const {
    empleado,
    buscarEmpleado,
    loading: loadingEmpleado
  } = useEmpleadoForm(setFormData);

  const {
    instructora,
    loadingInstructora
  } = useInstructora({
    categoria,
    empleado,
    puntoVenta: formData.puntoVenta || formData.area_nombre || empleado?.area_nombre || empleado?.pdv
  });

  const setDocumento = (documento) => {
    setFormData((prev) => ({
      ...prev,
      documento
    }));
  };

  const onSubmit = async () => {

    try {

      setLoading(true);

      const payload = {
        Nombre: formData.nombres || empleado?.nombre,
        documento: formData.documento,
        telefono: formData.telefono || empleado?.celular || empleado?.telefono,
        pdv: formData.puntoVenta || formData.area_nombre || empleado?.area_nombre || empleado?.pdv,
        lider: instructora,
        cargo: cargoEvaluar,
        categoria: categoria.toUpperCase()
      };

      await guardarTodera(payload);

      message.success("Evaluación registrada");

    } catch (error) {

      console.log(error);

      message.error("Error al guardar");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div>
      <BuscarEmpleado
        documento={formData.documento}
        setDocumento={setDocumento}
        onBuscar={() => buscarEmpleado(formData.documento)}
        loading={loadingEmpleado}
      />

      {
        empleado && (
          <>
            <input
              name="nombres"
              value={formData.nombres || empleado.nombre || ""}
              disabled
            />

            <input
              name="telefono"
              value={formData.telefono || empleado.celular || empleado.telefono || ""}
              onChange={handleChange}
            />

            <input
              name="puntoVenta"
              value={formData.puntoVenta || formData.area_nombre || empleado.area_nombre || empleado.pdv || ""}
              onChange={handleChange}
            />

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Seleccione</option>
              <option value="sal">Sal</option>
              <option value="dulce">Dulce</option>
              <option value="bebidas">Bebidas</option>
            </select>

            <Select
              value={cargoEvaluar}
              onChange={setCargoEvaluar}
              options={opcionesCargoEvaluar}
            />

            <input
              value={
                loadingInstructora
                  ? "Buscando..."
                  : instructora
              }
              disabled
            />

            <button onClick={onSubmit}>
              Guardar
            </button>
          </>
        )
      }

    </div>
  );
};

export default FormTodera;
