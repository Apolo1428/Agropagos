//MODIFCADO FINAL
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { jsPDF } from "jspdf"; // Importar jsPDF

import "../styles/ProgramarPago.css"
import "../styles/Message-box.css"
//import testSDTAbi from "../abi_tUSDT.json";
import CONTRACT_ABI from "../abi_Contract.json";
import CONTRACT_BYTECODE from "../bytecode_contract.json";

import "../styles/Dashboard.css";
import { Contract } from 'ethers';

const { ethers } = require("ethers");

const ProgramarPago = (props) => {
  const [connected, setConnected] = useState();
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [service, setService] = useState('');
  const [status, setStatus] = useState('');
  const [address_pdf, setAddressPDF] = useState('');

  const lista_empresas = ["Agrolmos", "Camposol", "Danper", "Drokasa", "Inca Frut", "Louis Dreyfus Peru", "Viru"];
  
  const dict_empresas = {
    "Agrolmos": "20547999691",
    "Camposol": "20340584237",
    "Danper": "20170040938",
    "Drokasa": "20262786511",
    "Inca Frut": "20102269617",
    "Louis Dreyfus Peru": "20415077565",
    "Viru": "20373860736"
  }
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        if (signer === null) {
          return;
        }
        setConnected(true);
      } catch (error) {
        alert("Error al conectar con Metamask");
        console.error("Error al conectar con Metamask:", error);
      }
    } else {
      alert("Por favor, instala Metamask");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);
  const setCompany_validate = (a) => {
    if (lista_empresas.includes(a) && a !== props.company) {
      setCompany(a);
    }
    else{
      setCompany("");
    }
  }
  const obtenerDireccion = async (nombre) => {
    const q = query(collection(db, "Empresas"), where("Nombre", "==", nombre));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const compDoc = querySnapshot.docs[0];
      const compData = compDoc.data();
      return compData.WalletMetaMask;
    } else {
      alert('Nombre compañía incorrecto');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const USDT_CONTRACT_ADDRESS = '0xF904556F9c4902e17715d8CeFfe3CbdC86d0dFA8'; 
        const CONTRACTED_ADDRESS = await obtenerDireccion(company);
        if (CONTRACTED_ADDRESS === null) {
          return; 
        }
        const CONTRACT_AMOUNT = ethers.parseUnits(amount, 18);
        const factory = new ethers.ContractFactory(CONTRACT_ABI, CONTRACT_BYTECODE, signer);
        try {
          const contract = await factory.deploy(
            CONTRACT_AMOUNT,
            CONTRACTED_ADDRESS,
            USDT_CONTRACT_ADDRESS,
          );
          setAddressPDF(contract.target);
          setStatus('Desplegando el contrato...');
          setStatus(`Contrato desplegado en: ${contract.target}`);
          await addDoc(collection(db, "PagosProgramados"), {
            addressContract: contract.target,
            addressContractor: signer.address,
            addressContracted: CONTRACTED_ADDRESS,
            amount: amount,
            company: company,
            service: service,
            status: 'pendiente',
          });
        } catch (error) {
          console.error(error);
          setStatus('Error al desplegar el contrato.');
        }
      } catch (error) {
        alert("Error al conectar con Metamask");
        console.error("Error al conectar con Metamask:", error);
      }
    } else {
      alert("Por favor, instala Metamask");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Comprobante de pago emitido en contingencia", 105, 20, { align: "center" });
  
    doc.setLineWidth(0.5);
    doc.rect(10, 30, 190, 28);
    doc.setFontSize(10);
    doc.text("Emisor electrónico obligatorio", 15, 40);
    doc.text(`RUC: ${dict_empresas[props.company]}`, 15, 45); 
    const facturaCode = `F-${Math.floor(Math.random() * 1000000).toString().padStart(6, "0")}`;
    doc.text(`Código de factura: ${facturaCode}`, 15, 50);
  
    doc.setFontSize(12);
    doc.text("Empresa contratista:", 10, 65);
    doc.setFont("helvetica", "normal");
    doc.text(company || "N/A", 60, 65);
  
    doc.setFont("helvetica", "bold");
    doc.text("RUC:", 10, 72);
    doc.setFont("helvetica", "normal");
    doc.text(dict_empresas[company], 60, 72); // Reemplazar con la variable de RUC
  
    const today = new Date().toLocaleDateString();
    doc.setFont("helvetica", "bold");
    doc.text("Fecha de emisión:", 10, 79);
    doc.setFont("helvetica", "normal");
    doc.text(today, 60, 79);
    doc.setFont("helvetica", "bold");
    doc.text("Dirección de contrato inteligente:", 10, 86);
    doc.setFont("helvetica", "normal");
    doc.text(address_pdf, 80, 86);
    const startY = 100;
    doc.setFont("helvetica", "bold");
    doc.text("Cantidad", 15, startY);
    doc.text("Descripción", 70, startY);
    doc.text("Valor de venta (USDT)", 150, startY);
  
    doc.line(10, startY-8 + 2, 200, startY-8 + 2); // Línea superior

    doc.line(10, startY + 2, 200, startY + 2); // Línea media
    doc.line(10, startY + 42, 200, startY + 42);
    doc.line(10, startY + 50, 200, startY + 50);  // Línea inferior  
  
    doc.line(10, startY-8 + 2, 10, startY + 50); // Izquierda
    doc.line(60, startY-8 + 2, 60, startY + 50); 
    doc.line(140, startY-8 + 2, 140, startY + 50); 
    doc.line(200, startY-8 + 2, 200, startY + 50); // Derecha
  
    doc.setFont("helvetica", "normal");
    doc.text("1", 30, startY + 8);
    doc.text(service || "N/A", 70, startY + 8);
    doc.text(amount || "0.00", 193, startY + 8, { align: "right" });

    doc.text("Monto total", 15, startY + 48);
    doc.text(amount || "0.00", 193, startY + 48, { align: "right" });
  
    doc.setFont("helvetica", "italic");
    doc.text("Gracias por su confianza.", 105, startY+69, { align: "center" });
  
    doc.save("factura_venta.pdf");
  };
  return (
    <div className="contenedor">
      <div className="ProgramarPagos">
        <div className="message-box">
          PROGRAMAR UN CONTRATO INTELIGENTE
        </div>
        {connected !== null ? (
          <div className="info-box">
            <form className="left" onSubmit={handleSubmit}> 
            <select onChange={(e) => setCompany(e.target.value)}>
                <option>Escoge una empresa</option>
                {lista_empresas.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
              <br />
              <input
                type="text"
                placeholder="Servicio"
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
              />
              <br />
              <input
                type="number"
                placeholder="Monto a Pagar (USDT)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <br />
              <button type="submit">Programar Pago</button>
            </form>
            <div className="vertical"></div>
            <div className="right">
              <h3>Detalles del contrato</h3>
              <p><b>Empresa contratante:</b> {props.company}</p>
              <p><b>Empresa contratista:</b> {company}</p>
              <p><b>Servicio:</b> {service}</p>
              <p><b>Monto a pagar:</b> {amount} USDT</p>
              <p><b>Estatus:</b> {status}</p>
              <button onClick={generatePDF}>Descargar Factura</button>
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
};

export default ProgramarPago;



