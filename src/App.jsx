import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login/Login";
import MenuPrincipal from "./Menu_principal/componente/MenuPrincipal";
import Panel from "./Portal_Lineas_producto/pages/Panel";
import FormHeladeria from "./Portal_Lineas_producto/pages/FormHeladeria";
import FormRestaurante from "./Portal_Lineas_producto/pages/FromRestaurante";
import ControlAsistencia from "./Portal_Lineas_producto/pages/ControlAsistencia";
import FormTodera from "./Portal_Lineas_producto/pages/FormTodera";
import ProtectedViewRoute from "./auth/components/ProtectedViewRoute";

function App() {
  const user = null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Menú principal */}
        <Route path="/menu" element={<MenuPrincipal />} />

        {/* Portal Líneas de Producto */}
        <Route path="/lineas-producto" element={<ProtectedViewRoute view="PANEL"><Panel /></ProtectedViewRoute>} />
        <Route path="/lineas-producto/form-heladeria" element={<ProtectedViewRoute view="FORM_HELADERIA"><FormHeladeria /></ProtectedViewRoute>} />
        <Route path="/lineas-producto/form-restaurante" element={<ProtectedViewRoute view="FORM_RESTAURANTE"><FormRestaurante /></ProtectedViewRoute>} />
        <Route path="/lineas-producto/control-asistencia" element={<ProtectedViewRoute view="CONTROL_ASISTENCIA"><ControlAsistencia /></ProtectedViewRoute>} />
        <Route path="/lineas-producto/form-todera" element={<ProtectedViewRoute view="FORM_TODERA"><FormTodera /></ProtectedViewRoute>} />

        {/* Ruta protegida (ejemplo) */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <div>Bienvenido </div> 
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
