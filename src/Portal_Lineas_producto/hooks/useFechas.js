import { useCallback, useEffect, useMemo, useState } from "react";
import {
  obtenerMesesAMostrar,
  fetchFestivosColombia,
  obtenerFechasPorDias,
} from "../utils/fechasHel.utils";
import { getInscripciones } from "../services/inscripciones.service";

const FECHAS_BLOQUEADAS_KEY = "fechasBloqueadas";
const FECHAS_BLOQUEADAS_EVENT = "fechasBloqueadasChanged";

const leerFechasBloqueadas = () => {
  try {
    const raw = localStorage.getItem(FECHAS_BLOQUEADAS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
};

const guardarFechasBloqueadas = (fechas) => {
  localStorage.setItem(FECHAS_BLOQUEADAS_KEY, JSON.stringify(fechas));
  window.dispatchEvent(new Event(FECHAS_BLOQUEADAS_EVENT));
};

export const useFechas = (diasPermitidos = [1, 5]) => {
  const [fechas, setFechas] = useState([]);
  const [fechasBloqueadas, setFechasBloqueadas] = useState(leerFechasBloqueadas);
  const diasPermitidosKey = diasPermitidos.join(",");
  const diasPermitidosNormalizados = useMemo(
    () => diasPermitidosKey.split(",").filter(Boolean).map(Number),
    [diasPermitidosKey]
  );

  const setFechaBloqueada = useCallback((fecha, bloquear) => {
    const fechasSet = new Set(leerFechasBloqueadas());

    if (bloquear) {
      fechasSet.add(fecha);
    } else {
      fechasSet.delete(fecha);
    }

    const next = Array.from(fechasSet).sort();
    guardarFechasBloqueadas(next);
    setFechasBloqueadas(next);
  }, []);

  const toggleFechaBloqueada = useCallback((fecha) => {
    const fechasSet = new Set(leerFechasBloqueadas());

    if (fechasSet.has(fecha)) {
      fechasSet.delete(fecha);
    } else {
      fechasSet.add(fecha);
    }

    const next = Array.from(fechasSet).sort();
    guardarFechasBloqueadas(next);
    setFechasBloqueadas(next);
  }, []);

  useEffect(() => {
    const syncFechasBloqueadas = () => {
      setFechasBloqueadas(leerFechasBloqueadas());
    };

    window.addEventListener("storage", syncFechasBloqueadas);
    window.addEventListener(FECHAS_BLOQUEADAS_EVENT, syncFechasBloqueadas);

    return () => {
      window.removeEventListener("storage", syncFechasBloqueadas);
      window.removeEventListener(FECHAS_BLOQUEADAS_EVENT, syncFechasBloqueadas);
    };
  }, []);

  useEffect(() => {
    const cargarFechas = async () => {
      try {
        const meses = obtenerMesesAMostrar();

        let inscripciones = [];
        try {
          inscripciones = await getInscripciones();
        } catch (err) {
          console.warn("No se pudo cargar inscripciones", err);
          inscripciones = [];
        }

        const inscripcionesPorFecha = {};
        inscripciones.forEach((item) => {
          const f = item.dia || item.fecha || item;
          if (!f) return;
          inscripcionesPorFecha[f] = (inscripcionesPorFecha[f] || 0) + 1;
        });

        const years = Array.from(new Set(meses.map((m) => m.year)));
        const festivosPorYear = {};
        await Promise.all(years.map(async (y) => {
          festivosPorYear[y] = await fetchFestivosColombia(y);
        }));

        let result = [];

        meses.forEach(({ year, month }) => {
          const festivos = festivosPorYear[year] || [];
          const fechasMes = obtenerFechasPorDias(
            year,
            month,
            diasPermitidosNormalizados,
            festivos,
            fechasBloqueadas,
            inscripcionesPorFecha
          );
          result = [...result, ...fechasMes];
        });

        setFechas(result);
      } catch (err) {
        console.error("Error al construir fechas", err);
        setFechas([]);
      }
    };

    cargarFechas();
  }, [diasPermitidosNormalizados, fechasBloqueadas]);

  return { fechas, fechasBloqueadas, setFechaBloqueada, toggleFechaBloqueada };
};
