const Provider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const fs = require("fs").promises;
const dotenv = require("dotenv");
dotenv.config();

//--------------------- LOCAL  IMPORTS ----------------------//

const getABI = require("./GetAbi.js");

//-------------------- STATIC VARIABLES --------------------//

const chain = process.env.CURRENT_CHAIN;
const infuraToken = process.env.INFURA_TOKEN;
const netURL = `https://${chain}.infura.io/v3/${infuraToken}`;
const ABIPath = `${__dirname}/JSON/testABI.json`; //Please always link ABI
const wallet = process.env.ADDRESS_1;
const privateKey = process.env.PRIVATE_KEY_1;

const writeTX = async (contractAddress, info) => {
  try {
    const provider = new Provider(privateKey, netURL);
    const web3 = new Web3(provider);
    let ABI = JSON.parse(await fs.readFile(ABIPath, "utf8"));
    let isMethodThere = false;
    for (let i = 0; i < ABI.length; i++) {
      if (ABI[i].name === info.methodName) {
        isMethodThere = true;
        break;
      }
    }
    ABI = isMethodThere ? ABI : getABI(contractAddress, chain);
    const myContract = new web3.eth.Contract(ABI, contractAddress);
    const receipt = await myContract.methods[info.methodName]
      .apply(this, info.args)
      .send({ from: wallet });
    console.log(`Transaction hash: ${receipt.transactionHash}`); // route to database
  } catch (e) {
    console.log(e);
  }
};

module.exports = writeTX;
