import { useEffect, useState } from "react";
import { obtenerInstructora } from "../services/instructoraService";

export const useInstructora = ({
  categoria,
  empleado,
  puntoVenta
}) => {

  const [instructora, setInstructora] = useState("");
  const [loadingInstructora, setLoadingInstructora] = useState(false);

  useEffect(() => {

    if (!categoria || !empleado) return;

    const fetchInstructora = async () => {

      try {

        setLoadingInstructora(true);

        const data = await obtenerInstructora(
          puntoVenta,
          categoria
        );

        setInstructora(data || "");

      } catch (error) {

        console.log("ERROR INSTRUCTORA", error);
        setInstructora("");

      } finally {

        setLoadingInstructora(false);

      }
    };

    fetchInstructora();

  }, [categoria, empleado, puntoVenta]);

  return {
    instructora,
    loadingInstructora
  };
};