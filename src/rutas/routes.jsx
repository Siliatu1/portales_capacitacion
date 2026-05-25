import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../auth/Login/Login";
import ProtectedViewRoute from "../auth/components/ProtectedViewRoute";
import { useAuth } from "../auth/hooks/useAuth";
import {
  getDefaultPortalInstructorasRoute,
  getDefaultRouteForUser,
} from "../auth/utils/auth-user.utils";

import MenuPrincipal from "../Menu_principal/componente/MenuPrincipal";

import Panel from "../Portal_Lineas_producto/pages/Panel";
import FormHeladeria from "../Portal_Lineas_producto/pages/FormHeladeria";
import FormRestaurante from "../Portal_Lineas_producto/pages/FromRestaurante";
import ControlAsistencia from "../Portal_Lineas_producto/pages/ControlAsistencia";
import FormTodera from "../Portal_Lineas_producto/pages/FormTodera";
import InscripcionesCafe from "../Portal_Lineas_producto/pages/InscripcionesCafe";
import InscripcionesTodera from "../Portal_Lineas_producto/pages/InscripcionesTodera";
import GestionInstructoras from "../Portal_Lineas_producto/pages/GestionInstructoras";
import PanelInstructoras from "../Portal_Lineas_producto/pages/PanelInstructoras";

import Dashboard from "../Portal_Instructoras/components/Dashboard";
import ProgramacionHorarios from "../Portal_Instructoras/components/ProgramacionHorarios";
import VistaAdministrativa from "../Portal_Instructoras/components/VistaAdministrativa";

const PortalInstructorasRedirect = () => {
  const { user } = useAuth();

  return (
    <Navigate
      to={getDefaultPortalInstructorasRoute(user)}
      replace
    />
  );
};

const DefaultRedirect = () => {
  const { user } = useAuth();

  return (
    <Navigate
      to={getDefaultRouteForUser(user)}
      replace
    />
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/menu" element={<MenuPrincipal />} />
    <Route path="/dashboard" element={<DefaultRedirect />} />

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

    <Route
      path="/lineas-producto/gestion-instructoras"
      element={
        <ProtectedViewRoute view="GESTION_INSTRUCTORAS">
          <GestionInstructoras />
        </ProtectedViewRoute>
      }
    />

    <Route
      path="/lineas-producto/panel-instructora"
      element={
        <ProtectedViewRoute view="PANELINSTRUCTORA">
          <PanelInstructoras />
        </ProtectedViewRoute>
      }
    />

    <Route
      path="/lineas-producto/inscripciones/cafe"
      element={
        <ProtectedViewRoute view="INSCRIPCIONES_CAFE">
          <InscripcionesCafe />
        </ProtectedViewRoute>
      }
    />

    <Route
      path="/lineas-producto/inscripciones/todera"
      element={
        <ProtectedViewRoute view="INSCRIPCIONES_TODERA">
          <InscripcionesTodera />
        </ProtectedViewRoute>
      }
    />

    <Route path="/portal-instructoras" element={<PortalInstructorasRedirect />} />

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

    <Route path="*" element={<DefaultRedirect />} />
  </Routes>
);

export default AppRoutes;
