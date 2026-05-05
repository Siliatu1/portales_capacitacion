export const buildInscripcionPayload = (formData, empleado) => {
  // Construir atributos compatibles con la API (Strapi-like)
  return {
    nombre: empleado?.nombre || formData.nombre || formData.nombres || "",
    documento: formData.documento,
    telefono: formData.telefono || formData.celular || empleado?.celular || empleado?.telefono || "",
    cargo: empleado?.cargo_general || empleado?.raw?.cargo || formData.cargo || "",
    pdv: formData.area_nombre || formData.puntoVenta || empleado?.area_nombre || empleado?.pdv || "",
    fecha: formData.fecha || null,
    lider: empleado?.lider || formData.nombreLider || "",
    empleadoId: empleado?.id || empleado?.raw?.id || null,
  };
};
