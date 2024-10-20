import CryptoJS from "crypto-js";

import { KEY_BACKUP_STATE, KEY_LOCALSTORAGE_PRIVATE_KEY } from "./constants";
import { hexToAscii } from "./utils";

const getPrivateKeyFromLocalStorage = (password) => {
  const storedPrivateKey = localStorage.getItem(KEY_LOCALSTORAGE_PRIVATE_KEY);
  if (!storedPrivateKey) return undefined;
  if (password === undefined) return storedPrivateKey;
  const hexPrivateKey = CryptoJS.AES.decrypt(
    storedPrivateKey,
    password
  ).toString();
  // console.log("HEX", hexPrivateKey);
  const privateKey = hexToAscii(hexPrivateKey);
  // console.log("PRIVATEKEY", privateKey);
  return privateKey;
};

const setPrivateKeyToLocalStorage = (privateKey, password) => {
  const data = CryptoJS.AES.encrypt(privateKey, password).toString();
  localStorage.setItem(KEY_LOCALSTORAGE_PRIVATE_KEY, data);
};

const isBackuped = () => {
  const backupState = localStorage.getItem(KEY_BACKUP_STATE);
  if (backupState === undefined) return false;
  if (backupState === "true") return true;
  return false;
}

const setBackupState = () => {
  localStorage.setItem(KEY_BACKUP_STATE, "true");
}

const removeBackupState = () => {
  localStorage.removeItem(KEY_BACKUP_STATE);
}

export {
    getPrivateKeyFromLocalStorage,
    setPrivateKeyToLocalStorage,
    isBackuped,
    setBackupState,
    removeBackupState
};