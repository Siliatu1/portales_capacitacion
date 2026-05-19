/**
 * Determina qué meses deben mostrarse para la inscripción
 * Lógica: Del 1-14 del mes se muestra solo el mes actual
 *         Del 15 en adelante se muestra el mes actual y el siguiente
 * @returns Array de objetos {year, month} con los meses a mostrar
 */
export const obtenerMesesAMostrar = () => {
  const hoy = new Date();
  const diaActual = hoy.getDate();
  const mesActual = hoy.getMonth();
  const yearActual = hoy.getFullYear();
  const ultimoDiaMesActual = new Date(yearActual, mesActual + 1, 0).getDate();

  const meses = [];
  
  if (diaActual >= 15) {
    meses.push({
      year: yearActual,
      month: mesActual,
      diaInicio: 15,
      diaFin: ultimoDiaMesActual,
    });
    
    if (mesActual === 11) {
      meses.push({
        year: yearActual + 1,
        month: 0,
        diaInicio: 1,
        diaFin: new Date(yearActual + 1, 1, 0).getDate(),
      });
    } else {
      meses.push({
        year: yearActual,
        month: mesActual + 1,
        diaInicio: 1,
        diaFin: new Date(yearActual, mesActual + 2, 0).getDate(),
      });
    }
  } else {
    meses.push({
      year: yearActual,
      month: mesActual,
      diaInicio: 1,
      diaFin: ultimoDiaMesActual,
    });
  }

  return meses;
};

/**
 * Obtiene la lista de festivos colombianos para un año
 * @param {number} year
 * @returns Promise<string[]> array de fechas en formato YYYY-MM-DD
 */
export const fetchFestivosColombia = async (year) => {
  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/CO`);
    if (!res.ok) return [];

    const json = await res.json();
    return json.map((h) => h.date);
  } catch (err) {
    console.error('Error fetch festivos', err);
    return [];
  }
};

/**
 * Obtiene todos los lunes y viernes de un mes específico
 * Verifica disponibilidad: máximo 3 inscripciones por fecha
 * Excluye: festivos colombianos y fechas bloqueadas manualmente
 * @param {number} year - Año
 * @param {number} month - Mes (0-11)
 * @param {string[]} festivosColombianos - fechas YYYY-MM-DD
 * @param {string[]} fechasBloqueadas - fechas YYYY-MM-DD
 * @param {Object} inscripcionesPorFecha - map { 'YYYY-MM-DD': number }
 * @returns Array de objetos con información de cada fecha disponible
 */
export const obtenerFechasPorDias = (
  year,
  month,
  diasPermitidos = [1,5],
  festivosColombianos = [],
  fechasBloqueadas = [],
  inscripcionesPorFecha = {},
  rangoDias = {}
) => {
  const fechas = [];
  const ultimoDia = new Date(year, month + 1, 0).getDate();
  const diaInicio = Math.max(1, rangoDias.diaInicio || 1);
  const diaFin = Math.min(ultimoDia, rangoDias.diaFin || ultimoDia);
  
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  
  for (let dia = diaInicio; dia <= diaFin; dia++) {
    const fecha = new Date(year, month, dia);
    const diaSemana = fecha.getDay();
    
    if (diasPermitidos.includes(diaSemana)) {
      const fechaStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      
      const esFestivo = festivosColombianos.includes(fechaStr);
      const estaBloqueada = fechasBloqueadas.includes(fechaStr);
      const numInscripciones = inscripcionesPorFecha[fechaStr] || 0;
      const disponible = numInscripciones < 3 && !esFestivo && !estaBloqueada;
      const estado = disponible ? 'disponible' : estaBloqueada ? 'bloqueada' : 'completo';
      
      fechas.push({
        fecha: fechaStr,
        dia,
        mes: meses[month],
        texto: `${diasSemana[diaSemana]} ${dia} de ${meses[month]}`,
        disponible,
        inscripciones: numInscripciones,
        esFestivo,
        estaBloqueada,
        estado
      });
    }
  }
  
  return fechas;
};

// wrapper for backward compatibility
export const obtenerLunesYViernes = (...args) => obtenerFechasPorDias(...args);
