import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import BackImage from "../assets/ico_back.png";
import Row from "./Row";
import Col from "./Col";
import {
  clearMessage,
  finishedLoading,
  moveToWalletInfo,
  startedLoading,
  updateMessage,
  updateWalletInfo,
  // updateUTXOsData,
} from "../redux/walletSlice";
import {
  getDRC20UTXOs,
  getUTXOs,
  getWalletInfo,
  inscriptionTransfer,
  sendDRC20Inscription,
} from "../services/walletService";
import { convertUTXOData, isValidAddress } from "../config/utils";
import { Spinner } from "@chakra-ui/react";

const InscriptionListItem = (props) => {
  const dispatch = useDispatch();
  const privateKey = useSelector((state) => state.wallet.privateKey);
  const address = useSelector((state) => state.wallet.address);
  const [receiver, setReceiver] = useState("");

  const handleSendInscriptionClick = async () => {
    if (isValidAddress(receiver)) {
      const result = await getUTXOs(address);
      const drc20Utxo = {
        txid: props.utxo.txid,
        satoshis: props.utxo.satoshis,
        vout: props.utxo.vout,
        script: props.utxo.script,
      };
      const result_sending = await sendDRC20Inscription(
        privateKey,
        convertUTXOData(result.utxos),
        drc20Utxo,
        receiver,
        false
      );
      if (result_sending.success === true) {
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
        dispatch(updateMessage({message: "Send doge success!"}));
        // console.log("Send doge success!", result_sending.hash);
      } else {
        // console.log("Send doge failed!");
        props.handleSend("Send doge failed!");
      }
    }
  };
  return (
    <Col width="100%" gap="10px">
      <Row
        justify="space-between"
        width="100%"
        gap="5px"
        onClick={props.handleClick}
      >
        <Row justify="flex-start">
          <TickerImage src={props.image} />
          <SmallText>
            {props.utxo.amount} {props.tick}
          </SmallText>
        </Row>
        <TransferButton onClick={props.handleClick}>
          {props.selectedUtxo === props.utxo.txid ? "Cancel" : "Transfer"}
        </TransferButton>
      </Row>
      {props.selectedUtxo === props.utxo.txid && (
        <Col gap="10px">
          <TokenAmountInput
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <InscribeButton onClick={handleSendInscriptionClick}>
            {isValidAddress(receiver) ? "Transfer" : "Enter valid address"}
          </InscribeButton>
        </Col>
      )}
    </Col>
  );
};

