// contracts/MockUSDC.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestUSDT is ERC20{
    // Este contrato crea USDCT de prueba para simular transacciones
    uint256 public constant USDT_TO_DEPLOY = 50000 * 10 ** 18; // Agregar 500 UDT 

    constructor() ERC20("Test USDT", "tUSDT") {
        _mint(msg.sender,  USDT_TO_DEPLOY); // Enviar al msg.sender, en este caso el owner
    }
}