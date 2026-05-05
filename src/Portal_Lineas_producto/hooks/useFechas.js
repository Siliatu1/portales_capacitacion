import { useEffect, useState } from "react";
import {
  obtenerMesesAMostrar,
  fetchFestivosColombia,
  obtenerFechasPorDias,
} from "../utils/fechasHel.utils";
import { getInscripciones } from "../services/inscripciones.service";

export const useFechas = (diasPermitidos = [1, 5]) => {
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    const cargarFechas = async () => {
      try {
        const meses = obtenerMesesAMostrar();

        // cargar inscripciones y generar un mapa por fecha
        let inscripciones = [];
        try {
          inscripciones = await getInscripciones();
        } catch (err) {
          console.warn('No se pudo cargar inscripciones', err);
          inscripciones = [];
        }

        const inscripcionesPorFecha = {};
        inscripciones.forEach((item) => {
          const f = item.dia || item.fecha || item;
          if (!f) return;
          inscripcionesPorFecha[f] = (inscripcionesPorFecha[f] || 0) + 1;
        });

        // fechas bloqueadas manualmente (puede estar en localStorage como array de YYYY-MM-DD)
        let fechasBloqueadas = [];
        try {
          const raw = localStorage.getItem('fechasBloqueadas');
          if (raw) fechasBloqueadas = JSON.parse(raw);
        } catch (err) {
          fechasBloqueadas = [];
        }

        // obtener festivos por año (evitamos llamadas repetidas)
        const años = Array.from(new Set(meses.map(m => m.year)));
        const festivosPorAño = {};
        await Promise.all(años.map(async (y) => {
          festivosPorAño[y] = await fetchFestivosColombia(y);
        }));

        let result = [];

        meses.forEach(({ year, month }) => {
          const festivos = festivosPorAño[year] || [];
          const fechasMes = obtenerFechasPorDias(year, month, diasPermitidos, festivos, fechasBloqueadas, inscripcionesPorFecha);
          result = [...result, ...fechasMes];
        });

        setFechas(result);
      } catch (err) {
        console.error('Error al construir fechas', err);
        setFechas([]);
      }
    };

    cargarFechas();
  }, []);

  return { fechas };
};