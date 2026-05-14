import Navbar from "../components/Navbar";
import HorariosTable from "../components/HorariosTable";
import ModalActividad from "../components/ModalActividad";
import ProfileModal from "../components/ProfileModal";

function ProgramacionHorarios() {
  return (
    <div>
      <Navbar />

      <HorariosTable />

      <ModalActividad />

      <ProfileModal />
    </div>
  );
}

export default ProgramacionHorarios;