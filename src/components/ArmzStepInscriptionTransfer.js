import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import BackImage from "../assets/ico_back.png";
import Row from "./Row";
import Col from "./Col";

const ArmzStepNewInscription = () => {
  const dispatch = useDispatch();
  const inscriptionTokenName = useSelector((state) => state.wallet.inscriptionTokenName);
  const inscriptionTokenAmount = useSelector((state) => state.wallet.inscriptionTokenAmount);
  const drc20s = useSelector((state) => state.wallet.drc20s);

  const handleBackButton = () => {
    // props.handleGoBackClick();
  };

  const currentDRC20 = drc20s.find(drc20 => drc20.tick === inscriptionTokenName);
  return (
    <Wrapper>
      <Row gap="20px">
        <BackButton src={BackImage} onClick={handleBackButton} />
        <WalletDescription>{inscriptionTokenName}</WalletDescription>
      </Row>
      <Col>
        <WalletDescription>Balance: {currentDRC20.total}</WalletDescription>
        <WalletDescription>Available: {currentDRC20.available}</WalletDescription>
        <WalletDescription>Inscribed: {parseInt(currentDRC20.total) - parseInt(currentDRC20.available)}</WalletDescription>
      </Col>
      <InscriptionWrapper>
        <InscriptionBoxTitle>New Inscription</InscriptionBoxTitle>
        <Row gap="15px">
          <TokenImage src={currentDRC20.image} />
          <TokenAmountInput value={inscriptionTokenAmount} />
          <WalletDescription>{inscriptionTokenName}</WalletDescription>
        </Row>
        <InscribeButton>Inscribe</InscribeButton>
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
  padding:  40px 40px 20px 40px;
  border: 2px solid #efecc2;
  border-radius: 20px;
  background: radial-gradient(circle, #efecc21a, #f7f4cb1a);
  backdrop-filter: blur(42px);
  gap: 15px;
  justify-content: space-between;
`;
const BackButton = styled.img`
  width: 20px;
  height: 20px;
`
const WalletDescription = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
`
const InscriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border: 1px solid #c14f4f;
  border-radius: 20px;
  background: transparent;
  padding: 20px;
`
const InscriptionBoxTitle = styled(WalletDescription)`
  width: 100%;
`
const TokenImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;
const TokenAmountInput = styled.input`
  display: flex;
  width: 100$;
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
