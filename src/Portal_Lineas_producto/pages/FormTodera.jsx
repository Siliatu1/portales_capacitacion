import React, { useState, useEffect } from 'react';
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

const FormTodera = ({ onBack, onSubmit, coordinadoraData }) => {
  const cargoCoordinadora = coordinadoraData?.data?.cargo_general || coordinadoraData?.data?.position || '';
  const puntoVentaCoordinadora = coordinadoraData?.data?.area_nombre || '';

  const nombreLider = coordinadoraData?.data?.nombre ||
    coordinadoraData?.data?.name ||
    (coordinadoraData?.data?.first_name && coordinadoraData?.data?.last_name
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
  const [instructora, setInstructora] = useState(null);
  const [loadingInstructora, setLoadingInstructora] = useState(false);

  useEffect(() => {
    if (empleado) {
      setFormData({
        foto: empleado.foto || '',
        nombres: empleado.nombre || '',
        telefono: empleado.Celular || '',
        cargo: empleado.cargo || cargoCoordinadora,
        puntoVenta: empleado.area_nombre || puntoVentaCoordinadora,
        nombreLider: nombreLider
      });
    }
  }, [empleado]);

  useEffect(() => {
    if (documento.trim().length >= 6 && !empleado) {
      const t = setTimeout(() => buscarEmpleado(documento), 800);
      return () => clearTimeout(t);
    }
  }, [documento]);

  const buscarInstructora = async (categoriaSeleccionada) => {
   
    if (!puntoVentaCoordinadora || !categoriaSeleccionada) return;
  

    setLoadingInstructora(true);
    try {
      const pdvEncoded = encodeURIComponent(puntoVentaCoordinadora);
      const url = `https://macfer.crepesywaffles.com/api/cap-pdvs?filters[cap_instructoras][${categoriaSeleccionada}][$eq]=true&filters[nombre][$eq]=${pdvEncoded}&populate[cap_instructoras][filters][${categoriaSeleccionada}][$eq]=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al buscar instructora');
      const data = await res.json();
      if (data?.data && data.data.length > 0) {
        const pdvData = data.data[0];
        const instructoras = pdvData.attributes?.cap_instructoras?.data;
        if (instructoras && instructoras.length > 0) {
          const instr = instructoras[0];
          const nombreInstructora = instr.attributes?.Nombre || '';
          setInstructora(nombreInstructora);
          setFormData(prev => ({ ...prev, nombreLider: nombreInstructora }));
          message.success(`Instructora asignada: ${nombreInstructora}`);
          return;
        }
      }
      message.warning('No se encontró instructora para este punto de venta');
      setInstructora(null);
    } catch (err) {
      message.error('Error al buscar la instructora');
      setInstructora(null);
    } finally {
      setLoadingInstructora(false);
    }
  };

  useEffect(() => {
    if (categoria && empleado) buscarInstructora(categoria);
  }, [categoria]);

  const limpiarFormulario = () => {
    limpiarEmpleado();
    setCategoria('');
    setCargoEvaluar('');
    setInstructora(null);
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
    if (!empleado) return message.error('Por favor busque un empleado válido');
    if (!categoria) return message.error('Por favor seleccione una categoría');
    if (!cargoEvaluar) return message.error('Por favor seleccione el cargo a evaluar');
    if (!instructora) message.warning('No se encontró instructora asignada automáticamente');
    setMostrarModal(true);
  };

  const confirmarGuardado = async () => {
    setMostrarModal(false);
    const categoriaEnMayusculas = categoria ? categoria.toUpperCase() : '';
    let telefonoFinal = '';
    if (formData.telefono) telefonoFinal = String(formData.telefono).replace(/\D/g, '');

    const dataToSend = {
      data: {
        Nombre: formData.nombres,
        documento: documento.toString(),
        telefono: telefonoFinal,
        pdv: formData.puntoVenta,
        lider: instructora || formData.nombreLider || '',
        foto: formData.foto || '',
        cargo: cargoEvaluar,
        cargo_empleado: formData.cargo,
        cargo_evaluar: cargoEvaluar,
        cargoEvaluar: cargoEvaluar,
        fecha: new Date().toISOString().split('T')[0],
        categoria: categoriaEnMayusculas
      }
    };

    try {
      const response = await axios.post('https://macfer.crepesywaffles.com/api/cap-toderas', dataToSend);
      message.success('✓ Evaluación registrada con éxito');
      limpiarFormulario();
      if (onSubmit) onSubmit({ success: true, data: response.data });
    } catch (error) {
      if (error.response) {
        const err = error.response.data;
        if (err?.error?.message) message.error(`Error: ${err.error.message}`);
        else if (err?.error?.details) message.error(`Error en validación: ${JSON.stringify(err.error.details)}`);
        else message.error(`Error ${error.response.status}: ${JSON.stringify(err)}`);
      } else if (error.request) message.error('No se recibió respuesta del servidor');
      else message.error('Error al configurar la petición');
    }
  };

  return (
    <div className="evaluacion-todera-container">
      <div className="evaluacion-todera-header">
        <h1 className="evaluacion-todera-title">EVALUACIÓN TODERAS</h1>
        <p className="evaluacion-todera-subtitle">Registrá la evaluación cuando la persona esté 100% lista</p>
      </div>

      <div className="alerta-evaluacion">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <span>SOLO SE PUEDE INSCRIBIR SI YA ESTÁ 100% LISTA PARA LA EVALUACIÓN</span>
      </div>

      <div className="form-container-et">
        <button className="back-button-et" onClick={onBack}>Volver</button>
        <form className="evaluacion-form-et" onSubmit={handleSubmit}>
          <BuscarEmpleado documento={documento} setDocumento={(v) => setDocumento(v.replace(/\D/g, ''))} onBuscar={() => buscarEmpleado()} loading={loading} />
          {mensaje.texto && <div className={`mensaje-et ${mensaje.tipo}`}>{mensaje.texto}</div>}

          {empleado && (
            <>
              {formData.foto && (
                <div className="employee-card-et">
                  <div className="employee-photo-et"><img src={formData.foto} alt="Foto empleado"/></div>
                  <div className="employee-info-et">
                    <h3>{formData.nombres}</h3>
                    <p><i className="bi bi-telephone-fill"></i> {formData.telefono}</p>
                    <p><i className="bi bi-person-badge-fill"></i> {formData.cargo}</p>
                    <p><i className="bi bi-shop"></i> {formData.puntoVenta}</p>
                  </div>
                </div>
              )}

              <div className="form-section-et">
                <label className="form-label-et">CATEGORÍA A EVALUAR *</label>
                <select className="form-select-et" value={categoria} onChange={(e) => buscarInstructora(e.target.value)} required>
                  <option value="">Seleccione la categoría</option>
                  <option value="sal">Sal</option>
                  <option value="dulce">Dulce</option>
                  <option value="bebidas">Bebidas</option>
                </select>
              </div>

              <div className="form-section-et">
                <label className="form-label-et">CARGO A EVALUAR *</label>
                <Select className="form-select-et" popupClassName="cargo-evaluar-dropdown" value={cargoEvaluar} onChange={(v) => setCargoEvaluar(v)} placeholder="Seleccione un cargo" options={opcionesCargoEvaluar} showSearch optionFilterProp="label"/>
              </div>

              {categoria && (
                <div className="form-section-et">
                  <label className="form-label-et">NOMBRE DE LA INSTRUCTORA {loadingInstructora && <i className="bi bi-hourglass-split" style={{marginLeft:8}}></i>}</label>
                  <input className="form-input-et" value={loadingInstructora ? 'Buscando instructora...' : (instructora || 'Sin asignar')} readOnly disabled style={{backgroundColor:'#f0f0f0', cursor:'not-allowed'}}/>
                </div>
              )}

              <div className="form-actions-et">
                <button type="button" className="cancel-button-et" onClick={limpiarFormulario} disabled={loading}>Limpiar</button>
                <button type="submit" className="submit-button-et" disabled={loading}>{loading ? 'Guardando...' : 'Registrar Evaluación'}</button>
              </div>
            </>
          )}
        </form>
      </div>

      {mostrarModal && (
        <div className="modal-overlay-confirmacion">
          <div className="modal-confirmacion">
            <div className="modal-confirmacion-header"><i className="bi bi-exclamation-triangle-fill"></i><h2>ADVERTENCIA</h2></div>
            <div className="modal-confirmacion-body"><p>LA PERSONA INSCRITA DEBE ASISTIR OBLIGATORIAMENTE</p></div>
            <div className="modal-confirmacion-footer">
              <button className="btn-modal-cancelar" onClick={limpiarFormulario}>Cancelar</button>
              <button className="btn-modal-guardar" onClick={confirmarGuardado}>Agregar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormTodera;
