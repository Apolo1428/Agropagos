import React, { useState, useEffect } from "react";
//import { ethers } from "ethers";
import { db } from '../firebase'; 
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import "../styles/Dashboard.css"
const EstadoPagos = () => {
    const [pagosProgramados, setPagosProgramados] = useState([]);
    const contractAddress = "ADDRESS_OF_DEPLOYED_CONTRACT"; // Reemplaza con tu dirección

    const completeService = async (pago) => {
      const { service, company, amount, id } = pago;
    }
  
      /*try {
          // Conectar con la blockchain y el contrato inteligente
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []); // Solicita acceso a MetaMask
  
          const signer = provider.getSigner();
  
          // Aquí debes colocar la dirección de tu contrato y el ABI del contrato
          const contractAddress = "DIRECCIÓN_DEL_CONTRATO";
          const contractABI = [
              "function completeService(string memory service, string memory company, uint256 amount) public returns (string memory)"
          ];
  
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
          // Llamar a completeService en el contrato
          const transaction = await contract.completeService(service, company, amount);
          await transaction.wait(); // Esperar a que la transacción sea confirmada
  
          console.log("Servicio completado con éxito:", service, "Pago realizado a:", company);
  
          const pagoRef = doc(db, "PagosProgramados", id);
          await updateDoc(pagoRef, {
              status: "Completado"
          });
  
          alert(`Servicio ${service} completado y pagado ${amount} USDT a ${company}.`);
      } catch (error) {
          console.error("Error al completar el servicio:", error);
          alert("Hubo un problema al procesar el pago.");
      }
    };
    useEffect(() => {
    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "PagosProgramados"));
        const pagos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            amount: doc.data().amount,
            company: doc.data().company,
            service: doc.data().service,
            status: doc.data().status
        }));
        setPagosProgramados(pagos);
    };
    fetchData();
    }, []);
*/


    return (
        <div className = "contenedor">
            <div className="table-container">
                <div className="table-header">
                    <div className="table-cell">Empresa</div>
                    <div className="table-cell">Servicio</div>
                    <div className="table-cell">Monto</div>
                    <div className="table-cell">Estado</div>
                    <div className="table-cell">Gestión</div>
                </div>
                <div className="table-body">
                    {pagosProgramados.map((pago) => (
                        <div key={pago.id} className="table-row">
                            <div className="table-cell">{pago.company}</div>
                            <div className="table-cell">{pago.service}</div>
                            <div className="table-cell">{pago.amount}</div>
                            <div className="table-cell">{pago.status}</div>
                            <div className="table-cell">
                                {pago.status === "Pendiente" && (
                                    <button onClick={() => completeService(pago.service, pago.id, pago.company, pago.amount)}>
                                        Confirmar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default EstadoPagos;
