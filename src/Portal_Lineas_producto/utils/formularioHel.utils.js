export const formatearFecha = (year, month, dia) => {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
};

export const esDisponible = ({ inscripciones, esFestivo, bloqueada }) => {
  return inscripciones < 3 && !esFestivo && !bloqueada;
};

/**
 * Estado inicial del formulario de inscripción (centralizado)
 */
export const getInitialFormState = () => ({
  documento: "",
  telefono: "",
  fecha: "",
  puntoVenta: "",
  area_nombre: "",
  nombres: "",
  nombreLider: "",
});

/**
 * Construye los atributos que se enviarán a la API para la inscripción
 * @param {Object} formData
 * @param {Object} empleado
 * @returns {Object} attributes
 */
export const buildInscripcionAttributes = (formData, empleado) => {
  return {
    documento: formData.documento || empleado?.raw?.document_number || '',
    nombre: formData.nombres || empleado?.nombre || '',
    telefono: formData.telefono || formData.celular || empleado?.celular || empleado?.telefono || '',
    cargo: empleado?.cargo_general || formData.cargo || '',
    pdv: formData.area_nombre || formData.puntoVenta || empleado?.area_nombre || empleado?.pdv || '',
    fecha: formData.fecha || null,
    lider:
      formData.lider ||
      empleado?.lider ||
      (() => {
        try {
          const u = JSON.parse(localStorage.getItem('user'));
          return u?.nombre || '';
        } catch (e) {
          return '';
        }
      })() ||
      formData.nombreLider || '',
    tipo_formulario: 'heladeria',
  };
};