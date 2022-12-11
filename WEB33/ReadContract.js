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
const ABIPath = `${__dirname}/JSON/testABI.json`; //Please always link ABI :)

const readTX = async (contractAddress, info) => {
  try {
    const web3 = new Web3(netURL);
    let ABI = JSON.parse(await fs.readFile(ABIPath, "utf8"));
    let isMethodThere = false;
    for (let i = 0; i < ABI.length; i++) {
      if (ABI[i].name === info.methodName) {
        isMethodThere = true;
        break;
      }
    }
    ABI = isMethodThere ? ABI : await getABI(contractAddress, chain);
    const contract = new web3.eth.Contract(ABI, contractAddress);
    let data = -1;
    contract.methods[info.methodName]
      .apply(this, info.args)
      .call((err, res) => {
        if (err) throw err;
        data = res;
      });
    return data;
  } catch (e) {
    console.log(e);
  }
};

module.exports = readTX;
