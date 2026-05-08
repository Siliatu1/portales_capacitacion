import React, { useState } from 'react';
import '../styles/evaluacion-todera.css';
import { Select, message } from 'antd';
import axios from 'axios';
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
  }
];

const FormTodera = ({ onBack, onSubmit, coordinadoraData }) => {
  const puntoVentaCoordinadora =
    coordinadoraData?.data?.area_nombre ||
    coordinadoraData?.data?.pdv ||
    '';

  console.log('PDV LOGIN:', puntoVentaCoordinadora);

  const cargoCoordinadora =
    coordinadoraData?.data?.cargo_general ||
    coordinadoraData?.data?.position ||
    '';

  const nombreLider =
    coordinadoraData?.data?.nombre ||
    coordinadoraData?.data?.name ||
    (coordinadoraData?.data?.first_name &&
    coordinadoraData?.data?.last_name
      ? `${coordinadoraData.data.first_name} ${coordinadoraData.data.last_name}`.trim()
      : coordinadoraData?.data?.full_name || '');

  const {
    documento,
    setDocumento,
    empleado,
    buscarEmpleado,
    loading,
    mensaje,
    limpiarEmpleado
  } = useEmpleado(puntoVentaCoordinadora);

  const [formData, setFormData] = useState({
    foto: '',
    nombres: '',
    telefono: '',
    cargo: cargoCoordinadora,
    puntoVenta: puntoVentaCoordinadora,
    nombreLider: nombreLider
  });

  const [categoria, setCategoria] = useState('');
  const [cargoEvaluar, setCargoEvaluar] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [instructora, setInstructora] = useState('');
  const [loadingInstructora, setLoadingInstructora] = useState(false);


  const buscarInstructora = async (categoriaSeleccionada) => {
    if (!puntoVentaCoordinadora || !categoriaSeleccionada) {
      console.log('FALTAN DATOS');
      return;
    }

    setLoadingInstructora(true);
    setInstructora('');

    try {

      const pdvEncoded = encodeURIComponent(
        puntoVentaCoordinadora
      );

      const url =
        `https://macfer.crepesywaffles.com/api/cap-pdvs?filters[nombre][$eq]=${pdvEncoded}&populate=cap_instructoras`;

      console.log('URL FINAL:', url);

      const response = await fetch(url);

      console.log('STATUS:', response.status);

      if (!response.ok) {
        throw new Error('Error al buscar instructora');
      }

      const data = await response.json();

      console.log('RESPUESTA COMPLETA API:', data);

      // VALIDAR SI EXISTE PDV
      const pdv = data?.data?.[0];

      console.log('PDV ENCONTRADO:', pdv);

      if (!pdv) {
        console.log('NO EXISTE PDV');

        message.warning(
          'No se encontró el punto de venta'
        );

        return;
      }

      // TRAER INSTRUCTORAS
      const instructoras =
        pdv.cap_instructoras ||
        pdv.attributes?.cap_instructoras?.data ||
        pdv.attributes?.cap_instructoras ||
        [];

      if (!Array.isArray(instructoras) || instructoras.length === 0) {

        console.log('NO HAY INSTRUCTORAS');

        message.warning(
          'Este PDV no tiene instructoras asociadas'
        );

        return;
      }

      // FILTRAR POR CATEGORIA
      const instructoraEncontrada = instructoras.find((instr) => {

        const info =
          instr.attributes || instr;

        console.log('VALIDANDO INSTRUCTORA:', info);

        console.log('SAL:', info?.sal);
        console.log('DULCE:', info?.dulce);
        console.log('BEBIDAS:', info?.bebidas);

        return info?.[categoriaSeleccionada] === true;
      });

      if (!instructoraEncontrada) {

        message.warning(
          `No existe instructora para ${categoriaSeleccionada}`
        );

        return;
      }

      const dataInstructora =
        instructoraEncontrada.attributes ||
        instructoraEncontrada;

      const nombreInstructora =
        dataInstructora?.Nombre ||
        dataInstructora?.nombre ||
        '';

      console.log('NOMBRE INSTRUCTORA:', nombreInstructora);

      setInstructora(nombreInstructora);

      setFormData((prev) => ({
        ...prev,
        nombreLider: nombreInstructora
      }));

      message.success(
        `Instructora asignada: ${nombreInstructora}`
      );

    } catch (error) {

      console.error('ERROR COMPLETO:', error);

      message.error(
        'Error al buscar instructora'
      );

    } finally {

      setLoadingInstructora(false);
    }
  };

  const limpiarFormulario = () => {

    limpiarEmpleado();

    setCategoria('');
    setCargoEvaluar('');
    setInstructora('');

    setFormData({
      foto: '',
      nombres: '',
      telefono: '',
      cargo: cargoCoordinadora,
      puntoVenta: puntoVentaCoordinadora,
      nombreLider: nombreLider
    });

    setMostrarModal(false);
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!empleado) {
      return message.error(
        'Por favor busque un empleado válido'
      );
    }

    if (!categoria) {
      return message.error(
        'Seleccione una categoría'
      );
    }

    if (!cargoEvaluar) {
      return message.error(
        'Seleccione un cargo'
      );
    }

    setMostrarModal(true);
  };

  const confirmarGuardado = async () => {

    setMostrarModal(false);

    try {

      const dataToSend = {
        data: {
          Nombre: formData.nombres,
          documento: documento.toString(),
          telefono: formData.telefono,
          pdv: formData.puntoVenta,
          lider: instructora,
          foto: formData.foto || '',
          cargo: cargoEvaluar,
          cargo_empleado: formData.cargo,
          fecha: new Date()
            .toISOString()
            .split('T')[0],
          categoria: categoria.toUpperCase()
        }
      };

      console.log('DATA A GUARDAR:', dataToSend);

      const response = await axios.post(
        'https://macfer.crepesywaffles.com/api/cap-toderas',
        dataToSend
      );

      console.log('RESPUESTA GUARDADO:', response);

      message.success(
        '✓ Evaluación registrada con éxito'
      );

      limpiarFormulario();

      if (onSubmit) {
        onSubmit({
          success: true,
          data: response.data
        });
      }

    } catch (error) {

      console.error('ERROR GUARDANDO:', error);

      message.error(
        'Error al registrar evaluación'
      );
    }
  };

  return (
    <div className="evaluacion-todera-container">

      <div className="evaluacion-todera-header">
        <h1 className="evaluacion-todera-title">
          EVALUACIÓN TODERAS
        </h1>

        <p className="evaluacion-todera-subtitle">
          Registrá la evaluación cuando la persona esté lista
        </p>
      </div>

      <div className="form-container-et">

        <button
          className="back-button-et"
          onClick={onBack}
        >
          Volver
        </button>

        <form
          className="evaluacion-form-et"
          onSubmit={handleSubmit}
        >

          <BuscarEmpleado
            documento={documento}
            setDocumento={(v) =>
              setDocumento(v.replace(/\D/g, ''))
            }
            onBuscar={() => buscarEmpleado()}
            loading={loading}
          />

          {mensaje.texto && (
            <div className={`mensaje-et ${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}

          {empleado && (
            <>

              {formData.foto && (
                <div className="employee-card-et">

                  <div className="employee-photo-et">
                    <img
                      src={formData.foto}
                      alt="Foto empleado"
                    />
                  </div>

                  <div className="employee-info-et">
                    <h3>{formData.nombres}</h3>

                    <p>
                      <i className="bi bi-telephone-fill"></i>
                      {formData.telefono}
                    </p>

                    <p>
                      <i className="bi bi-person-badge-fill"></i>
                      {formData.cargo}
                    </p>

                    <p>
                      <i className="bi bi-shop"></i>
                      {formData.puntoVenta}
                    </p>
                  </div>

                </div>
              )}

              <div className="form-section-et">

                <label className="form-label-et">
                  CATEGORÍA A EVALUAR *
                </label>

                <select
                  className="form-select-et"
                  value={categoria}
                  onChange={(e) => {

                    const value = e.target.value;

                    console.log('CATEGORIA SELECCIONADA:', value);

                    setCategoria(value);

                    buscarInstructora(value);
                  }}
                  required
                >
                  <option value="">
                    Seleccione la categoría
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

              <div className="form-section-et">

                <label className="form-label-et">
                  CARGO A EVALUAR *
                </label>

                <Select
                  className="form-select-et"
                  popupClassName="cargo-evaluar-dropdown"
                  value={cargoEvaluar}
                  onChange={(v) => setCargoEvaluar(v)}
                  placeholder="Seleccione un cargo"
                  options={opcionesCargoEvaluar}
                  showSearch
                  optionFilterProp="label"
                />

              </div>

              {categoria && (

                <div className="form-section-et">

                  <label className="form-label-et">
                    NOMBRE DE LA INSTRUCTORA
                  </label>

                  <input
                    className="form-input-et"
                    value={
                      loadingInstructora
                        ? 'Buscando instructora...'
                        : instructora || 'Sin asignar'
                    }
                    readOnly
                    disabled
                  />

                </div>
              )}

              <div className="form-actions-et">

                <button
                  type="button"
                  className="cancel-button-et"
                  onClick={limpiarFormulario}
                >
                  Limpiar
                </button>

                <button
                  type="submit"
                  className="submit-button-et"
                >
                  Registrar Evaluación
                </button>

              </div>

            </>
          )}

        </form>
      </div>

      {mostrarModal && (

        <div className="modal-overlay-confirmacion">

          <div className="modal-confirmacion">

            <div className="modal-confirmacion-header">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <h2>ADVERTENCIA</h2>
            </div>

            <div className="modal-confirmacion-body">
              <p>
                LA PERSONA INSCRITA DEBE ASISTIR
                OBLIGATORIAMENTE
              </p>
            </div>

            <div className="modal-confirmacion-footer">

              <button
                className="btn-modal-cancelar"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>

              <button
                className="btn-modal-guardar"
                onClick={confirmarGuardado}
              >
                Agregar
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default FormTodera;