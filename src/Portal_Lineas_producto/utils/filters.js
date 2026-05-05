export const filtrarInscripciones = (data, filtros) => {
  return data.filter(item => {
    return (
      (!filtros.cedula || item.cedula?.includes(filtros.cedula)) &&
      (!filtros.puntoVenta || (item.area_nombre || item.puntoVenta || '').toLowerCase().includes(filtros.puntoVenta.toLowerCase())) &&
      (!filtros.fecha || item.dia === filtros.fecha) &&
      (!filtros.lider || item.lider?.toLowerCase().includes(filtros.lider.toLowerCase())) &&
      (!filtros.formulario || filtros.formulario === 'todos' || (item.tipo_formulario || '').toLowerCase() === filtros.formulario.toLowerCase())
    );
  });
};