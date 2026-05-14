import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./auth/Login/Login";

import MenuPrincipal from "./Menu_principal/componente/MenuPrincipal";

import Panel from "./Portal_Lineas_producto/pages/Panel";

import FormHeladeria from "./Portal_Lineas_producto/pages/FormHeladeria";

import FormRestaurante from "./Portal_Lineas_producto/pages/FromRestaurante";

import ControlAsistencia from "./Portal_Lineas_producto/pages/ControlAsistencia";

import FormTodera from "./Portal_Lineas_producto/pages/FormTodera";

import InscripcionesCafe from "./Portal_Lineas_producto/pages/InscripcionesCafe";

import InscripcionesTodera from "./Portal_Lineas_producto/pages/InscripcionesTodera";

import ProtectedViewRoute from "./auth/components/ProtectedViewRoute";

import Dashboard from "./Portal_Instructoras/pages/Dashboard";

import Programacion from "./Portal_Instructoras/pages/ProgramacionHorarios";



function App() {
  const user = null;

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/menu" element={<MenuPrincipal />} />

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
          path="/lineas-producto/panel-instructora"
          element={
            <ProtectedViewRoute view="PANELINSTRUCTORA">
              <Dashboard />
            </ProtectedViewRoute>
          }
        />

        <Route
          path="/portal-instructoras/programacion"
          element={
            <ProtectedViewRoute view="PROGRAMACION">
              <Programacion />
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
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
