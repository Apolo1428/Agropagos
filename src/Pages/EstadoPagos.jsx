import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { db } from '../firebase'; 
import { query, updateDoc, collection, getDocs, where, doc } from "firebase/firestore";
import CONTRACT_ABI from "../abi_Contract.json";

const EstadoPagos = () => {
    const [pagosProgramados, setPagosProgramados] = useState([]);
    let signer;
    /*
    const temporal = async (e) => {
        e.preventDefault();
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        let contract;
        let amount;
        let service
        const contr_address = addMan;
        const q = query(collection(db, "PagosProgramados"),
        where("addressContract", "==", contr_address));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
           // for (let i = 0; i<=4;i++){
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data(); // Acceder a los datos del documento
                const CONTRACT_ADDRESS = userData.addressContract;
                contract = new ethers.Contract(contr_address, CONTRACT_ABI, signer);
                /*contract.configurarContrato(
                    'Servicio prueba 4',
                    ethers.parseUnits("45",18),
                    '0x3CcFa8d09a212Dc98A2dE830039Ea1c38302aD8F',
                    '0xF904556F9c4902e17715d8CeFfe3CbdC86d0dFA8'
                )
                amount = await contract.pagoPactado();
                amount = (amount/ethers.parseUnits("1",18)).toString();
                service = await contract.nombreServicio();
                console.log(amount, service, await contract.contratoConfigurado());
                await updateDoc(userDoc.ref, {
                    amount: amount,
                    service: service,
                    status: "pendiente"
                })
                alert("hecho");
            //}
        }
    }*/

        /*
        await addDoc(collection(db, "Usuarios"), {
            username: username,
            password: password,
            email: email,
            company: company
        });
        await updateDoc(pagoRef, {
            status: "Completado"
        });*/
    
    /*
    const completeService = async (pago) => {
      const { service, company, amount, id } = pago;
  
      try {
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
*/
    const marcarCompletado = async (addressContract, addressContractor, id) => {
        try {
            console.log(addressContract,addressContractor);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            const contract = new ethers.Contract(addressContract, CONTRACT_ABI, signer);
            await contract.marcarServicioCompletado();

            const pagoRef = doc(db, "PagosProgramados", id);
            await updateDoc(pagoRef, {
                status: "por pagar"
            });
        } catch (error) {
            console.error(error);
            alert("Error, marque otra vez o reinicie.");
        }
        
    }
    const pagarContrato = async (addressContract, addressContractor, id) => {
        try{
            console.log(addressContract,addressContractor);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            const contract = new ethers.Contract(addressContract, CONTRACT_ABI, signer);
            await contract.ejecutarPago();
            console.log("Funciona");

            const pagoRef = doc(db, "PagosProgramados", id);
            await updateDoc(pagoRef, {
                status: "completado"
            });
        }catch (error) {
            console.error(error);
            alert("Error, marque otra vez o reinicie.");
        }
        
    }
    useEffect(() => {
        const fetchData = async () => {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            const q = query(collection(db, "PagosProgramados"),where("addressContractor", "==", signer.address))
            const querySnapshot = await getDocs(q);
            const pagos = querySnapshot.docs.map(doc => ({
                id: doc.id,
                addressContract: doc.data().addressContract,
                addressContractor: doc.data().addressContractor,
                amount: doc.data().amount,
                company: doc.data().company,
                service: doc.data().service,
                status: doc.data().status
            }));
            setPagosProgramados(pagos);
        };
        fetchData();
    }, []);
    return (
        <div>
            <div className="table-container">
                <div className="table-header">
                    <div className="table-cell">Empresa</div>
                    <div className="table-cell">Servicio</div>
                    <div className="table-cell">Monto</div>
                    <div className="table-cell">Estado</div>
                    <div className="table-cell">Gestión</div>
                    <div className="table-cell">Pagar</div>
                </div>
                <div className="table-body">
                    {pagosProgramados.map((pago) => (
                        <div key={pago.id} className="table-row">
                            <div className="table-cell">{pago.company}</div>
                            <div className="table-cell">{pago.service}</div>
                            <div className="table-cell">{pago.amount}</div>
                            <div className="table-cell">{pago.status}</div>
                            <div className="table-cell">
                                {pago.status === "pendiente" && (
                                    <button onClick={() => marcarCompletado(pago.addressContract, pago.addressContractor, pago.id)}>
                                        Marcar Completado
                                    </button>
                                )}
                            </div>
                            <div className="table-cell">
                                {pago.status !== "completado" && (
                                    <button onClick={() => pagarContrato(pago.addressContract, pago.addressContractor, pago.id)}>
                                        Pagar
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

/*
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
            </div> */