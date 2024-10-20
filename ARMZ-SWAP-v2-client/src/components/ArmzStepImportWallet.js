import React, { useState } from "react";
import styled from "styled-components";

import Row from "./Row";
import { validateKey } from "../config/validators";

const ArmzStepImportWallet = (props) => {
  const [key, setKey] = useState("");
  const [errMsg, setErrorMessage] = useState("");

  const handleSkipButton = () => {
    props.handleGoBackClick();
  };
  const handleSetPasswordButton = () => {
    if(validateKey(key) === true)
      props.handleImportedWalletClick(key);
    else
      setErrorMessage("Invalid seed pharse!");
  };

  return (
    <Wrapper>
      <WalletTitle>Import Wallet</WalletTitle>
      <InputWrapper>
      <ImportKeyInput
        placeholder="Enter your key phrase here (mnemonic or private key)"
        spellCheck="false"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <ErrorMessage>{errMsg}</ErrorMessage>
      </InputWrapper>
      <Row gap="10px">
        <SkipButton onClick={handleSkipButton}>Go Back</SkipButton>
        <SetPasswordButton onClick={handleSetPasswordButton}>
          Import wallet
        </SetPasswordButton>
      </Row>
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
  @media (max-width: 550px) {
    font-size: 24px;
  }
  @media (max-width: 450px) {
    font-size: 20px;
    text-align: center;
  }
`;
const SkipButton = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border-radius: 30px;
  border: 2px solid #c14f4f;
  padding: 15px 30px;
  font-family: Livvic, sans-serif;
  font-size: 24px;
  color: #c14f4f;
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
  @media (max-width: 550px) {
    padding: 15px 25px;
    height: 50px;
    font-size: 18px;
  }
  @media (max-width: 450px) {
    padding: 15px;
    height: 40px;
    font-size: 16px;
  }
`;
const SetPasswordButton = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 30px;
  border: 2px solid #c14f4f;
  padding: 15px 30px;
  font-family: Livvic, sans-serif;
  font-size: 24px;
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
    height: 50px;
    font-size: 18px;
  }
  @media (max-width: 450px) {
    padding: 15px;
    height: 40px;
    font-size: 16px;
  }
`;
const InputWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const ImportKeyInput = styled.textarea`
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  border: 1px solid #c14f4f;
  color: #c14f4f;
  font-size: 24px;
  font-family: Livvic, sans-serif;
  background-color: transparent;
  padding: 15px 35px;
  @media (max-width: 550px) {
    font-size: 20px;
    padding: 15px 25px;
  }
  @media (max-width: 450px) {
    font-size: 15px;
    padding: 15px;
  }
`;
const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  font-family: Livvic, sans-serif;
`;
export default ArmzStepImportWallet;
