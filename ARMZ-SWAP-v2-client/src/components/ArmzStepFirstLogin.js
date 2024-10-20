import React from "react";
import styled from "styled-components";

import Col from "./Col";
import { generateRandomPrivateKey } from "../config/utils";

const ArmzStepFirstLogin = (props) => {
  const handleCreateWalletClick = () => {
    const mnemonic = generateRandomPrivateKey();
    console.log("Result", mnemonic);
    props.handleCreateWalletClick(mnemonic);
  }
  const handleImportWalletClick = () => {
    props.handleImportWalletClick();
  }
  
  return (
    <Wrapper>
      <Col gap="20px">
        <WalletTitle>ARMZ Wallet</WalletTitle>
        <WalletDescription>
          &nbsp;&nbsp; The Bank of ARMZ comes with built-in wallet, there is no need
          to download any browser extension. Your private keys are stored in the
          browser and are never sent to the server.{" "}
        </WalletDescription>
      </Col>
      <Col gap="20px" width="100%">
        <CreateNewWalletButton onClick={handleCreateWalletClick}>
          Create new wallet
        </CreateNewWalletButton>
        <ImportWalletButton onClick={handleImportWalletClick}>
          Import wallet
        </ImportWalletButton>
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
  height: 380px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px 25px;
  border: 2px solid #efecc2;
  border-radius: 20px;
  background: radial-gradient(circle, #efecc21a, #f7f4cb1a);
  backdrop-filter: blur(42px);
  gap: 20px;
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
const WalletTitle = styled.div`
  font-size: 32px;
  color: #c14f4f;
  font-family: Livvic, sans-serif;
  font-weight: bold;
`;
const WalletDescription = styled.div`
  color: #c14f4f;
  font-size: 20px;
  font-family: Livvic, sans-serif;
`;
const CreateNewWalletButton = styled.div`
  width: 100%;
  height: 60px;
  font-size: 25px;
  background-color: white;
  color: #c14f4f;
  border: 1px solid #c14f4f;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  cursor: pointer;
  user-select: none;
  transition: 0.1s;
  &:hover {
    background-color: #eee;
  }
  &:active {
    background-color: #e5e5e5;
  }
  @media (max-width: 550px) {
    height: 50px;
    font-size: 20px;
  }
  @media (max-width: 450px) {
    height: 40px;
    font-size: 15px;
  }
`;
const ImportWalletButton = styled.div`
  width: 100%;
  height: 60px;
  font-size: 25px;
  background-color: #c14f4f50;
  color: #c14f4f;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  cursor: pointer;
  user-select: none;
  transition: 0.1s;
  &:hover {
    background-color: #c14f4fa0;
  }
  &:active {
    background-color: #c14f4f80;
  }
  @media (max-width: 550px) {
    height: 50px;
    font-size: 20px;
  }
  @media (max-width: 450px) {
    height: 40px;
    font-size: 15px;
  }
`;

export default ArmzStepFirstLogin;
