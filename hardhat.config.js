
/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Traer la infomacion de .env
// console.log(process.env) remove this after you've confirmed it is working

const { REACT_APP_RED_POLYGON, REACT_APP_RED_ETHEREUM, REACT_APP_CLAVE_PRIVADA } = process.env;

module.exports = {
  solidity: "0.8.27", 
  //configurar la red de Polygon
  networks: {
    polygon: {
      url: REACT_APP_RED_POLYGON,
      accounts: [`0x${REACT_APP_CLAVE_PRIVADA}`],
    },
    // red ethereum
    ethereum: {
      url:  REACT_APP_RED_ETHEREUM,
      accounts: [`0x${REACT_APP_CLAVE_PRIVADA}`],
    },
  },
};
