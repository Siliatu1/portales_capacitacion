import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./auth/LoginForm";
import Dashboard from "./Menu_principal/Dashboard";
import PanelPrincipal from "./Portal_Lineas_producto/PanelPrincipal";
import ProtectedViewRoute from "./auth/components/ProtectedViewRoute";

function App() {
  const user = null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<LoginForm />} />

        {/* Menú principal */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Portal Líneas de Producto */}
        <Route path="/lineas-producto" element={<PanelPrincipal />} />

        {/* Ruta 404 */}
        <Route path="*" element={<div>Error 404</div>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;