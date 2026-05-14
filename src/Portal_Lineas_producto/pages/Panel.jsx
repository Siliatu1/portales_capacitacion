import {
  useMemo,
  useState,
} from "react";

import Navbar from "../components/navbar";

import {
  useInscripciones,
} from "../hooks/useInscripciones";

import {
  filtrarInscripciones,
} from "../utils/filters";

import "../styles/panel.css";

import InscripcionesTable from "../components/InscripcionesTable";

import FiltrosInscripciones from "../components/FiltrosInscripciones";

import { useAuth } from "../../auth/hooks/useAuth";

const FORM_TYPE_VIEW_MAP = {
  restaurante:
    "FORM_RESTAURANTE",

  todera:
    "FORM_TODERA",

  heladeria:
    "FORM_HELADERIA",
};

const FORM_TYPE_LABELS = {
  restaurante:
    "Restaurante",

  todera:
    "Todera",

  heladeria:
    "Heladeria",
};

const normalizeText = (
  value
) => {
  return String(value || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

const normalizeFormType =
  (value) => {
    const formType =
      normalizeText(value);

    console.log(
      "TIPO FORMULARIO:",
      formType
    );

    if (
      formType.includes(
        "heladeria"
      )
    ) {
      return "heladeria";
    }

    if (
      formType.includes(
        "todera"
      )
    ) {
      return "todera";
    }

    return "restaurante";
  };

const getStoredUser =
  () => {
    try {
      const raw =
        localStorage.getItem(
          "user"
        );

      return raw
        ? JSON.parse(raw)
        : null;
    } catch {
      return null;
    }
  };

const getUserPdv =
  (user) => {
    return (
      user?.pdv ||
      user?.puntoVenta ||
      user?.area_nombre ||
      user?.area ||
      ""
    );
  };

export default function Panel({
  userData,
  onLogout,
}) {
  const {
    canAccessView,
    hasPermission,
    user,
  } = useAuth();

  const [
    filtros,
    setFiltros,
  ] = useState({
    cedula: "",
    puntoVenta: "",
    fecha: "",
  });

  const storedUser =
    useMemo(() => {
      return getStoredUser();
    }, []);

  const shouldFilterByPdv =
    hasPermission(
      "filterByPDV"
    );

  const userPdv =
    useMemo(() => {
      return getUserPdv(
        storedUser ||
          user ||
          userData
      );
    }, [
      storedUser,
      user,
      userData,
    ]);

  const {
    data,
    loading,
    deleteInscripcion,
  } = useInscripciones({
    pdv:
      shouldFilterByPdv
        ? userPdv
        : "",
  });

  const dataFiltrada =
    useMemo(() => {
      const filtradas =
        filtrarInscripciones(
          data,
          filtros
        );

      return filtradas.map(
        (
          inscripcion
        ) => {
          const panelFormType =
            normalizeFormType(
              inscripcion.tipo_formulario
            );

          return {
            ...inscripcion,
            panelFormType,
          };
        }
      );
    }, [data, filtros]);

  const groupedData =
    useMemo(() => {
      return dataFiltrada.reduce(
        (
          acc,
          item
        ) => {
          const type =
            item.panelFormType;

          if (
            !acc[type]
          ) {
            acc[type] =
              [];
          }

          acc[type].push(
            item
          );

          return acc;
        },
        {}
      );
    }, [dataFiltrada]);

  const visibleGroups =
    useMemo(() => {
      return Object.entries(
        groupedData
      ).filter(
        ([formType]) => {
          const permission =
            FORM_TYPE_VIEW_MAP[
              formType
            ];

          console.log(
            "VALIDANDO FORM:",
            formType,
            permission
          );

          if (
            !permission
          ) {
            return true;
          }

          return canAccessView(
            permission
          );
        }
      );
    }, [
      groupedData,
      canAccessView,
    ]);

  const fechasDisponibles =
    useMemo(() => {
      const unique =
        new Set(
          data
            .map(
              (
                item
              ) =>
                item.dia
            )
            .filter(
              Boolean
            )
        );

      return Array.from(
        unique
      ).sort(
        (a, b) =>
          String(
            b
          ).localeCompare(
            String(a)
          )
      );
    }, [data]);


  return (
    <>
      <Navbar
        userData={
          userData
        }
        onLogout={
          onLogout
        }
      />

      <div className="admin-content">
        <h2>
          {user?.foto && <img src={user.foto} alt="Perfil" className="user-avatar" />}
          BIENVENIDO A TU PANEL DE CONTROL
          
        </h2>

        <FiltrosInscripciones
          filtros={
            filtros
          }
          setFiltros={
            setFiltros
          }
          fechasDisponibles={
            fechasDisponibles
          }
        />

        {visibleGroups.length ===
          0 && (
          <div
            style={{
              marginTop: 20,
              fontSize: 16,
            }}
          >
            No hay
            inscripciones
            disponibles
          </div>
        )}

        {visibleGroups.map(
          ([
            formType,
            items,
          ]) => {
            return (
              <div
                className="table-card"
                key={
                  formType
                }
              >
                <div className="table-header">
                  <div className="table-title">
                    {FORM_TYPE_LABELS[
                      formType
                    ] ||
                      formType}
                    {" ("}
                    {
                      items.length
                    }
                    {")"}
                  </div>
                </div>

                <InscripcionesTable
                  data={
                    items
                  }
                  loading={
                    loading
                  }
                  formType={
                    formType
                  }
                  onDelete={
                    deleteInscripcion
                  }
                />
              </div>
            );
          }
        )}
      </div>
    </>
  );
}