export const diasSemana = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export const diasSemanaLabel = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

/* =========================
   GET SEMANA
========================= */

export const getFechasSemana = (
  semanaOffset = 0
) => {
  const hoy = new Date();

  const diaActual =
    hoy.getDay();

  const lunes =
    new Date(hoy);

  let diferencia = 0;

  if (diaActual === 0) {
    diferencia = -6;
  } else {
    diferencia =
      1 - diaActual;
  }

  lunes.setDate(
    hoy.getDate() +
      diferencia +
      semanaOffset * 7
  );

  const fechas = [];

  for (let i = 0; i < 7; i++) {
    const fecha =
      new Date(lunes);

    fecha.setDate(
      lunes.getDate() + i
    );

    fechas.push(fecha);
  }

  return fechas;
};

/* =========================
   FORMAT API
========================= */

export const formatFechaAPI = (
  fecha
) => {
  const year =
    fecha.getFullYear();

  const month = String(
    fecha.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    fecha.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* =========================
   FORMAT UI
========================= */

export const formatearFecha = (
  fecha
) => {
  return fecha.toLocaleDateString(
    "es-CO",
    {
      day: "numeric",
      month: "short",
    }
  );
};

/* =========================
   HORAS
========================= */

export const calcularHoras =
  (
    horaInicio,
    horaFin
  ) => {
    if (
      !horaInicio ||
      !horaFin
    ) {
      return 0;
    }

    const [
      horaIni,
      minIni,
    ] = horaInicio
      .split(":")
      .map(Number);

    const [
      horaFinNum,
      minFin,
    ] = horaFin
      .split(":")
      .map(Number);

    const inicio =
      horaIni * 60 +
      minIni;

    const fin =
      horaFinNum * 60 +
      minFin;

    return (
      (fin - inicio) /
      60
    );
  };

/* =========================
   HORAS DÍA
========================= */

export const calcularHorasDia =
  (eventos = []) => {
    return eventos.reduce(
      (
        total,
        evento
      ) => {
        return (
          total +
          calcularHoras(
            evento.horaInicio,
            evento.horaFin
          )
        );
      },
      0
    );
  };

/* =========================
   HORAS SEMANA
========================= */

export const calcularHorasSemana =
  (
    programacionSemanal
  ) => {
    return diasSemana.reduce(
      (
        total,
        dia
      ) => {
        return (
          total +
          calcularHorasDia(
            programacionSemanal[
              dia
            ]
          )
        );
      },
      0
    );
  };