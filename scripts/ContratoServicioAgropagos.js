const hre = require("hardhat");

async function main() {
  
  Myaddress = "0x24CfF3De4e2d1Bafe7EE089e7FAe8090B2ac13ce";

  const ContratoServicioAgropagos = await hre.ethers.getContractFactory("ContratoServicioAgropagos");
  const contratoServicioAgropagos = await ContratoServicioAgropagos.deploy();
  /*
  const TestUSDT = await hre.ethers.getContractFactory("TestUSDT");
  const testUSDT = await TestUSDT.deploy();
  */
  
  /*
  console.log("Los TestUSDT se han desplegado exitosamente!");
  console.log("Address: ", testUSDT.target, testUSDT.address);
*/
  console.log("El contrato ha sido desplegado exitosamente!");
  console.log(contratoServicioAgropagos.target, contratoServicioAgropagos.target);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });