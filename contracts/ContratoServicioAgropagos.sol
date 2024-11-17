// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
contract ContratoServicioAgropagos is Ownable {
    // Variables del contrato
    string public nombreServicio;
    uint256 public pagoPactado;
    address public contratista;
    bool public servicioCompletado;
    bool public contratoCompletado;
    bool public contratoConfigurado = false;

    // Dirección del token USDT en la red
    ERC20 public usdtToken;

    // Constructor para inicializar el contrato
    constructor () Ownable(msg.sender) {
        servicioCompletado = false;
        contratoCompletado = false;
    }
    function configurarContrato(
        string memory _nombreServicio,
        uint256 _pagoPactado,
        address _contratista,
        address _usdtTokenAddress
    ) external onlyOwner {
        require(!contratoConfigurado, "El servicio ya ha sido configurado!, no puede reconfigurar!");
        contratoConfigurado = true;
        nombreServicio = _nombreServicio;
        pagoPactado = _pagoPactado;
        contratista = _contratista;
        usdtToken = ERC20(_usdtTokenAddress);
    }
    // Función para completar el servicio, solo ejecutable por el owner
    function marcarServicioCompletado() external onlyOwner {
        require(contratoConfigurado, "El servicio no ha sido configurado");
        servicioCompletado = true;
    }

    // Función para ejecutar el pago, verificando las condiciones necesarias
    function ejecutarPago() external onlyOwner {
        if (!servicioCompletado) {
            console.log("---------> El servicio no ha sido completado!, marque completar o solicitelo al contratante");
        }
        if (contratoCompletado) {
            console.log("---------> El contrato ya ha sido completado, no puede cobrarlo!");
        }
        require(contratoConfigurado, "El servicio no ha sido configurado");
        require(servicioCompletado, "El servicio no ha sido marcado como completado");
        require(!contratoCompletado, "El contrato ya ha sido completado");
        require(usdtToken.balanceOf(owner()) >= pagoPactado, "Saldo insuficiente en el contratante");
        require(
            usdtToken.allowance(owner(), address(this)) >= pagoPactado,
            "El contrato no tiene allowance suficiente"
        );

        // Transferir USDT del owner al contratista
        usdtToken.transferFrom(owner(), contratista, pagoPactado);
        contratoCompletado = true;
    }

    // Función para que el contratista realice el pago manualmente
    function cobrarServicio() external {
        if (!servicioCompletado) {
            console.log("---------> El servicio no ha sido completado!, marque completar o solicitelo al contratante");
        }
        if (contratoCompletado) {
            console.log("---------> El contrato ya ha sido completado, no puede cobrarlo!");
        }
        require(contratoConfigurado, "El servicio no ha sido configurado");
        require(msg.sender == contratista, "Solo el contratista puede ejecutar esta funcion");
        require(servicioCompletado, "El servicio no ha sido marcado como completado");
        require(!contratoCompletado, "El contrato ya ha sido completado");
        require(usdtToken.balanceOf(owner()) >= pagoPactado, "Saldo insuficiente en el contratante");
        require(
            usdtToken.allowance(owner(), address(this)) >= pagoPactado,
            "El contrato no tiene allowance suficiente"
        );

        // Transferir USDT del owner al contratista
        usdtToken.transferFrom(owner(), contratista, pagoPactado);
        contratoCompletado = true;
    }

    // Función para obtener el estado del servicio
    function obtenerEstadoServicio() external view returns (bool) {
        return servicioCompletado;
    }

    // Función para obtener el estado del contrato
    function obtenerEstadoContrato() external view returns (bool) {
        return contratoCompletado;
    }

    // Función para obtener el pago pactado
    function obtenerPagoPactado() external view returns (uint256) {
        return pagoPactado;
    }
    // Función para establecer el contrato del token USDT (solo owner)
    function setUsdtToken(ERC20 _usdtToken) external onlyOwner {
        usdtToken = _usdtToken;
    }
}