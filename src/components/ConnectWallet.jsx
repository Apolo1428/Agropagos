import React, { useState } from 'react';
import { ethers } from 'ethers';
function ConnectWallet() {
    const [ethAccount, setEthAccount] = useState(null);
    // Conectar a Metamask (Ethereum)
    const connectMetamask = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setEthAccount(accounts[0]);
            } catch (error) {
                console.error("Error connecting to Metamask", error);
            }
        } else {
            alert("Metamask not installed!");
        }
    };


    return (
        <div>
            <h2>Connect Wallets</h2>
            <button onClick={connectMetamask}>
                {ethAccount ? `Metamask: ${ethAccount}` : 'Connect Metamask'}
            </button>
        </div>
    );
}

export default ConnectWallet;
