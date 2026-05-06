export const mapAsistencia = (value) => {
  if (value === true) return { label: 'Asistió', color: 'green' };
  if (value === false) return { label: 'No asistió', color: 'red' };
  return { label: 'Pendiente', color: 'gold' };
};

export const asistenciaLabel = (value) => mapAsistencia(value).label;

export const asistenciaColor = (value) => mapAsistencia(value).color;
