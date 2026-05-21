import { useMemo, useState } from "react";

import {
  getFechasSemana,
} from "../utils/fechas";

export const useSemana = () => {
  /* =========================
     STATE
  ========================= */

  const [semanaOffset,
    setSemanaOffset] =
    useState(0);

  /* =========================
     FECHAS
  ========================= */

  const fechasSemana =
    useMemo(() => {
      return getFechasSemana(
        semanaOffset
      );
    }, [semanaOffset]);

  /* =========================
     ACTIONS
  ========================= */

  const nextWeek = () => {
    setSemanaOffset(
      (prev) => prev + 1
    );
  };

  const prevWeek = () => {
    setSemanaOffset(
      (prev) => prev - 1
    );
  };

  const resetWeek = () => {
    setSemanaOffset(0);
  };

  return {
    semanaOffset,

    fechasSemana,

    nextWeek,

    prevWeek,

    resetWeek,
  };
};