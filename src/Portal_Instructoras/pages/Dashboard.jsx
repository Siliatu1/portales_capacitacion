import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Card,
  Button,
  Tag,
} from "antd";

import {
  CalendarDays,
  Clock3,
  Building2,
  Activity,
} from "lucide-react";

import "../styles/dashboard.css";

import Navbar from "../components/Navbar";

import {
  useSemana,
} from "../hooks/useSemana";

import {
  useHorarios,
} from "../hooks/useHorarios";

import {
  useDashboard,
} from "../hooks/useDashboard";

import {
  diasSemana,
  diasSemanaLabel,
  formatFechaAPI,
  formatearFecha,
} from "../utils/fechas";

function Dashboard() {
  const navigate = useNavigate();

  /* =========================
     USER
  ========================= */

  const [user, setUser] =
    useState(null);

  /* =========================
     GET ROLE
  ========================= */

  const role =
    user?.role ||
    user?.profile ||
    user?.perfil ||
    "";

  const isSuperAdmin =
    role ===
    "SUPER_ADMIN";

  const isCapacitadora =
    role ===
    "CAPACITADORA";

  /* =========================
     DOCUMENTO
  ========================= */

  const documento =
    user?.document_number ||
    user?.documento ||
    user?.cedula;

  /* =========================
     SEMANA
  ========================= */

  const {
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
    cargarHorarios,
  } = useHorarios();

  /* =========================
     AUTH
  ========================= */

  useEffect(() => {
    const data =
      localStorage.getItem(
        "user"
      );

    if (!data) {
      navigate("/", {
        replace: true,
      });

      return;
    }

    const parsedUser =
      JSON.parse(data);

    setUser(parsedUser);
  }, [navigate]);

  /* =========================
     LOAD
  ========================= */

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
    documento,
    fechaInicio,
    fechaFin,
  ]);

  /* =========================
     MAP SEMANA
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
            item.attributes
              ?.fecha
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
              ?.pdv_nombre,

          motivo:
            item.attributes
              ?.actividad,

          horaInicio:
            item.attributes
              ?.hora_inicio?.substring(
                0,
                5
              ),

          horaFin:
            item.attributes
              ?.hora_fin?.substring(
                0,
                5
              ),
        });
      });

      return base;
    }, [horarios]);

  /* =========================
     DASHBOARD
  ========================= */

  const {
    totalEventos,
    totalHoras,
    totalPDVS,
    actividadTop,
  } = useDashboard({
    horarios,
    programacionSemanal,
  });

  /* =========================
     HANDLERS
  ========================= */

  const goProgramacion =
    () => {
      navigate(
        "/portal-instructoras/programacion"
      );
    };

  const goAdmin = () => {
    navigate(
      "/portal-instructoras/administrativo"
    );
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        {/* =========================
            HEADER
        ========================= */}

        <div className="dashboard-header">
          <div>
            <h1>
              Hola,
              {" "}
              {user?.nombre ||
                "Usuario"}{" "}
              
            </h1>

            <p>
              Bienvenida al
              portal de
              programación
            </p>
          </div>

          <div className="week-actions">
            <Button
              onClick={
                prevWeek
              }
            >
              ← Semana
            </Button>

            <Button
              onClick={
                nextWeek
              }
            >
              Semana →
            </Button>
          </div>
        </div>

        {/* =========================
            STATS
        ========================= */}

        <div className="dashboard-cards">
        

          <Card className="dashboard-card">
            <div className="card-icon blue">
              <Clock3
                size={26}
              />
            </div>

            <div>
              <h3>
                {totalHoras.toFixed(
                  1
                )}
                h
              </h3>

              <p>
                Horas
                programadas
              </p>
            </div>
          </Card>

          

          <Card className="dashboard-card">
            <div className="card-icon orange">
              <Activity
                size={26}
              />
            </div>

            <div>
              <h3>
                {
                  actividadTop
                }
              </h3>

              <p>
                Actividad top
              </p>
            </div>
          </Card>
        </div>

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <div className="dashboard-actions">
          {/* =========================
              CAPACITADORA
          ========================= */}

          {isCapacitadora && (
            <Card className="action-card">
              <h2>
                Programación
              </h2>

              <p>
                Gestiona la
                programación
                semanal y crea
                nuevas
                actividades.
              </p>

              <Button
                type="primary"
                onClick={
                  goProgramacion
                }
              >
                Abrir
                programación
              </Button>
            </Card>
          )}

          {/* =========================
              SUPER ADMIN
          ========================= */}

          {isSuperAdmin && (
            <Card className="action-card">
              <h2>
                Vista
                Administrativa
              </h2>

              <p>
                Consulta el
                consolidado
                semanal de
                instructoras.
              </p>

              <Button
                type="primary"
                onClick={
                  goAdmin
                }
              >
                Abrir panel
              </Button>
            </Card>
          )}
        </div>

        {/* =========================
            RESUMEN SEMANA
        ========================= */}

        {isCapacitadora && (
          <div className="week-summary">
            {diasSemana.map(
              (
                dia,
                index
              ) => (
                <Card
                  key={dia}
                  className="summary-card"
                >
                  <div className="summary-header">
                    <div>
                      <h3>
                        {
                          diasSemanaLabel[
                            index
                          ]
                        }
                      </h3>

                      <span>
                        {formatearFecha(
                          fechasSemana[
                            index
                          ]
                        )}
                      </span>
                    </div>

                    <Tag color="green">
                      {
                        programacionSemanal[
                          dia
                        ]
                          .length
                      }
                    </Tag>
                  </div>

                  <div className="summary-events">
                    {programacionSemanal[
                      dia
                    ]
                      .slice(
                        0,
                        3
                      )
                      .map(
                        (
                          evento
                        ) => (
                          <div
                            key={
                              evento.id
                            }
                            className="summary-event"
                          >
                            <strong>
                              {
                                evento.puntoVenta
                              }
                            </strong>

                            <span>
                              {
                                evento.horaInicio
                              }
                              {" - "}
                              {
                                evento.horaFin
                              }
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </Card>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;