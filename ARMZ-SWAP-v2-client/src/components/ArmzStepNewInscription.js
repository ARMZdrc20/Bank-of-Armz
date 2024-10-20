import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import BackImage from "../assets/ico_back.png";
import Row from "./Row";
import Col from "./Col";
import {
  MAIN_TOKEN_NAME,
  SERVER_URL,
} from "../config/constants";
import {
  moveToWalletInfo,
  swapFailed,
  swapSuccess,
  // updateUTXOsData,
} from "../redux/walletSlice";
import {
  inscriptionTransfer,
  sendDRC20Inscription,
  getUTXOs,
  getTransactionInfo,
  getDRC20UTXOs,
} from "../services/walletService";
import { convertUTXOData, sleep } from "../config/utils";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";

const ArmzStepNewInscription = () => {
  const dispatch = useDispatch();

  const inscriptionTokenName = useSelector(
    (state) => state.wallet.inscriptionTokenName
  );
  const inscriptionTokenAmount = useSelector(
    (state) => state.wallet.inscriptionTokenAmount
  );
  const drc20s = useSelector((state) => state.wallet.drc20s);
  const address = useSelector((state) => state.wallet.address);
  const privateKey = useSelector((state) => state.wallet.privateKey);

  const [drc20InscriptionUtxos, setDrc20InscriptionUtxos] = useState([]);
  const [shouldInscribeList, setShouldInscribeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let t_drc20Utxos = await getDRC20UTXOs(address, MAIN_TOKEN_NAME);
      let t_drc20InscriptionUtxos = [];
      let t_shouldInscribeList = [];

      let i, j, k;
      if (inscriptionTokenAmount) {
        for (k = 0; k < t_drc20Utxos.length; k++)
          if (t_drc20Utxos[k].amount === inscriptionTokenAmount) break;
        if (k !== t_drc20Utxos.length) {
          t_drc20InscriptionUtxos.push(t_drc20Utxos[k]);
          t_drc20Utxos = t_drc20Utxos
            .slice(0, k)
            .concat(t_drc20Utxos.slice(k + 1));
        } else {
          t_shouldInscribeList.push(inscriptionTokenAmount);
        }
        console.log("DRC20UTXOs:", t_drc20InscriptionUtxos);
        console.log("ShouldInscribe:", t_shouldInscribeList);
        setDrc20InscriptionUtxos(t_drc20InscriptionUtxos);
        setShouldInscribeList(t_shouldInscribeList);
      }
      setLoading(false);
    })();
  }, [inscriptionTokenAmount]);

  const createTransferInscription = async (amount) => {
    try {
      let newUTXOs = await getUTXOs(address);
      let utxos = convertUTXOData(newUTXOs.utxos);
      console.log(utxos);

      const result = await inscriptionTransfer(
        privateKey,
        utxos,
        inscriptionTokenName,
        amount
      );
      console.log("Inscription transfer result:", result);

      if (result.success === true) {
        while (1) {
          console.log("Hash:", result.hash);
          const txinfo = await getTransactionInfo(result.hash);
          console.log("txinfo:", txinfo);
          if (txinfo && txinfo.data.data.confirmations !== undefined)
            return txinfo.data.data;
          await sleep(5000);
        }
      } else {
        console.log("Inscription transfer Failed!");
        return undefined;
      }
    } catch (err) {
      console.log("While inscription error occured!");
      return undefined;
    }
  };
  const sendTransferInscritption = async (tdrc20Utxo) => {
    try {
      const result = await getUTXOs(address);
      const drc20Utxo = {
        txid: tdrc20Utxo.txid,
        satoshis: tdrc20Utxo.satoshis,
        vout: tdrc20Utxo.vout,
        script: tdrc20Utxo.script,
      };

      const possibleNFT = await axios.get(
        `${SERVER_URL}/api/transaction/possibleNFT?denomination=${tdrc20Utxo.amount}`
      );
      if (possibleNFT.isSuccess === false) {
        console.log("Not available anymore!");
        return undefined;
      }
      console.log("PossibleNFT:", possibleNFT);

      const result_sending = await sendDRC20Inscription(
        privateKey,
        convertUTXOData(result.utxos),
        drc20Utxo,
        possibleNFT.data.data.address,
        true
      );
      console.log("Result:", result_sending);

      if (result_sending.success === true) {
        // while (1) {
        //   console.log("Hash:", result_sending.hash);
        //   const txinfo = await getTransactionInfo(result_sending.hash);
        //   console.log("txinfo:", txinfo);
        //   if (txinfo && txinfo.data.data.confirmations !== undefined)
        //     return {
        //       hash: txinfo.data.data.hash,
        //       amount: possibleNFT.data.data.denomination,
        //       inscriptionId: possibleNFT.data.data.inscriptionId,
        //       address: possibleNFT.data.data.address,
        //     };
        //   await sleep(5000);
        // }
        console.log("Inscription transfer Success!");
        return {
          hash: result_sending.hash,
          amount: possibleNFT.data.data.denomination,
          inscriptionId: possibleNFT.data.data.inscriptionId,
          address: possibleNFT.data.data.address,
        };
      } else {
        console.log("Inscription transfer Failed!");
        return undefined;
      }
    } catch (err) {
      console.log("While Sending Transfer Inscription Error!");
      return undefined;
    }
  };
  const handleBackButton = () => {
    dispatch(swapFailed());
    dispatch(moveToWalletInfo());
  };
  const handleSendButtonClick = async () => {
    setLoading(true);
    for (let i = 0; i < drc20InscriptionUtxos.length; i++) {
      const result = await sendTransferInscritption(drc20InscriptionUtxos[i]);

      if (result === undefined) {
        dispatch(swapFailed());
        dispatch(moveToWalletInfo());
        return;
      }

      console.log("Inscribing transaction succeed!", result);
      const result_temp = await axios.post(
        `${SERVER_URL}/api/transaction/swapArmzToNFT`,
        {
          sender: address,
          txid: result.hash,
          amount: result.amount,
          inscriptionId: result.inscriptionId,
          address: result.address,
        }
      );
      console.log("Register transaction to the server succeed!", result_temp);

      if (result_temp === undefined || result_temp.data.isSuccess === false) {
        dispatch(swapFailed());
        dispatch(moveToWalletInfo());
        return;
      }

      const t_drc20InscriptionUtxos = drc20InscriptionUtxos;
      t_drc20InscriptionUtxos[i].isSent = true;
      setDrc20InscriptionUtxos(t_drc20InscriptionUtxos);
    }
    setLoading(false);
    dispatch(swapSuccess());
    dispatch(moveToWalletInfo());
  };
  const handleInscriptionButtonClick = async () => {
    setLoading(true);
    for (let i = 0; i < shouldInscribeList.length; i++) {
      const result = await createTransferInscription(shouldInscribeList[i]);
      if (result === undefined) {
        dispatch(swapFailed());
        dispatch(moveToWalletInfo());
        return;
      }
      setDrc20InscriptionUtxos((tdrc20InscriptionUtxos) => {
        return [
          {
            inscriptionId: result.txid + "i0",
            txid: result.txid,
            amount: shouldInscribeList[i],
            vout: 0,
            satoshis: 100000,
            script: result.vout[0].scriptPubKey.hex,
          },
          ...tdrc20InscriptionUtxos,
        ];
      });
    }
    setLoading(false);
    setShouldInscribeList([]);
    console.log("DRC20:", drc20InscriptionUtxos);
  };

  const inscriptionAmount = shouldInscribeList.reduce(
    (prev, amount) => prev + amount,
    0
  );

  const currentDRC20 = drc20s.find(drc20 => drc20.tick === inscriptionTokenName);

  return (
    <Wrapper>
      <Row gap="20px">
        <BackButton src={BackImage} onClick={handleBackButton} />
        <WalletDescription>{inscriptionTokenName}</WalletDescription>
      </Row>
      <Col>
        <WalletDescription>
          Balance: {parseInt(currentDRC20.total)}
        </WalletDescription>
        <WalletDescription>
          Available: {parseInt(currentDRC20.available)}
        </WalletDescription>
        <WalletDescription>
          Inscribed:{" "}
          {parseInt(currentDRC20.total) -
            parseInt(currentDRC20.available)}
        </WalletDescription>
      </Col>
      <InscriptionListWrapper>
        <InscriptionBoxTitle>Pre-Inscriptions</InscriptionBoxTitle>
        {drc20InscriptionUtxos.map((item, index) => (
          <InscriptionListItem key={index}>
            <TokenImage src={currentDRC20.image} />
            <WalletDescription>{item.amount}</WalletDescription>
            <WalletDescription>{inscriptionTokenName}</WalletDescription>
            {item.isSent === true && (
              <WalletDescription>Sent</WalletDescription>
            )}
          </InscriptionListItem>
        ))}
        {inscriptionAmount === 0 && loading === false && (
          <SendButton onClick={handleSendButtonClick}>Send</SendButton>
        )}
      </InscriptionListWrapper>
      <InscriptionWrapper>
        <InscriptionBoxTitle>New Inscription</InscriptionBoxTitle>
        {loading === false ? (
          <>
            <Row gap="15px">
              <TokenImage
                src={currentDRC20.image}
              />
              <TokenAmountInput value={inscriptionAmount} />
              <WalletDescription>{inscriptionTokenName}</WalletDescription>
            </Row>
            {inscriptionAmount !== 0 && (
              <InscribeButton onClick={handleInscriptionButtonClick}>
                Inscribe
              </InscribeButton>
            )}
          </>
        ) : (
          <Col>
            <Spinner color="#c14f4f" width={30} height={30} />
          </Col>
        )}
      </InscriptionWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  bottom: -25px;
  right: 0px;
  transform: translateY(100%);
  width: 550px;
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
    height: fit-content;
  }
  @media (max-width: 450px) {
    width: 300px;
  }
`;
const BackButton = styled.img`
  width: 20px;
  height: 20px;
`;
const WalletDescription = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
  @media (max-width: 550px) {
    font-size: 20px;
  }
`;
const InscriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border: 1px solid #c14f4f;
  border-radius: 20px;
  background: transparent;
  padding: 20px;
`;
const InscriptionBoxTitle = styled(WalletDescription)`
  width: 100%;
`;
const TokenImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  @media (max-width: 550px) {
    display: none;
  }
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
  @media (max-width: 550px) {
    padding: 15px 25px;
  }
  @media (max-width: 450px) {
    padding: 15px;
  }
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
  @media (max-width: 550px) {
    padding: 15px 25px;
    font-size: 18px;
  }
  @media (max-width: 450px) {
    padding: 15px;
    height: 40px;
    font-size: 16px;
  }
`;
const InscriptionListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border: 1px solid #c14f4f;
  border-radius: 20px;
  padding: 20px;
`;
const InscriptionListItem = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background-color: #dfdcb2;
  gap: 10px;
  user-select: none;
  cursor: pointer;
  &: hover {
    background-color: #bdba90;
  }
`;
const SendButton = styled.div`
  width: 200px;
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

export default ArmzStepNewInscription;
