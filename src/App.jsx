import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login/Login";


function App() {
  const user = null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

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