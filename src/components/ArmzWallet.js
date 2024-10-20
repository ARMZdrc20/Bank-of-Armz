import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ArmzStepFirstLogin from "./ArmzStepFirstLogin";
import ArmzStepSetPassword from "./ArmzStepSetPassword";
import ArmzStepImportWallet from "./ArmzStepImportWallet";
import ArmzStepWalletInfo from "./ArmzStepWalletInfo";
import ArmzShowPassword from "./ArmzShowPassword";
import { getWalletInfo } from "../services/walletService";
import ArmzStepLogin from "./ArmzStepLogin";
import {
  walletExist,
  connectWallet,
  moveToSetPassword,
  moveToImportWallet,
  moveToWalletInfo,
  deleteWallet,
  disconnectWallet,
  startedLoading,
  finishedLoading,
  updateWalletData,
  updateWalletInfo,
  moveToCreateWallet,
  handlePrivateKey,
} from "../redux/walletSlice";
import { getPublicAddress } from "../config/utils";
import ArmzStepNewInscription from "./ArmzStepNewInscription";
import ArmzSendDoge from "./ArmzSendDoge";
import ArmzSendNFT from "./ArmzSendNFT";
import ArmzSendDRC20 from "./ArmzSendDRC20";

const ArmzWallet = () => {
  const dispatch = useDispatch();
  const step = useSelector((state) => state.wallet.step);
  const loading = useSelector((state) => state.wallet.loading);
  const privateKey = useSelector((state) => state.wallet.privateKey);

  const forwardWalletInfo = (key) => {
    dispatch(handlePrivateKey(key));
    const taddress = getPublicAddress(key);
    dispatch(
      updateWalletData({
        address: taddress,
      })
    );
    dispatch(connectWallet());
    dispatch(startedLoading()); // setLoading(true);
    dispatch(moveToWalletInfo()); // setStep(4);
    getWalletInfo(taddress).then((result) => {
      dispatch(
        updateWalletInfo({
          balance: result.balance,
          utxos: result.utxos,
          nfts: result.nfts,
          drc20s: result.tokens,
        })
      );
      dispatch(finishedLoading()); // setLoading(false);
    });
  };
  const handleCreateWalletClick = (key) => {
    dispatch(handlePrivateKey(key));
    dispatch(moveToSetPassword()); // setStep(2);
  };
  const handleImportWalletClick = () => {
    dispatch(moveToImportWallet()); // setStep(3);
  };
  const handleConfirmedPassword = () => {
    const taddress = getPublicAddress(privateKey);
    dispatch(walletExist());
    dispatch(
      updateWalletData({
        address: taddress,
      })
    );
    dispatch(connectWallet());
    dispatch(startedLoading()); // setLoading(true);
    dispatch(moveToWalletInfo()); // setStep(4);
    getWalletInfo(taddress).then((result) => {
      dispatch(
        updateWalletInfo({
          balance: result.balance,
          utxos: result.utxos,
          nfts: result.nfts,
          drc20s: result.tokens,
        })
      );
      dispatch(finishedLoading()); // setLoading(false);
    });
  };
  const handleGoBackClick = () => {
    dispatch(moveToCreateWallet()); // setStep(1);
  };
  const handleImportedWalletClick = (key) => {
    // setPrivateKey(key);
    dispatch(handlePrivateKey(key));
    dispatch(moveToSetPassword()); // setStep(2);
  };
  const handleCancelPassword = () => {
    dispatch(moveToCreateWallet()); // setStep(existed ? 0 : 1);
  };

  if (step === 0)
    return <ArmzStepLogin forwardWalletInfo={forwardWalletInfo} />;
  else if (step === 1)
    return (
      <ArmzStepFirstLogin
        handleCreateWalletClick={handleCreateWalletClick}
        handleImportWalletClick={handleImportWalletClick}
      />
    );
  else if (step === 2)
    return (
      <ArmzStepSetPassword
        privateKey={privateKey}
        handleCancelPassword={handleCancelPassword}
        handleConfirmedPassword={handleConfirmedPassword}
      />
    );
  else if (step === 3)
    return (
      <ArmzStepImportWallet
        handleGoBackClick={handleGoBackClick}
        handleImportedWalletClick={handleImportedWalletClick}
      />
    );
  else if (step === 4) return <ArmzStepWalletInfo loading={loading} />;
  else if (step === 5) return <ArmzStepNewInscription />;
  else if (step === 6) return <ArmzSendDoge />;
  else if (step === 7) return <ArmzSendNFT />
  else if (step === 8) return <ArmzSendDRC20 />
  else if (step === 9) return <ArmzShowPassword />
};

export default ArmzWallet;
