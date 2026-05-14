export const formatearFecha = (fecha) => {
  if (!fecha) return "";

  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic"
  ];

  return `${fecha.getDate()} ${meses[fecha.getMonth()]}`;
};

export const formatearFechaCompleta = (fecha) => {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  return `${fecha.getDate()} de ${
    meses[fecha.getMonth()]
  } de ${fecha.getFullYear()}`;
};

export const formatearRangoFechas = (
  fechaInicio,
  fechaFin
) => {
  return `${formatearFecha(fechaInicio)} - ${formatearFecha(
    fechaFin
  )}`;
};

export const calcularSemana = () => {
  const hoy = new Date();

  const proximoLunes = new Date(hoy);

  const diaSemana = hoy.getDay();

  let diasHastaProximoLunes;

  if (diaSemana === 0) {
    diasHastaProximoLunes = 1;
  } else if (diaSemana === 1) {
    diasHastaProximoLunes = 7;
  } else {
    diasHastaProximoLunes = 8 - diaSemana;
  }

  proximoLunes.setDate(
    hoy.getDate() + diasHastaProximoLunes
  );

  const proximoDomingo = new Date(proximoLunes);

  proximoDomingo.setDate(
    proximoLunes.getDate() + 6
  );

  return {
    fechaInicio: proximoLunes,
    fechaFin: proximoDomingo
  };
};

export const getInitials = (name) => {
  if (!name) return "U";

  const names = name.split(" ");

  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }

  return name[0].toUpperCase();
};