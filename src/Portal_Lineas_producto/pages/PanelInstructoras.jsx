import Navbar from "../components/navbar";

import { useAuth } from "../../auth/hooks/useAuth";

import { useInstructoras } from "../hooks/useInstructoras";

import InstructorasTable from "../components/InstructorasTable";

import "../styles/Panelinstructoras.css";

export default function PanelInstructoras({
  userData,
  onLogout,
}) {
  const { user } = useAuth();

  const nombreInstructora =
    user?.nombre ||
    user?.name ||
    userData?.nombre ||
    userData?.name ||
    "";

  const {
    data,
    loading,
    error,
    cambiarEstado,
    guardarObservacion,
  } = useInstructoras({
    nombreInstructora,
  });

  console.log(
    "USUARIO INSTRUCTORA:",
    nombreInstructora
  );

  console.log(
    "ESTUDIANTES:",
    data
  );

  const total = data.length;

  const evaluados =
    data.filter(
      (item) =>
        item.estado === true ||
        item.estado === 1
    ).length;

  const pendientes =
    total - evaluados;

  return (
    <>
      <Navbar
        userData={userData}
        onLogout={onLogout}
      />

      <div className="admin-content">

        {/* HEADER */}

        <div className="panel-header">
          <h1>
            Panel Instructoras
          </h1>

          <p>
            Hola{" "}
            <strong>
              {nombreInstructora}
            </strong>
          </p>

          <p>
            Aquí puedes evaluar
            tus estudiantes
            asignados.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="error-box">
            Error cargando
            estudiantes
          </div>
        )}

        {/* TABLA */}

        <div className="table-card">

          <div className="table-header">

            <div className="table-title">
              Evaluación Todera
            </div>

            <div className="table-count">
              Total: {total}
            </div>

          </div>

          <InstructorasTable
            data={data}
            loading={loading}
            onEstadoChange={
              cambiarEstado
            }
            onGuardarObservacion={
              guardarObservacion
            }
          />

        </div>

      </div>
    </>
  );
}