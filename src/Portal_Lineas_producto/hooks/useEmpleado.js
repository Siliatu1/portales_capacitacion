import { useState } from "react";
import { getEmpleado } from "../services/empleado.service";

const cache = {};

export const useEmpleado = (setFormData) => {
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscarEmpleado = async (documento) => {
    if (!documento) return;

    if (cache[documento]) {
      const emp = cache[documento];
      setEmpleado(emp);

      // 🔥 aquí llenamos el teléfono editable
      setFormData((prev) => ({
        ...prev,
        telefono: emp.telefono || "",
      }));

      return;
    }

    try {
      setLoading(true);

      const data = await getEmpleado(documento);

      const emp = data?.data?.find(
        (e) => String(e.document_number) === documento
      );

      setEmpleado(emp || null);

      if (emp) {
        cache[documento] = emp;

        setFormData((prev) => ({
          ...prev,
          telefono: emp.telefono || "",
        }));
      }
    } catch {
      setEmpleado(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    empleado,
    buscarEmpleado,
    loading,
  };
};