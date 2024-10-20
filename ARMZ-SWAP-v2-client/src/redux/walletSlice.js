import { createSlice } from "@reduxjs/toolkit";

/* Step Information
 * 
 * Step0: Login Wallet Page
 * Step1: New Wallet Page
 * Step2: Set the password Page
 * Step3: Import the existed wallet Page
 * Step4: Information of the wallet Page
 * 
*/
const initialState = {
  privateKey: "",
  connected: false,
  existed: false,
  address: "",
  balance: 0,
  utxos: [],
  nfts: [],
  drc20s: [],
  
  show: false,
  step: 1,
  loading: false,
  toastMessage: "",

  swapState: 0, // 0: init, 1: loading, 2: success, 3: fail
  inscriptionTokenName: "",
  inscriptionTokenAmount: 0,

  nftShouldSend: {},
  drc20ShouldSend: {},
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    handlePrivateKey(state, action) {
      state.privateKey = action.payload;
    },
    walletExist(state) {
      state.existed = true;
      state.step = 0;
    },
    connectWallet(state) {
      state.connected = true;
      state.step = 4;
    },
    moveToCreateWallet(state) { // Moving to the create wallet
      state.step = 1;
    },
    moveToSetPassword(state) { // Moving to the set password
      state.step = 2;
    },
    moveToImportWallet(state) { // Moving to the import wallet
      state.step = 3;
    },
    moveToWalletInfo(state) { // Moving to the wallet info
      state.step = 4;
    },
    moveToNewInscription(state, action) { // Moving to the wallet info
      state.step = 5;
      state.swapState = 1;
      state.inscriptionTokenName = action.payload.inscriptionTokenName;
      state.inscriptionTokenAmount = action.payload.inscriptionTokenAmount;
    },
    moveToSendDoge(state) {
      state.step = 6;
    },
    moveToSendNFT(state, action) {
      state.step = 7;
      state.nftShouldSend = action.payload.nft;
    },
    moveToSendDRC20(state, action) {
      state.step = 8;
      state.drc20ShouldSend = {
        tick: action.payload.tick,
        ...action.payload.drc20
      }
    },
    moveToShowSecret(state) {
      state.step = 9;
    },
    deleteWallet(state) {
      state.existed = false;
      state.connected = false;
      state.step = 1;
    },
    disconnectWallet(state) {
      state.connected = false;
      state.step = 0; 
    },

    startedLoading(state) {
      state.loading = true;
    },
    finishedLoading(state) {
      state.loading = false;
    },
    updateWalletData(state, action) {
      state.address = action.payload.address;
    },
    updateUTXOsData(state, action) {
      state.utxos = action.payload.utxos;
    },
    updateWalletInfo(state, action) {
      state.balance = action.payload.balance;
      state.utxos = action.payload.utxos;
      state.nfts = action.payload.nfts;
      state.drc20s = action.payload.drc20s;
    },
    updateMessage(state, action) {
      state.toastMessage = action.payload.message;
    },
    clearMessage(state) {
      state.toastMessage = "";
    },

    swapInit(state) {
      state.swapState = 0;
    },
    swapSuccess(state) {
      state.swapState = 2;
    },
    swapFailed(state) {
      state.swapFailed = 3;
      state.toastMessage = "Swap failed!";
    },

    showDialog(state) {
      state.show = true;
    },
    hideDialog(state) {
      state.show = false;
    }
  },
});

export const {
  handlePrivateKey,
  walletExist,
  connectWallet,
  moveToCreateWallet,
  moveToSetPassword,
  moveToImportWallet,
  moveToNewInscription,
  moveToWalletInfo,
  moveToSendDoge,
  moveToSendNFT,
  moveToSendDRC20,
  moveToShowSecret,
  deleteWallet,
  disconnectWallet,

  startedLoading,
  finishedLoading,
  updateUTXOsData,
  updateWalletData,
  updateWalletInfo,
  updateMessage,
  clearMessage,

  swapInit,
  swapSuccess,
  swapFailed,

  showDialog,
  hideDialog
} = walletSlice.actions;
export default walletSlice.reducer;
