const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContratoServicioAgropagos", function () {
    let owner, contratista, usdtToken, contratoServicio;
    const pago = ethers.parseUnits("1000", 18); 
    beforeEach(async function () {
        // Obtener los signers
        [owner, contratista] = await ethers.getSigners();

        // Desplegar el contrato TestUSDT
        const TestUSDT = await ethers.getContractFactory("TestUSDT");
        usdtToken = await TestUSDT.deploy();

        // Desplegar el contrato ContratoServicioAgropagos
        const ContratoServicioAgropagos = await ethers.getContractFactory("ContratoServicioAgropagos");
        contratoServicio = await ContratoServicioAgropagos.deploy();
        contratoServicio.connect(owner).configurarContrato(
            "Servicio de Prueba",
            pago, // Pago pactado de 1000 USDT
            contratista.address,
            usdtToken.target
        )
        // Transferir USDT al contratista y aprobar el contrato
        await usdtToken.connect(owner).approve(contratoServicio.target, pago); // aprobar 1000 USDT para usar en el contrato.
    });

    it("debería ejecutar el pago al completar el servicio", async function () {
        console.log("    ╔══════════════╗")
        console.log("    ║Verificación 1║")
        console.log("    ╚══════════════╝")

        var contratistaBalance = await usdtToken.balanceOf(contratista.address);
        console.log("      USDT del contratista: ", contratistaBalance.toString());

        // Marcar el servicio como completado (solo el owner puede hacerlo)
        await contratoServicio.connect(owner).marcarServicioCompletado();

        // Ejecutar el pago
        await contratoServicio.connect(owner).ejecutarPago();

        // Verificar que el contrato esté completado
        const contratoCompletado = await contratoServicio.obtenerEstadoContrato();
        expect(contratoCompletado).to.equal(true);
        console.log("      Contrato finalizado.");
        // Verificar el saldo de USDT del owner
        contratistaBalance = await usdtToken.balanceOf(contratista.address);
        console.log("      USDT del contratista (luego de pago): ", contratistaBalance.toString());
        expect(contratistaBalance).to.equal(pago);
    });

    it("Debería revertir si el servicio no está completado", async function () {
        console.log("    ╔══════════════╗")
        console.log("    ║Verificación 2║")
        console.log("    ╚══════════════╝")
        // Intentar ejecutar el pago sin completar el servicio
        console.log("      El contratista trata de cobrar servicio");
        console.log("      El contrato devuelve el mensaje:");
        await expect(
            contratoServicio.connect(contratista).cobrarServicio()
        ).to.be.revertedWith("El servicio no ha sido marcado como completado");

    });

    it("Debería revertir si el contrato ya está completado", async function () {
        // Marcar el servicio como completado
        console.log("    ╔══════════════╗")
        console.log("    ║Verificación 3║")
        console.log("    ╚══════════════╝")
        console.log("      El contratante trata de pagar el servicio dos o más veces");
        console.log("      El contrato devuelve el mensaje:");
        await contratoServicio.connect(owner).marcarServicioCompletado();

        // Ejecutar el pago por primera vez
        await contratoServicio.connect(owner).ejecutarPago();

        // Intentar ejecutar el pago nuevamente
        await expect(
            contratoServicio.connect(owner).ejecutarPago()
        ).to.be.revertedWith("El contrato ya ha sido completado");
        console.log("\n      El contratista trata de cobrar por servicio dos o más veces");
        console.log("      El contrato devuelve el mensaje:");
        await expect(
            contratoServicio.connect(contratista).cobrarServicio()
        ).to.be.revertedWith("El contrato ya ha sido completado");
    });

    it("El contratista debería poder cobrar por su servicio", async function () {
        console.log("    ╔══════════════╗")
        console.log("    ║Verificación 4║")
        console.log("    ╚══════════════╝")

        var contratistaBalance = await usdtToken.balanceOf(contratista.address);
        console.log("      USDT del contratista: ", contratistaBalance.toString());

        // Marcar el servicio como completado (solo el owner puede hacerlo)
        await contratoServicio.connect(owner).marcarServicioCompletado();
        // Cobrar el servicio
        await contratoServicio.connect(contratista).cobrarServicio();

        // Verificar que el contrato esté completado
        const contratoCompletado = await contratoServicio.obtenerEstadoContrato();
        expect(contratoCompletado).to.equal(true);
        console.log("      Contrato finalizado.");
        // Verificar el saldo de USDT del owner
        contratistaBalance = await usdtToken.balanceOf(contratista.address);
        console.log("      USDT del contratista (luego de pago): ", contratistaBalance.toString());
        expect(contratistaBalance).to.equal(pago);
    });
    it("El contrato no debe poder ser reconfigurado", async function () {
        console.log("    ╔══════════════╗")
        console.log("    ║Verificación 5║")
        console.log("    ╚══════════════╝")

        await expect(contratoServicio.connect(owner).configurarContrato(
            "Servicio de Prueba reconfigurado",
            ethers.parseUnits("2000", 18), // Pago pactado de 2000 USDT
            contratista.address,
            usdtToken.target
        )).to.be.revertedWith("El servicio ya ha sido configurado!, no puede reconfigurar!");
    });

});