const ArmzSendDRC20 = (props) => {
  const dispatch = useDispatch();

  const privateKey = useSelector((state) => state.wallet.privateKey);
  const address = useSelector((state) => state.wallet.address);
  const drc20ShouldSend = useSelector((state) => state.wallet.drc20ShouldSend);

  const [loading, setLoading] = useState(true);
  const [drc20Utxos, setDRC20Utxos] = useState([]);
  const [selectedUtxo, setSelectedUtxo] = useState(-1);
  const [newInscribe, setNewInscribe] = useState(false);
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [visibleToast, setVisibleToast] = useState(false);

  useEffect(() => {
    (async () => {
      const t_drc20Utxos = await getDRC20UTXOs(address, drc20ShouldSend.tick);
      setDRC20Utxos(t_drc20Utxos);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (visibleToast) {
        const timer = setTimeout(() => {
          setVisibleToast(false);
        }, 2000); // Text will fade out after 2 seconds
        return () => clearTimeout(timer); // Cleanup the timer on unmount or re-render
    }
  }, [visibleToast]);

  const handleBackClick = () => {
    dispatch(clearMessage());
    dispatch(moveToWalletInfo());
  };
  const handleSendDRC20Click = async () => {
    if (newInscribe === false) {
      setNewInscribe(true);
      setSelectedUtxo(false);
    } else {
      setNewInscribe(false);
      const result = await getUTXOs(address);
      const result_inscription = await inscriptionTransfer(
        privateKey,
        convertUTXOData(result.utxos),
        drc20ShouldSend.tick,
        amount
      );
      if (result_inscription.success === true) {
        setMessage("Success!");
        setVisibleToast(true);
        // console.log("Success!", result_inscription.hash);
      } else {
        setMessage("Failed!");
        setVisibleToast(true);
        // console.log("Failed!");
      }
    }
  };
  const handleSendDRC20InscriptionClick = (txid) => {
    if (txid === selectedUtxo) setSelectedUtxo(-1);
    else setSelectedUtxo(txid);
    setNewInscribe(false);
  };
  const handleInscriptionSend = (message) => {
    setMessage(message);
    setVisibleToast(message);
    setSelectedUtxo(-1);
  }

  return (
    <Wrapper>
      <Row gap="20px">
        <BackButton onClick={handleBackClick} src={BackImage} />
        <WalletDescription>
          Send {drc20ShouldSend.tick.toUpperCase()}
        </WalletDescription>
      </Row>
      <Col gap="20px">
        <ContentContainer>
          <Col>
            <ImageImage src={drc20ShouldSend.image} />
          </Col>
          <ContentWrapper>
            <WalletDescription>
              Ticker: {drc20ShouldSend.tick}
            </WalletDescription>
            <WalletDescription>
              Balance: {parseInt(drc20ShouldSend.total)}
            </WalletDescription>
            <WalletDescription>
              Available: {parseInt(drc20ShouldSend.available)}
            </WalletDescription>
            <WalletDescription>
              Inscribed:{" "}
              {parseInt(drc20ShouldSend.total) -
                parseInt(drc20ShouldSend.available)}
            </WalletDescription>
          </ContentWrapper>
        </ContentContainer>
        {newInscribe === true && (
          <Row>
            <TokenAmountInput
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
            />
            <TransferButton onClick={() => setNewInscribe(false)}>
              Cancel
            </TransferButton>
          </Row>
        )}
        <InscribeButton onClick={handleSendDRC20Click}>
          New Inscribe
        </InscribeButton>
        <InscriptionListWrapper>
          {loading === false ? (
            <Col gap="20px" width="100%">
              {drc20Utxos.map((utxo, index) => (
                <InscriptionListItem
                  key={index}
                  image={drc20ShouldSend.image}
                  tick={drc20ShouldSend.tick}
                  utxo={utxo}
                  selectedUtxo={selectedUtxo}
                  handleClick={() => handleSendDRC20InscriptionClick(utxo.txid)}
                  handleSend={handleInscriptionSend}
                />
              ))}
            </Col>
          ) : (
            <Col>
              <Spinner color="#c14f4f" width={30} height={30} />
            </Col>
          )}
        </InscriptionListWrapper>
      </Col>
      <ToastBox isvisible={visibleToast}>{message}</ToastBox>
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
const ContentContainer = styled(Row)`
  gap: 20px;
  @media (max-width: 550px) {
    flex-direction: column;
  }
`
const ContentWrapper = styled(Col)`
  align-items: flex-start;
  @media (max-width: 550px) {
    align-items: center;
  }
`
const WalletDescription = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
  @media (max-width: 550px) {
    font-size: 18px;
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
`;
const ImageImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 20px;
`;
const TickerImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;
const SmallText = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 20px;
`;
const TransferButton = styled(InscribeButton)`
  width: 120px;
  min-width: 100px;
`;
const InscriptionListWrapper = styled(Col)`
  width: 100%;
  gap: 20px;
  max-height: 200px;
  overflow-y: auto;
`;
const ToastBox = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-60%, -80%);
  
  z-index: 1;
  padding: 5px 20px;
  width: fit-content;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  color: white;
  font-size: 14px;
  font-weight: bold;
  font-family: Livvic, sans-serif;

  opacity: 1;
  transition: opacity 0.5s ease-in-out, height 0.5s ease-in-out;

  opacity: ${props => props.isvisible ? "1" : "0"};
`;
export default ArmzSendDRC20;
