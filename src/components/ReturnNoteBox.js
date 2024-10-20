import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import {
  NoteImages,
  SERVER_URL,
  SERVER_WALLET_ADDRESS,
} from "../config/constants";
import axios from "axios";
import {
  getUTXOs,
  sendNFT,
} from "../services/walletService";
import { convertUTXOData } from "../config/utils";
import { Spinner } from "@chakra-ui/react";

const ReturnNoteBox = () => {
  const existed = useSelector((state) => state.wallet.existed);
  const connected = useSelector((state) => state.wallet.connected);
  const privateKey = useSelector((state) => state.wallet.privateKey);
  const address = useSelector((state) => state.wallet.address);
  const nfts = useSelector((state) => state.wallet.nfts);

  const [validNFTs, setValidNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const [sendResult, setSendResult] = useState(-1);

  useEffect(() => {
    if (existed && connected) {
      (async () => {
        if (existed && connected) {
          const data = nfts.map((nft) => nft.inscriptionId);
          const result_validNFTs = await axios.post(
            `${SERVER_URL}/api/transaction/validNFT`,
            { inscriptionIds: data }
          );
          const tvalidNFTs = result_validNFTs.data.data;

          console.log("ValidNFT", tvalidNFTs);
          const tempArray = [];
          for (let i = 0; i < tvalidNFTs.length; i++) {
            for (let j = 0; j < nfts.length; j++) {
              if (tvalidNFTs[i].inscriptionId === nfts[j].inscriptionId) {
                tempArray.push({
                  active: false,
                  ...tvalidNFTs[i],
                  ...nfts[j],
                });
              }
            }
          }
          setValidNFTs(tempArray);
        }
        setSendResult(-1);
      })();
    }
  }, [existed, connected, nfts]);

  const handleNoteItemClick = (inscriptionId) => {
    setActive(inscriptionId);
  };
  const returnNote = async (nft) => {
    try {
      const result = await getUTXOs(address);
      const result_temp = await getUTXOs(address, true);
      console.log(nft);
      const nftUTXO = result_temp.utxos.find((utxo) => utxo.txid === nft.txid);
      const restructuredUTXO = {
        txid: nftUTXO.txid,
        vout: 0,
        script: nftUTXO.script_pubkey,
        satoshis: parseInt(nftUTXO.satoshis),
      };
      console.log("HELLO");
      const result_doge = await sendNFT(
        privateKey,
        convertUTXOData(result.utxos),
        restructuredUTXO,
        SERVER_WALLET_ADDRESS,
        true
      );
      console.log("Result:", result_doge);

      if (result_doge.success === true) {
        console.log("Inscription transfer succeed!");
        console.log("Hash:", result_doge.hash);
        setSendResult(1);
        return result_doge.hash;
      } else {
        setSendResult(0);
        console.log("Inscription transfer Failed!");
        return undefined;
      }
    } catch (err) {
      setSendResult(0);
      console.log("While Sending Transfer Inscription Error!");
      return undefined;
    }
  };
  const handleReturnButtonClick = async () => {
    // if (active === -1) return;
    // setLoading(true);

    // const validNFT = validNFTs.find((item) => item.inscriptionId === active);

    // const result_doge = await returnNote(validNFT);
    // console.log("result_doge", result_doge);
    // if (result_doge) {
    //   console.log("Send doge success!", result_doge);
    //   const result_temp = await axios.post(
    //     `${SERVER_URL}/api/transaction/swapNFTToArmz`,
    //     {
    //       sender: address,
    //       txid: result_doge,
    //       amount: validNFT.denomination,
    //       inscriptionId: validNFT.inscriptionId,
    //     }
    //   );
    //   console.log("Register to the server:", result_temp.data.data);
    // } else console.log("Send doge failed!");

    // setLoading(false);
  };

  return (
    <ReturnBoxWrapper>
      <ReturnTitle>Swap</ReturnTitle>
      <ReturnDescription>Trade tokens in an instant</ReturnDescription>
      <NFTGrid>
        {validNFTs.map((nft, index) => (
          <NFTItem
            src={NoteImages[nft.denomination.toString()].image}
            key={index}
            active={active === nft.inscriptionId}
            onClick={() => handleNoteItemClick(nft.inscriptionId)}
          />
        ))}
      </NFTGrid>
      <Hr />
      <ResultWrapper>
        <Result>
          {validNFTs.reduce(
            (prev, nft) =>
              nft.inscriptionId === active ? prev + nft.denomination : prev,
            0
          )}
        </Result>
      </ResultWrapper>
      <ResultSwap>
        {sendResult === 1
          ? "Succeed! You will receive armz token in short time!"
          : sendResult === 0
          ? "Failed! Not enough Balance"
          : ""}
      </ResultSwap>
      {loading === false ? (
        <ReturnButton onClick={handleReturnButtonClick}>Return</ReturnButton>
      ) : (
        <Spinner color="#c14f4f" width={30} height={30} />
      )}
    </ReturnBoxWrapper>
  );
};

const ReturnBoxWrapper = styled.div`
  padding: 30px 40px;
  min-width: 530px;
  width: 530px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: radial-gradient(circle, #efecc280, #f7f4cb);
  border: 2px solid #efecc2;
  border-radius: 20px;
  align-items: center;
  @media (max-width: 700px) {
    width: fit-content;
    min-width: fit-content;
    padding: 20px;
  }
`;
const ReturnTitle = styled.div`
  font-family: Livvic, sans-serif;
  font-size: 32px;
  font-weight: bold;
  color: #c14f4f;
  width: 100%;
  @media (max-width: 500px) {
    text-align: center;
  }
`;
const ReturnDescription = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
  font-weight: bold;
  width: 100%;
  @media (max-width: 500px) {
    text-align: center;
  }
`;
const ResultWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const Result = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
`;
const ReturnButton = styled.div`
  margin-top: 50px;
  border: 3px solid #c14f4f;
  max-width: 250px;
  width: 100%;
  height: 60px;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Livvic, sans-serif;
  font-weight: 400;
  border-radius: 30px;
  color: #c14f4f;
  font-size: 24px;
  cursor: pointer;
  user-select: none;
  transition: 0.1s;
  &: hover {
    background-color: #c14f4f;
    color: white;
  }
  &: active {
    background-color: #c14f4fc0;
    color: white;
  }
`;
const NFTGrid = styled.div`
  width: 100%;
  display: grid;
  justify-content: space-between;
  grid-template-columns: auto auto auto;
  gap: 25px 10px;
`;
const NFTItem = styled.img`
  width: 130px;
  border: ${(props) => (props.active ? "2px solid red" : "none")};
  cursor: pointer;
  user-select: none;
`;
const Hr = styled.hr`
  color: #c14f4f;
  border: 1px solid #c14f4f;
  width: 100%;
  margin: 0px;
`;
const ResultSwap = styled.div`
  width: 100%;
  font-size: 20px;
  color: #c14f4f;
  text-align: center;
`;
export default ReturnNoteBox;
