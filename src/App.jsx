import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login/Login";
import MenuPrincipal from "./Menu_principal/componente/MenuPrincipal";
import Panel from "./Portal_Lineas_producto/pages/Panel";


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
        <Route path="/lineas-producto" element={<Panel />} />

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