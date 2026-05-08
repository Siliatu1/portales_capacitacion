import { useState, useMemo, useCallback } from "react";
import Navbar from "../components/navbar";
import { useInscripciones } from "../hooks/useInscripciones";
import { filtrarInscripciones } from "../utils/filters";
import "../styles/panel.css";
import InscripcionesTable from "../components/InscripcionesTable"; 
import FiltrosInscripciones from "../components/FiltrosInscripciones"; 
import { useAuth } from "../../auth/hooks/useAuth";

const FORM_TYPE_VIEW_MAP = {
  heladeria: "FORM_HELADERIA",
  restaurante: "FORM_RESTAURANTE",
  todera: "FORM_TODERA",
};

const FORM_TYPE_LABELS = {
  heladeria: "Heladeria",
  restaurante: "Restaurante",
  todera: "Todera",
};

const PDV_KEYS = new Set([
  "pdv",
  "puntoVenta",
  "punto_venta",
  "punto_venta_nombre",
  "pdv_nombre",
  "area_nombre",
  "area",
]);

const normalizePdv = (value) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

const compactPdv = (value) => {
  return normalizePdv(value).replace(/[^a-z0-9]/g, "");
};

const pdvMatches = (source, target) => {
  const sourceValue = normalizePdv(source);
  const targetValue = normalizePdv(target);
  const sourceCompact = compactPdv(source);
  const targetCompact = compactPdv(target);

  if (!sourceValue || !targetValue) return false;

  return (
    sourceValue === targetValue ||
    sourceCompact === targetCompact ||
    sourceValue.includes(targetValue) ||
    targetValue.includes(sourceValue) ||
    sourceCompact.includes(targetCompact) ||
    targetCompact.includes(sourceCompact)
  );
};

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

const getTextFromPdvObject = (value) => {
  if (!value || typeof value !== "object") return "";

  const source = value.data?.attributes || value.attributes || value;
  return (
    source.nombre ||
    source.name ||
    source.label ||
    source.value ||
    source.area_nombre ||
    source.pdv_nombre ||
    source.pdv ||
    ""
  );
};

const findPdvInObject = (value, depth = 0) => {
  if (!value || depth > 4 || typeof value !== "object") return "";

  for (const [key, fieldValue] of Object.entries(value)) {
    if (!PDV_KEYS.has(key)) continue;

    if (typeof fieldValue === "string" || typeof fieldValue === "number") {
      return String(fieldValue);
    }

    const textValue = getTextFromPdvObject(fieldValue);
    if (textValue) return textValue;
  }

  for (const fieldValue of Object.values(value)) {
    const nestedValue = findPdvInObject(fieldValue, depth + 1);
    if (nestedValue) return nestedValue;
  }

  return "";
};

const getUserPdv = (...users) => {
  for (const candidate of users) {
    const pdv = findPdvInObject(candidate);
    if (pdv) return pdv;
  }

  return "";
};

const getInscripcionPdv = (inscripcion) => {
  return inscripcion?.puntoVenta || inscripcion?.area_nombre || "";
};

const normalizeFormType = (value) => {
  const formType = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  if (formType.includes("restaurante") || formType.includes("pdv")) return "restaurante";
  if (formType.includes("heladeria")) return "heladeria";
  if (formType.includes("todera")) return "todera";

  return "";
};

export default function Panel ({ userData, onLogout }) {
  const { canAccessView, hasPermission, user } = useAuth();
  const storedUser = useMemo(() => getStoredUser(), []);
  const shouldFilterByPdv = hasPermission("filterByPDV");
  const userPdv = useMemo(() => {
    return getUserPdv(storedUser, user, userData);
  }, [storedUser, user, userData]);
  const { data, loading, deleteInscripcion } = useInscripciones({
    pdv: shouldFilterByPdv ? userPdv : "",
  });

  const [filtros, setFiltros] = useState({
    cedula: "",
    puntoVenta: "",
    fecha: "",
    formulario: 'todos'
  });

  const dataPorPdv = useMemo(() => {
    if (!shouldFilterByPdv) return data;
    if (!userPdv) return [];

    return data.filter((inscripcion) => {
      return pdvMatches(getInscripcionPdv(inscripcion), userPdv);
    });
  }, [data, shouldFilterByPdv, userPdv]);

  const visibleFormTypes = useMemo(() => {
    return Object.entries(FORM_TYPE_VIEW_MAP)
      .filter(([, view]) => canAccessView(view))
      .map(([formType]) => formType);
  }, [canAccessView]);

  const getPanelFormType = useCallback((inscripcion) => {
    if (visibleFormTypes.length === 1) {
      return visibleFormTypes[0];
    }

    const formType = normalizeFormType(inscripcion.tipo_formulario);
    if (formType && FORM_TYPE_VIEW_MAP[formType]) return formType;

    return "heladeria";
  }, [visibleFormTypes]);

  const dataFiltrada = useMemo(() => {
    return filtrarInscripciones(dataPorPdv, filtros).map((inscripcion) => {
      return {
        ...inscripcion,
        panelFormType: getPanelFormType(inscripcion),
      };
    }).filter((inscripcion) => {
      const formType = inscripcion.panelFormType;
      const view = FORM_TYPE_VIEW_MAP[formType];
      return view ? canAccessView(view) : false;
    });
  }, [canAccessView, dataPorPdv, filtros, getPanelFormType]);

  const formTypes = useMemo(() => {
    const set = new Set((dataFiltrada || []).map(i => i.panelFormType));
    return Array.from(set);
  }, [dataFiltrada]);

  const fechasDisponibles = useMemo(() => {
    const set = new Set((dataPorPdv || []).map(i => i.dia).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [dataPorPdv]);

  return (
    <>
      {/* NAVBAR */}
      <Navbar userData={userData} onLogout={onLogout} />

      <div className="admin-content">
        <h2>Inscripciones</h2>

        {/* FILTROS */}
        <FiltrosInscripciones
          filtros={filtros}
          setFiltros={setFiltros}
          fechasDisponibles={fechasDisponibles}
        />

        {/* TABLAS POR FORMULARIO */}
        {formTypes.map((ft) => (
          <div className="table-card" key={ft} style={{ marginBottom: 18 }}>
            <div className="table-header">
              <div className="table-title">{FORM_TYPE_LABELS[ft] || ft} ({dataFiltrada.filter(i => i.panelFormType === ft).length})</div>
            </div>
            <InscripcionesTable
              data={dataFiltrada.filter(i => i.panelFormType === ft)}
              loading={loading}
              formType={ft}
              onDelete={deleteInscripcion}
            />
          </div>
        ))}
      </div>
    </>
  );
}
