import { useEffect, useState } from "react";
import {
  obtenerMeses,
  generarFechasDisponibles,
} from "../utils/fechasHel.utils";

export const useFechas = () => {
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    const cargarFechas = () => {
      const meses = obtenerMeses();

      let result = [];

      meses.forEach(({ year, month }) => {
        result = [
          ...result,
          ...generarFechasDisponibles(year, month),
        ];
      });

      setFechas(result);
    };

    cargarFechas();
  }, []);

  return { fechas };
};