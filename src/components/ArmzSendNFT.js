import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import GltfViewer from "./GltfViewer";
import BackImage from "../assets/ico_back.png";
import Row from "./Row";
import Col from "./Col";
import {
  finishedLoading,
  moveToWalletInfo,
  startedLoading,
  updateWalletInfo,
  updateMessage,
  clearMessage,
  // updateUTXOsData,
} from "../redux/walletSlice";
import { getUTXOs, getWalletInfo, sendNFT } from "../services/walletService";
import { convertUTXOData, isValidAddress } from "../config/utils";
import { NFT_IMAGE_URL } from "../config/constants";

const ArmzSendNFT = () => {
  const dispatch = useDispatch();

  const privateKey = useSelector((state) => state.wallet.privateKey);
  const address = useSelector((state) => state.wallet.address);
  const nftShouldSend = useSelector((state) => state.wallet.nftShouldSend);

  const [receiverAddress, setReceiverAddress] = useState();

  const handleBackClick = () => {
    dispatch(clearMessage());
    dispatch(moveToWalletInfo());
  };
  const handleSendNFTClick = async () => {
    if (isValidAddress(receiverAddress)) {
      const result = await getUTXOs(address);
      const result_temp = await getUTXOs(address, true);

      const nftUTXO = result_temp.utxos.find(
        (utxo) => utxo.txid === nftShouldSend.txid
      );
      const restructuredUTXO = {
        txid: nftUTXO.txid,
        vout: 0,
        script: nftUTXO.script_pubkey,
        satoshis: parseInt(nftUTXO.satoshis),
      };

      const result_doge = await sendNFT(
        privateKey,
        convertUTXOData(result.utxos),
        restructuredUTXO,
        receiverAddress
      );
      if (result_doge.success === true) {
        dispatch(moveToWalletInfo());
        dispatch(startedLoading()); // setLoading(true);
        getWalletInfo(address).then((result) => {
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
        dispatch(updateMessage({ message: "Send doge success" }));
        // console.log("Send doge success!", result_doge.hash);
      } else {
        // console.log("Send doge failed!");
        dispatch(updateMessage({ message: "Send doge failed!" }));
      }
    }
  };

  return (
    <Wrapper>
      <Row gap="20px">
        <BackButton onClick={handleBackClick} src={BackImage} />
        <WalletDescription>Send NFT</WalletDescription>
      </Row>
      <Col gap="15px">
        {nftShouldSend.imageType === "html" ? (
          <ImageIframe
            src={NFT_IMAGE_URL + "/" + nftShouldSend.inscriptionId}
          />
        ) : nftShouldSend.imageType === "image" ? (
          <ImageImage src={NFT_IMAGE_URL + "/" + nftShouldSend.inscriptionId} />
        ) : (
          <GltfViewer
            modelUrl={NFT_IMAGE_URL + "/" + nftShouldSend.inscriptionId}
          />
        )}
        <Row width="100%" gap="20px">
          <TokenAmountInput
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="Receiver address"
          />
        </Row>
        <InscribeButton onClick={handleSendNFTClick}>
          {isValidAddress(receiverAddress) ? "Send NFT" : "Enter valid address"}
        </InscribeButton>
      </Col>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  bottom: -25px;
  right: 0px;
  transform: translateY(100%);
  width: 450px;
  display: flex;
  flex-direction: column;
  padding: 40px 40px 20px 40px;
  border: 2px solid #efecc2;
  border-radius: 20px;
  background: radial-gradient(circle, #efecc21a, #f7f4cb1a);
  backdrop-filter: blur(42px);
  gap: 15px;
  justify-content: space-between;
  @media (max-width: 800px) {
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    height: fit-content;
  }
  @media (max-width: 550px) {
    width: 400px;
  }
  @media (max-width: 450px) {
    width: 300px;
  }
`;
const BackButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;
const WalletDescription = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
`;
const TokenAmountInput = styled.input`
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #c14f4f;
  color: #c14f4f;
  font-size: 20px;
  font-family: Livvic, sans-serif;
  background-color: transparent;
  padding: 15px 35px;
`;
const InscribeButton = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 30px;
  border: 2px solid #c14f4f;
  font-weight: bold;
  font-family: Livvic, sans-serif;
  font-size: 20px;
  color: #c14f4f;
  cursor: pointer;
  user-select: none;
  transition: 0.1s;
  &: hover {
    background-color: #eee;
  }
  &: active {
    background-color: #e5e5e5;
  }
`;
const ImageIframe = styled.iframe`
  width: 250px;
  height: 250px;
  color-scheme: initial;
  border: none;
  border-radius: 20px;
  margin-bottom: 30px;
  @media (max-width: 550px) {
    width: 200px;
    height: 200px;
    margin-bottom: 0px;
  }
`;
const ImageImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 20px;
  margin-bottom: 30px;
  @media (max-width: 550px) {
    width: 200px;
    height: 200px;
    margin-bottom: 0px;
  }
`;

export default ArmzSendNFT;
