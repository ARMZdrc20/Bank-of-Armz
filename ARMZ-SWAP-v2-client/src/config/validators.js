import { MAIN_TOKEN_NAME } from "./constants";
import { isValidAddress, isMnemonic, isPrivateKey } from "./utils";

const validatePassword = (password) => {
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (password.length > minLength && hasLetter && hasNumber) {
    return true;
  }
  return false;
};

const validateInscriptionAmountArmz = (count, drc20s) => {
  const currentDRC20 = drc20s.find(drc20 => drc20.tick === MAIN_TOKEN_NAME);
  if(!currentDRC20) return false;
  if (count <= parseInt(currentDRC20.total)) return true;
  return false;
};

const validateKey = (privateKey) => {
  if (isMnemonic(privateKey) === true) return true;
  if (isPrivateKey(privateKey) === true) return true;
  return false;
};

const validateAddress = (address) => {
  if(isValidAddress(address)) return true;
  return false;
}

export { validatePassword, validateInscriptionAmountArmz, validateKey, validateAddress };
