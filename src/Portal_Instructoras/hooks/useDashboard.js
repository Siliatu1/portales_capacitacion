import { useMemo } from "react";

import {
  calcularHorasSemana,
} from "../utils/fechas";

export const useDashboard = ({
  horarios = [],
  programacionSemanal = {},
}) => {
  /* =========================
     TOTAL EVENTOS
  ========================= */

  const totalEventos =
    useMemo(() => {
      return horarios.length;
    }, [horarios]);

  /* =========================
     TOTAL HORAS
  ========================= */

  const totalHoras =
    useMemo(() => {
      return calcularHorasSemana(
        programacionSemanal
      );
    }, [programacionSemanal]);

  /* =========================
     TOTAL PDVS
  ========================= */

  const totalPDVS =
    useMemo(() => {
      const unique =
        new Set();

      horarios.forEach((item) => {
        const pdv =
          item.attributes
            ?.pdv_nombre;

        if (pdv) {
          unique.add(pdv);
        }
      });

      return unique.size;
    }, [horarios]);

  /* =========================
     ACTIVIDAD MÁS USADA
  ========================= */

  const actividadTop =
    useMemo(() => {
      const counter = {};

      horarios.forEach((item) => {
        const actividad =
          item.attributes
            ?.actividad;

        if (!actividad) {
          return;
        }

        counter[actividad] =
          (counter[
            actividad
          ] || 0) + 1;
      });

      let max = 0;

      let actividadMax =
        "Sin datos";

      Object.entries(
        counter
      ).forEach(
        ([key, value]) => {
          if (value > max) {
            max = value;

            actividadMax =
              key;
          }
        }
      );

      return actividadMax;
    }, [horarios]);

  return {
    totalEventos,

    totalHoras,

    totalPDVS,

    actividadTop,
  };
};