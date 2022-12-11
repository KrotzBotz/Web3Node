const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

//-------------------- STATIC VARIABLES --------------------//

const apiToken = process.env.ETHERSCAN_TOKEN;

const getABI = async (address, chain) => {
  const testnet = chain === "mainnet" ? "" : `-${chain}`;
  const stuff = await axios.get(
    `https://api${testnet}.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${apiToken}`
  );
  if (stuff.data.status === "1") return JSON.parse(stuff.data.result);
};

module.exports = getABI;
