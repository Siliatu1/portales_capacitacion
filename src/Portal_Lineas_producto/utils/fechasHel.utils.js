export const obtenerMeses = () => {
  const hoy = new Date();
  const dia = hoy.getDate();
  const mes = hoy.getMonth();
  const year = hoy.getFullYear();

  if (dia >= 15) {
    return [
      { year, month: mes },
      { year, month: mes + 1 > 11 ? 0 : mes + 1 },
    ];
  }

  return [{ year, month: mes }];
};

export const generarFechasDisponibles = (year, month) => {
  const fechas = [];
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= lastDay; i++) {
    const d = new Date(year, month, i);

    if ([2, 3, 4].includes(d.getDay())) {
      fechas.push({
        fecha: d.toISOString().split("T")[0],
        dia: i,
      });
    }
  }

  return fechas;
};