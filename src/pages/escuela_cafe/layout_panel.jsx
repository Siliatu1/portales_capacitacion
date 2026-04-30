import Headeria from "./Heladeria"
import Restaurante from "./Restaurante"



const LayoutPanel = () => { 

const [permisos, setPermisos] = useState(localStorage.getItem("permisos") || "")



    return (

        <div className="container">
            
           <div style={{ display: permisos.Restaurante === true  || permisos.SuerAdmin === true  ? "grid" : "none" }}> 
        
            <p onClick={()=>setModuloRes(true)}>Restaurante</p>

         { setModuloRes === true && <Restaurante />}
            

           </div>

                <div style={{ display: permisos.Heladeria === true  || permisos.SuerAdmin === true  ? "grid" : "none" }}> 
        
            <p>Heladera</p>
           
           </div>
           
        </div>
    )
    }

export default LayoutPanel    