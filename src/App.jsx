import { Navigate, Route, Routes } from "react-router-dom";
import ValidacionUsuario from "./auth/ValidacionUsuario/ValidacionUsuario";
import { useAuth } from "./auth/hooks/useAuth";

import MenuPrincipal from "./Menu_principal/componente/MenuPrincipal";

import Panel from "./Portal_Lineas_producto/pages/Panel";
import FormHeladeria from "./Portal_Lineas_producto/pages/FormHeladeria";
import FormRestaurante from "./Portal_Lineas_producto/pages/FromRestaurante";
import ControlAsistencia from "./Portal_Lineas_producto/pages/ControlAsistencia";
import FormTodera from "./Portal_Lineas_producto/pages/FormTodera";
import InscripcionesCafe from "./Portal_Lineas_producto/pages/InscripcionesCafe";
import InscripcionesTodera from "./Portal_Lineas_producto/pages/InscripcionesTodera";
import GestionInstructoras from "./Portal_Lineas_producto/pages/GestionInstructoras";
import PanelInstructoras from "./Portal_Lineas_producto/pages/PanelInstructoras";
import Dashboard from "./Portal_Instructoras/components/Dashboard";
import ProgramacionHorarios from "./Portal_Instructoras/components/ProgramacionHorarios";
import VistaAdministrativa from "./Portal_Instructoras/components/VistaAdministrativa";

const renderViewByProfile = (
  { user, canAccessView, getDefaultRouteForUser },
  view,
  element
) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!canAccessView(view)) {
    return <Navigate to={getDefaultRouteForUser()} replace />;
  }

  return element;
};

const PortalInstructorasRedirect = () => {
  const { getDefaultPortalInstructorasRoute } = useAuth();

  return (
    <Navigate
      to={getDefaultPortalInstructorasRoute()}
      replace
    />
  );
};

const DefaultRedirect = () => {
  const { getDefaultRouteForUser } = useAuth();

  return (
    <Navigate
      to={getDefaultRouteForUser()}
      replace
    />
  );
};

const AppRoutes = () => {
  const auth = useAuth();

  return (
    <Routes>
      <Route path="/" element={<ValidacionUsuario />} />
      <Route path="/menu" element={<MenuPrincipal />} />
      <Route path="/dashboard" element={<DefaultRedirect />} />

    <Route
      path="/lineas-producto"
      element={renderViewByProfile(auth, "PANEL", <Panel />)}
    />

    <Route
      path="/lineas-producto/form-heladeria"
      element={renderViewByProfile(auth, "FORM_HELADERIA", <FormHeladeria />)}
    />

    <Route
      path="/lineas-producto/form-restaurante"
      element={renderViewByProfile(
        auth,
        "FORM_RESTAURANTE",
        <FormRestaurante />
      )}
    />

    <Route
      path="/lineas-producto/control-asistencia"
      element={renderViewByProfile(
        auth,
        "CONTROL_ASISTENCIA",
        <ControlAsistencia />
      )}
    />

    <Route
      path="/lineas-producto/control-asistencia/todera"
      element={renderViewByProfile(
        auth,
        "CONTROL_ASISTENCIA",
        <ControlAsistencia forcedMode="todera" />
      )}
    />

    <Route
      path="/lineas-producto/form-todera"
      element={renderViewByProfile(auth, "FORM_TODERA", <FormTodera />)}
    />

    <Route
      path="/lineas-producto/gestion-instructoras"
      element={renderViewByProfile(
        auth,
        "GESTION_INSTRUCTORAS",
        <GestionInstructoras />
      )}
    />

    <Route
      path="/lineas-producto/panel-instructora"
      element={renderViewByProfile(
        auth,
        "PANELINSTRUCTORA",
        <PanelInstructoras />
      )}
    />

    <Route
      path="/lineas-producto/inscripciones/cafe"
      element={renderViewByProfile(
        auth,
        "INSCRIPCIONES_CAFE",
        <InscripcionesCafe />
      )}
    />

    <Route
      path="/lineas-producto/inscripciones/todera"
      element={renderViewByProfile(
        auth,
        "INSCRIPCIONES_TODERA",
        <InscripcionesTodera />
      )}
    />

    <Route path="/portal-instructoras" element={<PortalInstructorasRedirect />} />

    <Route
      path="/portal/horarios-instructoras/instructor"
      element={renderViewByProfile(auth, "PROGRAMACION", <Dashboard />)}
    />

    <Route
      path="/portal/horarios-instructoras/admin"
      element={renderViewByProfile(
        auth,
        "ADMINISTRATIVO",
        <VistaAdministrativa />
      )}
    />

    <Route
      path="/portal-instructoras/dashboard"
      element={renderViewByProfile(auth, "PROGRAMACION", <Dashboard />)}
    />

    <Route
      path="/portal-instructoras/programacion"
      element={renderViewByProfile(
        auth,
        "PROGRAMACION",
        <ProgramacionHorarios />
      )}
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
      element={renderViewByProfile(
        auth,
        "ADMINISTRATIVO",
        <VistaAdministrativa />
      )}
    />

      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  );
};

function App() {
  return <AppRoutes />;
}

export default App;
