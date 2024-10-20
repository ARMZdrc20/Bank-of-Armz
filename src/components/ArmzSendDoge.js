import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import BackImage from "../assets/ico_back.png";
import Row from "./Row";
import Col from "./Col";
import {
  finishedLoading,
  moveToWalletInfo, startedLoading, updateWalletInfo,
  // updateUTXOsData,
} from "../redux/walletSlice";
import { getUTXOs, getWalletInfo, sendDoge } from "../services/walletService";
import { convertUTXOData, isValidAddress } from "../config/utils";

const ArmzSendDoge = (props) => {
  const dispatch = useDispatch();

  const balance = useSelector((state) => state.wallet.balance);
  const privateKey = useSelector((state) => state.wallet.privateKey);
  const address = useSelector((state) => state.wallet.address);

  const [receiverAddress, setReceiverAddress] = useState();
  const [amount, setAmount] = useState(0);

  const handleBackClick = () => {
    dispatch(moveToWalletInfo());
  }
  const handleSendDogeClick = async () => {
    if(isValidAddress(receiverAddress) && amount <= balance) {
      const result = await getUTXOs(address);
      const result_doge = await sendDoge(privateKey, convertUTXOData(result.utxos), amount, receiverAddress);
      if(result_doge.success === true) {
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
        console.log("Send doge success!", result_doge.hash);
      } console.log("Send doge failed!");
    }
  }
  return (
    <Wrapper>
      <Row gap="20px">
        <BackButton onClick={handleBackClick} src={BackImage} />
        <WalletTitle>Send Doge</WalletTitle>
      </Row>
      <Col gap="10px">
        <LabelComponentContainer>
          <WalletDescription>To:</WalletDescription>
          <TokenAmountInput value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)}/>
        </LabelComponentContainer>
        <LabelComponentContainer>
          <WalletDescription>Amount:</WalletDescription>
          <TokenAmountInput value={amount} onChange={(e) => setAmount(e.target.value)} type="number"/>
        </LabelComponentContainer>
        <InscribeButton onClick={handleSendDogeClick}>
          {
            isValidAddress(receiverAddress) ? (amount <= balance ? "Send Doge" : "Not enought balance") : "Enter valid address"
          }
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
  width: 550px;
  display: flex;
  flex-direction: column;
  padding: 40px 40px 20px 40px;
  border: 2px solid #efecc2;
  border-radius: 20px;
  background: radial-gradient(circle, #efecc21a, #f7f4cb1a);
  backdrop-filter: blur(42px);
  gap: 15px;
  @media (max-width: 800px) {
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    height: 250px;
  }
  @media (max-width: 640px) {
    width: 500px;
    padding: 20px 20px;
  }
  @media (max-width: 550px) {
    width: 400px;
  }
  @media (max-width: 450px) {
    width: 300px;
    height: fit-content;
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
  width: 80px;
  min-width: 80px;
  @media (max-width: 450px) {
    font-size: 20px;
    width: 100%;
    min-width: auto;
  }
`;
const WalletTitle = styled(WalletDescription)`
  width: 100%;
`
const LabelComponentContainer = styled(Row)`
  width: 100%;
  gap: 20px;
  @media (max-width: 450px) {
    flex-direction: column;
    gap: 10px;
  }
`
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
  @media (max-width: 450px) {
    margin-top: 10px;
  }
`;

export default ArmzSendDoge;
