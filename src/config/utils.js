import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "@bitcoinerlab/secp256k1";
import { BIP32Factory } from "bip32";
import dogecore from "bitcore-lib-doge";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import coininfo from 'coininfo';

import WarningAlert from "../components/WarningAlert";

import {
  NETWORKS,
  KEY_LOCALSTORAGE_PRIVATE_KEY,
  NotesData,
  SERVER_URL,
} from "./constants";

const { PrivateKey, Script } = dogecore;
const bip32 = BIP32Factory(ecc);
const dogecoin = coininfo.dogecoin.main.toBitcoinJS();

const satoshisToValue = (satoshis) => {
  return (satoshis / 100000000).toFixed(3);
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const isJsonString = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const hexToAscii = (hex) => {
  let asciiString = "";
  for (let i = 0; i < hex.length; i += 2) {
    let hexCode = hex.substr(i, 2);
    asciiString += String.fromCharCode(parseInt(hexCode, 16));
  }
  return asciiString;
};

const isMnemonic = (privateKey) => {
  return bip39.validateMnemonic(privateKey);
};

const isPrivateKey = (privateKey) => {
  if (PrivateKey.isValid(privateKey, NETWORKS.dogecoin) === true) return true;
  return false;
};

const isValidAddress = (address) => {
  try {
    const { version } = bitcoin.address.fromBase58Check(address);
    return version === dogecoin.pubKeyHash || version === dogecoin.scriptHash;
  } catch (e) {
    return false;
  }
}

const mnemonicToPrivateKey = (mnemonic) => {
  const seedBuffer = bip39.mnemonicToSeedSync(mnemonic, "");
  const rootNode = bip32.fromSeed(seedBuffer, NETWORKS.dogecoin);
  const addressNode = rootNode.derivePath("m/44'/3'/0'/0/0");
  return addressNode.toWIF();
};

const getPublicAddress = (privateKey) => {
  let publicAddress;

  if (isMnemonic(privateKey)) {
    const seedBuffer = bip39.mnemonicToSeedSync(privateKey, "");
    const rootNode = bip32.fromSeed(seedBuffer, NETWORKS.dogecoin);
    const addressNode = rootNode.derivePath("m/44'/3'/0'/0/0");
    const publicKey = addressNode.publicKey;
    publicAddress = bitcoin.payments.p2pkh({
      pubkey: publicKey,
      network: NETWORKS.dogecoin,
    }).address;
  } else {
    console.log("privateKey", privateKey);
    const t_privatekey = PrivateKey.fromWIF(privateKey);
    publicAddress = t_privatekey.toAddress().toString();
  }
  // console.log("Public Address:", publicAddress);
  return publicAddress;
};

const generateRandomPrivateKey = () => {
  const mnemonic = bip39.generateMnemonic(128);
  return mnemonic;
};

const removePrivateKey = () => {
  localStorage.removeItem(KEY_LOCALSTORAGE_PRIVATE_KEY);
};

const shortenAddress = (address) => {
  if (address.length <= 10) {
    return address; // No need to shorten if the string is 10 characters or less
  }

  const firstPart = address.slice(0, 5); // First 5 characters
  const lastPart = address.slice(-5); // Last 5 characters

  return `${firstPart}...${lastPart}`;
};

const shortenTransaction = (address) => {
  if (address.length <= 10) {
    return address; // No need to shorten if the string is 10 characters or less
  }

  const firstPart = address.slice(0, 5); // First 5 characters
  const lastPart = address.slice(-5); // Last 5 characters

  return `${firstPart}...${lastPart}`;
};

const formattedNumber = (number) => {
  return new Intl.NumberFormat("fr-FR").format(number);
};

const getArmzNotesList = (noteList) => {
  const itemList = [];
  for(let j = 0;j < noteList.length;j ++) {
    for (let i = NotesData.length - 1; i >= 0; i--) {
      if (NotesData[i].denomination === noteList[j].denomination) {
        itemList.push({
          image: NotesData[i].image,
          price: NotesData[i].denomination,
          count: parseInt(noteList[j].count),
        });
      }
    }
  }
  return itemList;
};

const alertAmountInvalidDialog = (text) =>
  confirmAlert({
    customUI: ({ onClose }) => {
      return <WarningAlert onClose={onClose} text={text} />;
    },
});

const convertUTXOData = (utxos) => {
  return utxos.map((utxo) => {
    return {
      txid: utxo.txid,
      vout: utxo.vout,
      script: utxo.script_pubkey,
      satoshis: parseInt(utxo.satoshis)
    }
  });
}

const getAvailableNoteCount = async () => {
  try {
    const result = await axios.get(`${SERVER_URL}/api/information/availablenote`);
    if(result.data.isSuccess === true) return result.data.data.amount;
    return 0;
  } catch (err) {
    console.log("Error occur getting available note count!");
    return 0;
  }
}

const getArmzInVault = async () => {
  try {
    const result = await axios.get(`${SERVER_URL}/api/information/armzinvault`);
    if(result.data.isSuccess === true) return result.data.data.amount;
    return 0;
  } catch (err) {
    console.log("Error occur getting available note count!");
    return 0;
  }
}

const getBalanceNFTList = async () => {
  try {
    const result = await axios.get(`${SERVER_URL}/api/information/nftbalance`);
    if(result.data.isSuccess === true) return result.data.data;
    return [];
  } catch (err) {
    console.log("Get balance error");
    return [];
  }
}

export {
  satoshisToValue,
  sleep,
  isMnemonic,
  isPrivateKey,
  formattedNumber,
  shortenAddress,
  shortenTransaction,
  getPublicAddress,
  generateRandomPrivateKey,
  removePrivateKey,
  getArmzNotesList,
  alertAmountInvalidDialog,
  mnemonicToPrivateKey,
  convertUTXOData,
  isValidAddress,
  isJsonString,
  hexToAscii,
  getAvailableNoteCount,
  getArmzInVault,
  getBalanceNFTList
};
