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

      // llenar campos en el formulario con mapeo defensivo
      setFormData((prev) => ({
        ...prev,
        telefono: emp.telefono || emp.mobile || emp.celular || "",
        area_nombre: prev.area_nombre || emp.area_nombre || emp.pdv || emp.puntoVenta || emp.pdv_nombre || "",
      }));

      return;
    }

    try {
      setLoading(true);

      const data = await getEmpleado(documento);

      const raw = data?.data || [];

      // intentar encontrar por distintos campos de documento
      const empRaw = raw.find(
        (e) => String(e.document_number || e.documento || e.document || e.documento_identidad) === String(documento)
      ) || raw[0];

      // mapear a un objeto consistente (soporta Strapi-style attributes)
      const src = empRaw ? (empRaw.attributes || empRaw) : null;

      // helpers to check multiple key variants (case-sensitive and common alternatives)
      const pick = (o, ...keys) => {
        if (!o) return undefined;
        for (const k of keys) {
          if (typeof o[k] !== 'undefined' && o[k] !== null) return o[k];
        }
        return undefined;
      };

      const emp = src
        ? {
            id: empRaw.id || src.id || src.id_persona || null,
            nombre: pick(src, 'nombre', 'fullName', 'nombres', 'name', 'nombre_completo') || '',
            telefono: pick(src, 'telefono', 'Telefono', 'phone', 'mobile') || '',
            celular: pick(src, 'celular', 'Celular', 'telefono', 'Telefono', 'mobile', 'phone') || '',
            cargo_general: pick(src, 'cargo', 'position', 'cargo_general') || '',
            pdv: pick(src, 'pdv', 'puntoVenta', 'punto_venta', 'pdv_nombre') || '',
            area_nombre: pick(src, 'area_nombre', 'area', 'areaName', 'areaName', 'pdv', 'puntoVenta', 'pdv_nombre') || '',
            photo: pick(src, 'photo', 'foto', 'avatar') || (src.avatar && src.avatar.url) || '',
            lider: pick(src, 'lider', 'lider_nombre') || '',
            raw: empRaw,
          }
        : null;

      setEmpleado(emp || null);

      if (emp) {
        cache[documento] = emp;

        setFormData((prev) => ({
          ...prev,
          telefono: emp.telefono || emp.celular || "",
          area_nombre: prev.area_nombre || emp.area_nombre || emp.pdv || "",
        }));
      }
    } catch {
      setEmpleado(null);
    } finally {
      setLoading(false);
    }
  };

  const clearEmpleado = () => {
    setEmpleado(null);
  };

  return {
    empleado,
    buscarEmpleado,
    loading,
    clearEmpleado,
  };
};