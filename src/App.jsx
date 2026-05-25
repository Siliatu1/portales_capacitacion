import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./auth/Login/Login";

import MenuPrincipal from "./Menu_principal/componente/MenuPrincipal";

import Panel from "./Portal_Lineas_producto/pages/Panel";

import FormHeladeria from "./Portal_Lineas_producto/pages/FormHeladeria";

import FormRestaurante from "./Portal_Lineas_producto/pages/FromRestaurante";

import ControlAsistencia from "./Portal_Lineas_producto/pages/ControlAsistencia";

import FormTodera from "./Portal_Lineas_producto/pages/FormTodera";

import InscripcionesCafe from "./Portal_Lineas_producto/pages/InscripcionesCafe";

import InscripcionesTodera from "./Portal_Lineas_producto/pages/InscripcionesTodera";

import GestionInstructoras from "./Portal_Lineas_producto/pages/GestionInstructoras";

import ProtectedViewRoute from "./auth/components/ProtectedViewRoute";
import { useAuth } from "./auth/hooks/useAuth";
import { getDefaultPortalInstructorasRoute } from "./auth/utils/auth-user.utils";

import Dashboard from "./Portal_Instructoras/components/Dashboard";

import ProgramacionHorarios from "./Portal_Instructoras/components/ProgramacionHorarios";

import VistaAdministrativa from "./Portal_Instructoras/components/VistaAdministrativa";

const PortalInstructorasRedirect = () => {
  const { user } = useAuth();

  return (
    <Navigate
      to={getDefaultPortalInstructorasRoute(user)}
      replace
    />
  );
};

function App() {
  const user = null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/menu"
          element={<MenuPrincipal />}
        />

        {/* Portal Líneas de Producto */}
        <Route
          path="/lineas-producto"
          element={
            <ProtectedViewRoute view="PANEL">
              <Panel />
            </ProtectedViewRoute>
          }
        />

        <Route
          path="/lineas-producto/form-heladeria"
          element={
            <ProtectedViewRoute view="FORM_HELADERIA">
              <FormHeladeria />
            </ProtectedViewRoute>
          }
        />

        <Route
          path="/lineas-producto/form-restaurante"
          element={
            <ProtectedViewRoute view="FORM_RESTAURANTE">
              <FormRestaurante />
            </ProtectedViewRoute>
          }
        />

        <Route
          path="/lineas-producto/control-asistencia"
          element={
            <ProtectedViewRoute view="CONTROL_ASISTENCIA">
              <ControlAsistencia />
            </ProtectedViewRoute>
          }
        />

        <Route
          path="/lineas-producto/form-todera"
          element={
            <ProtectedViewRoute view="FORM_TODERA">
              <FormTodera />
            </ProtectedViewRoute>
          }
        />

        {/* Control de evaluacion y calificacion , escuela del cafe */}
        <Route
          path="/lineas-producto/gestion-instructoras"
          element={
            <ProtectedViewRoute view="GESTION_INSTRUCTORAS">
              <GestionInstructoras />
            </ProtectedViewRoute>
          }
        />

        <Route
          path="/lineas-producto/inscripciones/cafe"
          element={
            <ProtectedViewRoute view="PANEL">
              <InscripcionesCafe />
            </ProtectedViewRoute>
          }
        />

        <Route
          path="/lineas-producto/inscripciones/todera"
          element={
            <ProtectedViewRoute view="PANEL">
              <InscripcionesTodera />
            </ProtectedViewRoute>
          }
        />

        {/* PORTAL INSTRUCTORAS */}

        <Route
          path="/portal-instructoras"
          element={<PortalInstructorasRedirect />}
        />

        <Route
          path="/portal/horarios-instructoras/instructor"
          element={
            <ProtectedViewRoute view="PROGRAMACION">
              <Dashboard />
            </ProtectedViewRoute>
          }
        />

        <Route
          path="/portal/horarios-instructoras/admin"
          element={
            <ProtectedViewRoute view="ADMINISTRATIVO">
              <VistaAdministrativa />
            </ProtectedViewRoute>
          }
        />

        <Route
          path="/portal-instructoras/dashboard"
          element={
            <ProtectedViewRoute view="PROGRAMACION">
              <Dashboard />
            </ProtectedViewRoute>
          }
        />
        


        <Route
          path="/dashboard"
          element={
            user ? (
              <div>Bienvenido</div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
         <Route
          path="/portal-instructoras/programacion"
          element={
            <ProtectedViewRoute view="PROGRAMACION">
              <ProgramacionHorarios />
            </ProtectedViewRoute>
          }
        />

        <Route
          path="/portal-instructoras/administrativo"
          element={
            <Navigate
              to="/portal-instructoras/vista-administrativa"
              replace
            />
          }
        />

        <Route
          path="/portal-instructoras/vista-administrativa"
          element={
            <ProtectedViewRoute view="ADMINISTRATIVO">
              <VistaAdministrativa />
            </ProtectedViewRoute>
          }
        />
         <Route
          path="*"
          element={
            <Navigate
              to="/portal-instructoras/dashboard"
              replace
            />
          }
        />
        
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
