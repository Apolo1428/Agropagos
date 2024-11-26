// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract ContratoServicioSimple is Ownable {
    uint256 public pagoPactado;
    address public contratista;
    bool public contratoCompletado;
    ERC20 public usdtToken;
    constructor (
        uint256 _pagoPactado,
        address _contratista,
        address _usdtTokenAddress
    ) Ownable(msg.sender) {
        pagoPactado = _pagoPactado;
        contratista = _contratista;
        contratoCompletado = false;
        usdtToken = ERC20(_usdtTokenAddress);
    }

    function ejecutarPago() external onlyOwner {
        require(!contratoCompletado, "1");
        require(usdtToken.balanceOf(owner()) >= pagoPactado, "2");
        require(usdtToken.allowance(owner(), address(this)) >= pagoPactado,"3");

        usdtToken.transferFrom(owner(), contratista, pagoPactado);
        contratoCompletado = true;
    }

    // Función para que el contratista realice el pago manualmente
    function cobrarServicio() external {
        require(msg.sender == contratista, "4");
        require(!contratoCompletado, "1");
        require(usdtToken.balanceOf(owner()) >= pagoPactado, "3");
        require(usdtToken.allowance(owner(), address(this)) >= pagoPactado,"El contrato no tiene allowance suficiente");

        usdtToken.transferFrom(owner(), contratista, pagoPactado);
        contratoCompletado = true;
    }

}