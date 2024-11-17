import { useNavigate } from "react-router-dom"
import '../App.css';
import "../styles/Navbar.css"
import Image from "../logoAgropagos.png"

const Navbar = ( {sendValue} ) => {
    const navigate = useNavigate();
    const gotoLogin = () => {
    localStorage.setItem("mycompany", JSON.stringify(0));
       navigate("/Login");
    }
    const handleClick = () => {
        sendValue("Inicio");
    }

    return (
        <div className = "navbar">
            <img src={Image} width="90"></img>
            <button onClick={handleClick}>Inicio</button>
            <button>Servicios</button>
            <button>Clientes</button>
            <button>Soporte</button>
            <button>Contacto</button>
            <button onClick={gotoLogin}>Cerrar sesión</button>
        </div> 

    )
}

export default Navbar;