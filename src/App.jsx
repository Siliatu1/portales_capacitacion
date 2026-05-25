import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./rutas/routes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
