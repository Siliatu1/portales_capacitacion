import Navbar from "../components/navbar";

import { useAuth } from "../../auth/hooks/useAuth";

import { useInstructoras } from "../hooks/useInstructoras";

import InstructorasTable from "../components/InstructorasTable";

import "../styles/panel.css";

export default function PanelInstructoras({
  userData,
  onLogout,
}) {
  const { user } =
    useAuth();

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
  } =
    useInstructoras({
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
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <h1>
            Panel
            Instructoras
          </h1>

          <p>
            Hola{" "}
            <strong>
              {
                nombreInstructora
              }
            </strong>
          </p>

          <p>
            Aqui puedes
            evaluar tus
            estudiantes
            asignados.
          </p>
        </div>

        {error && (
          <div
            style={{
              background:
                "#fff2f0",

              border:
                "1px solid #ffccc7",

              padding: 16,

              borderRadius: 8,

              marginBottom: 20,
            }}
          >
            Error
            cargando
            estudiantes
          </div>
        )}

        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              Evaluacion
              Todera
            </div>

            <div className="table-count">
              Total:{" "}
              {
                data.length
              }
            </div>
          </div>

          <InstructorasTable
            data={data}
            loading={
              loading
            }
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