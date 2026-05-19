import { useState } from 'react';
import { getEmpleado } from '../services/empleado.service';

const empleadosCache = {};

export default function useEmpleado() {
  const [documento, setDocumento] = useState('');
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const limpiarEmpleado = () => {
    setDocumento('');
    setEmpleado(null);
    setMensaje({ texto: '', tipo: '' });
    setLoading(false);
  };

  const buscarEmpleado = async (docBusqueda = documento) => {
    const docTrim = String(docBusqueda || '').trim();

    if (!docTrim) {
      setMensaje({ texto: 'Por favor ingrese un documento', tipo: 'error' });
      return null;
    }

    if (empleadosCache[docTrim]) {
      const empleadoData = empleadosCache[docTrim];
      setEmpleado(empleadoData);
      setMensaje({ texto: '✓ Empleado encontrado', tipo: 'success' });
      return empleadoData;
    }

    setLoading(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const data = await getEmpleado(docTrim);
      const empleados = data?.data || data;
      const empleadoData = Array.isArray(empleados)
        ? empleados.find(emp => String(emp.document_number) === docTrim)
        : null;

      if (empleadoData) {
        empleadosCache[docTrim] = empleadoData;
        setEmpleado(empleadoData);
        setMensaje({ texto: '✓ Empleado encontrado', tipo: 'success' });
        return empleadoData;
      }

      setEmpleado(null);
      setMensaje({ texto: 'No se encontró empleado con ese documento', tipo: 'error' });
      return null;
    } catch {
      setEmpleado(null);
      setMensaje({ texto: 'Error de conexión con la API', tipo: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    documento,
    setDocumento,
    empleado,
    buscarEmpleado,
    loading,
    mensaje,
    setMensaje,
    limpiarEmpleado
  };
}

const cache = {};

export const useEmpleadoForm = (setFormData) => {
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

      const responseData = data?.data || data || [];
      const raw = Array.isArray(responseData)
        ? responseData
        : responseData
          ? [responseData]
          : [];

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
            telefono: pick(src, 'celular', 'Celular', 'telefono', 'Telefono', 'phone', 'mobile') || '',
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
