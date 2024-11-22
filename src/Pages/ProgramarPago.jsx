// SchedulePayment.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import "../styles/ProgramarPago.css"
import "../styles/Message-box.css"
//import testSDTAbi from "../abi_tUSDT.json";
import CONTRACT_ABI from "../abi_Contract.json";
import CONTRACT_BYTECODE from "../bytecode_contract.json";

import "../styles/Dashboard.css";
import { Contract } from 'ethers';

const { ethers } = require("ethers");

//const USDT_ABI = testSDTAbi;

const ProgramarPago = (props) => {
  const [connected, setConnected] = useState();
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [service, setService] = useState('');
  const [status, setStatus] = useState('');
  const connectWallet = async () => {
      if (window.ethereum) {
          try {
              // Solicita conexión a Metamask
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              const provider = new ethers.BrowserProvider(window.ethereum);
              const signer = await provider.getSigner();
              if (signer === null) {
                return;
              }
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
  
  const obtenerDireccion = async (nombre) => {
    const q = query(collection(db, "Empresas"), 
    where("Nombre", "==", nombre))
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const compDoc = querySnapshot.docs[0]; // Primer documento encontrado
        const compData = compDoc.data(); // Acceder a los datos del documento
        return compData.WalletMetaMask;
    } else {
        alert('Nombre compañía incorrecto');
        return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      try {
        // Solo se despliega en la red actual de la wallet
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const USDT_CONTRACT_ADDRESS = '0xF904556F9c4902e17715d8CeFfe3CbdC86d0dFA8'; 
        //para verificar datos
        const CONTRACTED_ADDRESS = await obtenerDireccion(company);
        if (CONTRACTED_ADDRESS === null) {
          return; 
        }
        const CONTRACT_AMOUNT = ethers.parseUnits(amount, 18);

        //base de datos
        
        // Crea el contrato
        const factory = new ethers.ContractFactory(CONTRACT_ABI, CONTRACT_BYTECODE, signer);
        try {
            const contract = await factory.deploy(); // Desplegar el contrato
            await contract.configurarContrato(
              service,
              CONTRACT_AMOUNT,
              CONTRACTED_ADDRESS,
              USDT_CONTRACT_ADDRESS
            );
            setStatus('Desplegando el contrato...');
            setStatus(`Contrato desplegado en: ${contract.target}`);
            await addDoc(collection(db, "PagosProgramados"), {
              addressContract: contract.target,
              addressContractor: signer.address,
              addressContracted: CONTRACTED_ADDRESS
            });
        } catch (error) {
            console.error(error);
            setStatus('Error al desplegar el contrato.');
        }
       // Configurar contrato
       // let contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        //console.log (await contract.servicioCompletado());

       
        //console.log(await contract.contratoConfigurado());
        
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
            <form className = 'left' onSubmit = {handleSubmit}> 
              <input
                type="text"
                placeholder="Nombre de la Empresa"
                onChange={(e) => setCompany_validate(e.target.value)}
                required
              />
              <br></br>
              <input
                type="text"
                placeholder="Servicio a Realizar"
                value={service}
                required
                onChange={(e) => setService(e.target.value)}
              />
              <br></br>
              <input
                type="number"
                placeholder="Monto a Pagar (USDT)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <br></br>
              <button type="submit">Programar Pago</button>
            </form>
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