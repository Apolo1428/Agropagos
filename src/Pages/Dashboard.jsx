import React, { useState } from 'react';
import EstadoPagos from './EstadoPagos';
import ProgramarPago from './ProgramarPago';
import EstadoCuenta from './EstadoCuenta';
import Inicio from './Inicio';
import '../App.css';
import { FaCreditCard } from 'react-icons/fa';
import { FaListUl} from 'react-icons/fa';
import { FaWallet} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import "../styles/Sidebar.css"

const Dashboard = (props) => {
    const [selectedOption, setSelectedOption] = useState('Inicio');
    const [buttonstate, setButtonState] = useState(true);
    const renderContent = () => {
        switch (selectedOption) {
            case 'Inicio':
                return <Inicio/>
            case 'Estado de pagos':
                return <EstadoPagos company = {props.company}/>;
            case 'Programar pago':
                return <ProgramarPago company = {props.company}/>;
            case 'Estado de cuenta':
                return <EstadoCuenta company = {props.company}/>;
            default:
                return <Inicio />;
        }
    };

    const [isOpen, setIsopen] = useState(false);
    const renderButton = () => {
        if (buttonstate){
            return <button className = 'botonSidebar' onClick={ToggleSidebar}>+</button> 
        }
        else{
            return <button className = 'botonSidebar' onClick={ToggleSidebar}>-</button> 
        }
    }

    const ToggleSidebar = () => {
        buttonstate === true ? setButtonState(false) : setButtonState(true);
        isOpen === true ? setIsopen(false) : setIsopen(true);
    }
    return (
            <div><Navbar sendValue={setSelectedOption}></Navbar>
            <div className="flex">
                <nav className = {`sidebar ${isOpen == true ? 'active' : ''}`}>
                    <ul>
                        <li onClick={() => setSelectedOption('Estado de pagos')}>
                            <FaListUl className = 'iconoSB'></FaListUl>
                            <a>Estado de pagos
                            </a>
                        </li>
                        <li onClick={() => setSelectedOption('Programar pago')}>
                            <FaCreditCard className = 'iconoSB'></FaCreditCard>
                            <a>Programar pago
                            </a>
                        </li>
                        <li onClick={() => setSelectedOption('Estado de cuenta')}>
                            <FaWallet className = 'iconoSB'></FaWallet>
                            <a>Estado de cuenta 
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className = "content" id = "contenedor">
                    {renderButton()}
                    {renderContent()}
                </div>
            </div>
            </div>
    )
};

export default Dashboard;
