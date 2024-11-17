// SchedulePayment.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import "../styles/ProgramarPago.css"
import "../styles/Message-box.css"
import testSDTAbi from "../abi_tUSDT.json";
import contractAbi from "../abi_Contract.json";
import "../styles/Dashboard.css";
const { ethers } = require("ethers");

const USDT_CONTRACT_ADDRESS = "0xF904556F9c4902e17715d8CeFfe3CbdC86d0dFA8"; 
const USDT_ABI = testSDTAbi;
const CONCTRACT_ABI = contractAbi;

const ProgramarPago = (props) => {
  const [connected, setConnected] = useState(null);
  const [ethAccount, setEthAccount] = useState(null);
  const [company, setCompany] = useState(null);
  const [amount, setAmount] = useState(null);
  const [service, setService] = useState(null);

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
        const REACT_APP_CLAVE_PRIVADA = process.env.REACT_APP_CLAVE_PRIVADA;

        alert(REACT_APP_CLAVE_PRIVADA);
        const provider = new ethers.providers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        const wallet = new ethers.Wallet('5e56e523afd74d81ae87b77031fcafa018d3b30eb4586a60d1e49ca691796834', provider);

          // Solicita conexión a Metamask
          /*await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setEthAccount(accounts[0]);
          const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, signer);
          
          const address = await signer.getAddress();
          const balanceInWei = await usdtContract.balanceOf(address);
          const balanceInUSDT = ethers.formatUnits(balanceInWei, 18); // Formato USDT (6 decimales)
          
          setBalance(balanceInUSDT);*/
      } catch (error) {
          alert("Error al conectar con Metamask o al obtener saldo")
          console.error("Error al conectar con Metamask o al obtener saldo:", error);
      }
    } else {
          alert("Por favor, instala Metamask");
    }
  }

  const lista_empresas = ["Agrolmos", "Camposol", "Danper"];
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
        <div class="message-box">
            PROGRAMAR UN CONTRATO INTELIGENTE
        </div>
        {connected !== null ? (
          <div class="info-box">
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
            <div class = "vertical"></div>
            <div className = "right">
              <h3>Detalles del contrato</h3>
              <p><b>Empresa contratante:</b> {props.company}</p>
              <p><b>Empresa contratista:</b> {company}</p>
              <p><b>Servicio:</b> {service} </p>
              <p><b>Monto a pagar:</b> {amount} USDT </p>
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