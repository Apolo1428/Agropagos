import React, { useState, useEffect } from 'react';
import testSDTAbi from "../abi_tUSDT.json";
import "../styles/Message-box.css"
import Image from "../icono2.png"
import Image2 from "../icono1.png"


const { ethers } = require("ethers");

const USDT_CONTRACT_ADDRESS = "0xF904556F9c4902e17715d8CeFfe3CbdC86d0dFA8"; 
const USDT_ABI = testSDTAbi;

function EstadoCuenta(props) {
    const [balance, setBalance] = useState(null);
    const [ethAccount, setEthAccount] = useState(null);
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                // Solicita conexión a Metamask
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setEthAccount(accounts[0]);
                const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, signer);
                
                const address = await signer.getAddress();
                const balanceInWei = await usdtContract.balanceOf(address);
                const balanceInUSDT = ethers.formatUnits(balanceInWei, 18); // Formato USDT (6 decimales)
                
                setBalance(balanceInUSDT);
            } catch (error) {
                alert("Error al conectar con Metamask o al obtener saldo")
                console.error("Error al conectar con Metamask o al obtener saldo:", error);
            }
        } else {
            alert("Por favor, instala Metamask");
        }
    };
    /*
    const transmitirUSDT = async () => {
        try {
        const pago = ethers.parseUnits("1000", 18);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setEthAccount(accounts[0]);
        const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, signer);
        await usdtContract.transfer("0x3CcFa8d09a212Dc98A2dE830039Ea1c38302aD8F", pago);
    } catch (error) {
        alert("error, intente de nuevo");
        console.error("Error en la transferencia:", error);
    }
    }*/

    useEffect(() => {
        connectWallet();
    }, []);

    return (
        <div className = "contenedor">
            <div className="message-box">
                DETALLES DE LA CUENTA DE {props.company.toUpperCase()}
            </div>
            <div className="info-box">
                <div style={{width: "300px"}}> 
                    <h3>Información de cuenta</h3>
                    {balance !== null ? (
                        <div>
                        <p className = "greyp">Saldo total de USDT:</p>
                        <div style={{display: "flex"}}>
                        <img src={Image} className = "icon"></img>
                        <p>{balance} USDT </p>
                        </div>
                        </div>
                    ) : (
                        <div>
                        <p>Saldo de USDT:</p>
                        <p>Conectando a la cuenta...</p>
                        </div>
                    )}
                    <p className = "greyp">Dirección de contrato</p>
                    <div style={{display: "flex"}}>
                        <img src={Image} className = "icon"></img>
                        <p className = "address">{USDT_CONTRACT_ADDRESS}</p>
                    </div>
                </div> 
                <div className =  "vertical"></div>
                <div style={{width: "300px"}}> 
                    <h3>Información de billetera </h3>
                    <p className = "greyp">Wallet empleada</p>
                    <div style={{display: "flex"}}>
                        <img src={Image2} className = "icon"></img>
                        <p>Wallet Metamask</p>
                    </div>
                    <p className = "greyp">Dirección de la wallet</p>
                    <div style={{display: "flex"}}>
                        <img src={Image2} className = "icon"></img>
                        <p  className = "address">{ethAccount ? `${ethAccount}` : 'Connect Metamask'}</p>
                    </div>
                </div>
                <div className =  "vertical"></div>
                <div style={{width: "300px"}}>
                    <h3>Más detalles</h3>
                    <p className = "greyp">Saldo disponible</p>
                    <div style={{display: "flex"}}>
                        <img src={Image} className = "icon"></img>
                        <p>{balance} USDT</p>
                    </div>
                    <p className = "greyp">Saldo bloqueado</p>
                    <div style={{display: "flex"}}>
                        <img src={Image} className = "icon"></img>
                        <p>0.0 USDT</p>
                    </div>
                </div>
            </div>
            
        </div>
    );

}


export default EstadoCuenta;