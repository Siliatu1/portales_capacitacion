import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button, Modal } from "antd";

import "antd/dist/reset.css";

import "../styles/calendar.css";

import DiaCard from "../components/DiaCard";

import ModalActividad from "../components/ModalActividad";

import {
  diasSemana,
  diasSemanaLabel,
  formatearFecha,
  formatFechaAPI,
  calcularHorasSemana,
} from "../utils/fechas";

import {
  motivosLabels,
} from "../utils/motivos";

import {
  useSemana,
} from "../hooks/useSemana";

import {
  useHorarios,
} from "../hooks/useHorarios";

import {
  getPuntosVenta,
} from "../services/horarios.service";

function ProgramacionHorarios() {
  const navigate = useNavigate();

  /* =========================
     USER
  ========================= */

  const [user, setUser] =
    useState(null);

  const documento =
    user?.document_number ||
    user?.documento ||
    user?.cedula;

  /* =========================
     SEMANA
  ========================= */

  const {
    semanaOffset,
    fechasSemana,
    nextWeek,
    prevWeek,
  } = useSemana();

  const fechaInicio =
    fechasSemana?.[0]
      ? formatFechaAPI(
          fechasSemana[0]
        )
      : null;

  const fechaFin =
    fechasSemana?.[6]
      ? formatFechaAPI(
          fechasSemana[6]
        )
      : null;

  /* =========================
     HORARIOS
  ========================= */

  const {
    horarios,
    loading,
    cargarHorarios,
    guardarHorario,
    actualizarHorario,
    borrarHorario,
  } = useHorarios();

  /* =========================
     STATES
  ========================= */

  const [puntosVenta, setPuntosVenta] =
    useState([]);

  const [modalEditar, setModalEditar] =
    useState(false);

  const [guardandoDia,
    setGuardandoDia] =
    useState(false);

  const [diaSeleccionado,
    setDiaSeleccionado] =
    useState(null);

  const [eventoEditar,
    setEventoEditar] =
    useState(null);

  const [formData,
    setFormData] =
    useState({
      puntoVenta: "",
      horaInicio: "",
      horaFin: "",
      motivo: "",
      detalleOtro: "",
    });

  /* =========================
     AUTH
  ========================= */

  useEffect(() => {
    const userData =
      localStorage.getItem(
        "user"
      );

    if (!userData) {
      navigate("/", {
        replace: true,
      });

      return;
    }

    const parsedUser =
      JSON.parse(userData);

    setUser(parsedUser);
  }, [navigate]);

  /* =========================
     CARGA INICIAL
  ========================= */

  useEffect(() => {
    if (!documento) return;

    const init =
      async () => {
        const pdvs =
          await getPuntosVenta(
            documento
          );

        setPuntosVenta(pdvs);

        await cargarHorarios(
          documento,
          fechaInicio,
          fechaFin
        );
      };

    init();
  }, [documento]);

  /* =========================
     CAMBIO SEMANA
  ========================= */

  const handleNextWeek =
    async () => {
      nextWeek();
    };

  const handlePrevWeek =
    async () => {
      prevWeek();
    };

  useEffect(() => {
    if (
      !documento ||
      !fechaInicio ||
      !fechaFin
    ) {
      return;
    }

    cargarHorarios(
      documento,
      fechaInicio,
      fechaFin
    );
  }, [
    semanaOffset,
  ]);

  /* =========================
     MAP HORARIOS
  ========================= */

  const programacionSemanal =
    useMemo(() => {
      const base = {
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: [],
      };

      horarios.forEach((item) => {
        const fecha =
          new Date(
            item.attributes.fecha
          );

        const day =
          fecha.getDay();

        const index =
          day === 0
            ? 6
            : day - 1;

        const diaKey =
          diasSemana[index];

        base[diaKey].push({
          id: item.id,

          puntoVenta:
            item.attributes
              .pdv_nombre,

          horaInicio:
            item.attributes
              .hora_inicio?.substring(
                0,
                5
              ) || "",

          horaFin:
            item.attributes
              .hora_fin?.substring(
                0,
                5
              ) || "",

          motivo:
            item.attributes
              .actividad,
        });
      });

      return base;
    }, [horarios]);

  /* =========================
     MODAL
  ========================= */

  const handleAbrirModal = (
    dia,
    index,
    evento = null
  ) => {
    setDiaSeleccionado({
      dia,
      index,
    });

    setEventoEditar(
      evento
    );

    if (evento) {
      setFormData({
        puntoVenta:
          evento.puntoVenta ||
          "",

        horaInicio:
          evento.horaInicio ||
          "",

        horaFin:
          evento.horaFin ||
          "",

        motivo:
          evento.motivo ||
          "",

        detalleOtro:
          evento.detalleOtro ||
          "",
      });
    } else {
      setFormData({
        puntoVenta: "",
        horaInicio: "",
        horaFin: "",
        motivo: "",
        detalleOtro: "",
      });
    }

    setModalEditar(true);
  };

  const handleCloseModal =
    () => {
      setModalEditar(false);

      setEventoEditar(
        null
      );
    };

  /* =========================
     INPUTS
  ========================= */

  const handleInputChange =
    (e) => {
      const {
        name,
        value,
      } = e.target;

      setFormData(
        (prev) => ({
          ...prev,
          [name]: value,
        })
      );
    };

  /* =========================
     GUARDAR
  ========================= */

  const handleGuardar =
    async () => {
      try {
        if (
          !diaSeleccionado
        ) {
          return;
        }

        if (
          !formData.puntoVenta
        ) {
          Modal.warning({
            title:
              "Punto de venta requerido",
          });

          return;
        }

        if (
          !formData.horaInicio ||
          !formData.horaFin
        ) {
          Modal.warning({
            title:
              "Horas requeridas",
          });

          return;
        }

        if (
          !formData.motivo
        ) {
          Modal.warning({
            title:
              "Motivo requerido",
          });

          return;
        }

        setGuardandoDia(
          true
        );

        const fecha =
          fechasSemana[
            diaSeleccionado.index
          ];

        const fechaAPI =
          formatFechaAPI(
            fecha
          );

        const pdv =
          puntosVenta.find(
            (item) =>
              String(
                item.id
              ) ===
              String(
                formData.puntoVenta
              )
          );

        const payload = {
          pdv_nombre:
            pdv?.nombre || "",

          fecha:
            fechaAPI,

          hora_inicio:
            `${formData.horaInicio}:00`,

          hora_fin:
            `${formData.horaFin}:00`,

          actividad:
            motivosLabels[
              formData
                .motivo
            ] ||
            formData.motivo,

          documento:
            String(
              documento
            ),
        };

        if (
          eventoEditar
        ) {
          await actualizarHorario(
            eventoEditar.id,
            payload
          );
        } else {
          await guardarHorario(
            payload
          );
        }

        await cargarHorarios(
          documento,
          fechaInicio,
          fechaFin
        );

        handleCloseModal();

        Modal.success({
          title:
            "Horario guardado",
        });
      } catch (error) {
        console.error(error);

        Modal.error({
          title:
            "Error guardando horario",
        });
      } finally {
        setGuardandoDia(
          false
        );
      }
    };

  /* =========================
     ELIMINAR
  ========================= */

  const handleEliminar =
    async (id) => {
      try {
        await borrarHorario(
          id
        );

        await cargarHorarios(
          documento,
          fechaInicio,
          fechaFin
        );

        Modal.success({
          title:
            "Horario eliminado",
        });
      } catch (error) {
        console.error(error);

        Modal.error({
          title:
            "Error eliminando horario",
        });
      }
    };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="programacion-container">
      {/* =========================
          HEADER
      ========================= */}

      <div className="header-programacion">
        <div>
          <h1>
            Programación
            Semanal
          </h1>

          <p>
            Organiza las
            actividades de la
            semana
          </p>
        </div>

        <div className="week-actions">
          <Button
            onClick={
              handlePrevWeek
            }
          >
            ← Semana
          </Button>

          <Button
            onClick={
              handleNextWeek
            }
          >
            Semana →
          </Button>
        </div>
      </div>

      {/* =========================
          TOTAL HORAS
      ========================= */}

      <div className="week-total">
        Total semana:
        {" "}
        {calcularHorasSemana(
          programacionSemanal
        ).toFixed(1)}
        h
      </div>

      {/* =========================
          GRID
      ========================= */}

      <div className="week-grid">
        {diasSemana.map(
          (
            dia,
            index
          ) => (
            <DiaCard
              key={dia}
              dia={dia}
              label={
                diasSemanaLabel[
                  index
                ]
              }
              fecha={formatearFecha(
                fechasSemana[
                  index
                ]
              )}
              eventos={
                programacionSemanal[
                  dia
                ]
              }
              onAgregar={() =>
                handleAbrirModal(
                  dia,
                  index
                )
              }
              onEditar={(
                evento
              ) =>
                handleAbrirModal(
                  dia,
                  index,
                  evento
                )
              }
              onEliminar={
                handleEliminar
              }
            />
          )
        )}
      </div>

      {/* =========================
          MODAL
      ========================= */}

      <ModalActividad
        open={modalEditar}
        onClose={
          handleCloseModal
        }
        onGuardar={
          handleGuardar
        }
        formData={formData}
        onChange={
          handleInputChange
        }
        puntosVenta={
          puntosVenta
        }
        loading={
          guardandoDia
        }
      />
    </div>
  );
}

export default ProgramacionHorarios;