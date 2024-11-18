// SchedulePayment.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import "../styles/ProgramarPago.css"
import "../styles/Message-box.css"
import testSDTAbi from "../abi_tUSDT.json";
import CONTRACT_ABI from "../abi_Contract.json";
import CONTRACT_BYTECODE from "../bytecode_contract.json";
import "../styles/Dashboard.css";

const { ethers, JsonRpcProvider } = require("ethers");

const USDT_CONTRACT_ADDRESS = "0xF904556F9c4902e17715d8CeFfe3CbdC86d0dFA8";
const CONTRACT_ADDRESS = "0xAd9BfF9a883Ac80ea619B110CAbbF9569482324a"
const USDT_ABI = testSDTAbi;

const ProgramarPago = (props) => {
  const [connected, setConnected] = useState();
  const [ethAccount, setEthAccount] = useState(null);
  const [company, setCompany] = useState(null);
  const [amount, setAmount] = useState();
  const [service, setService] = useState();
  const [status, setStatus] = useState('');
  const connectWallet = async () => {
      if (window.ethereum) {
          try {
              // Solicita conexión a Metamask
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              const provider = new ethers.BrowserProvider(window.ethereum);
              const signer = await provider.getSigner();
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              setConnected(true);
              
          } catch (error) {
              alert("Error al conectar con Metamask o al obtener saldo")
              console.error("Error al conectar con Metamask o al obtener saldo:", error);
          }
      } else {
          alert("Por favor, instala Metamask");
      }
  };
  
  useEffect(() => {
        connectWallet();
  }, []);
  


  const handleSchedulePayment = async (e) => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const factory = new ethers.ContractFactory(CONTRACT_ABI, CONTRACT_BYTECODE, signer);
    
        try {
            const contract = await factory.deploy(); // Despliega el contrato
            setStatus('Desplegando el contrato...');
            setStatus(`Contrato desplegado en: ${contract.target}`);
        } catch (error) {
            console.error(error);
            setStatus('Error al desplegar el contrato.');
        }
      } catch (error) {
          alert("Error al conectar con Metamask o al obtener saldo")
          console.error("Error al conectar con Metamask o al obtener saldo:", error);
      }
    } else {
          alert("Por favor, instala Metamask");
    }
  }

  const lista_empresas = ["Agrolmos", "Camposol", "Danper", "Drokasa", "Inca Frut", "Louis Dreyfus Peru", "Viru"];
  const setCompany_validate = (a) => {
    if (lista_empresas.includes(a) && a !== props.company) {
      setCompany(a);
    }
    else{
      setCompany("");
    }
  }
  return (
    <div className = "contenedor">
      <div className = "ProgramarPagos">
        <div className ="message-box">
            PROGRAMAR UN CONTRATO INTELIGENTE
        </div>
        {connected !== null ? (
          <div className ="info-box">
            <div className = 'left'> 
              <input
                type="text"
                placeholder="Nombre de la Empresa"
                onChange={(e) => setCompany_validate(e.target.value)}
              />
              <br></br>
              <input
                type="text"
                placeholder="Servicio a Realizar"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
              <br></br>
              <input
                type="number"
                placeholder="Monto a Pagar (USDT)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <br></br>
              <button onClick={handleSchedulePayment}>Programar Pago</button>
            </div>
            <div className = "vertical"></div>
            <div className = "right">
              <h3>Detalles del contrato</h3>
              <p><b>Empresa contratante:</b> {props.company}</p>
              <p><b>Empresa contratista:</b> {company}</p>
              <p><b>Servicio:</b> {service} </p>
              <p><b>Monto a pagar:</b> {amount} USDT </p>
              <p><b>Estatus:</b> {status} </p>
            </div>
          </div>
          ) : (
              <div>
              <p>Error! La cuenta no pudo ser conectada.</p>
              </div>
          )}

      </div>
    </div>
  );
}

export default ProgramarPago;