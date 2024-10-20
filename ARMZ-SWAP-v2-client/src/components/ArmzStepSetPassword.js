import React, { useState } from "react";
import styled from "styled-components";

import Row from "./Row";
import { setPrivateKeyToLocalStorage } from "../config/wallet";
import { validatePassword } from "../config/validators";

const ArmzStepSetPassword = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errMsg1, setErrorMessage1] = useState("");
  const [errMsg2, setErrorMessage2] = useState("");

  const handleCancelClick = () => {
    props.handleCancelPassword();
  };
  const handleSetPasswordClick = () => {
    if (validatePassword(password) === false) {
      setErrorMessage1("Validation error!");
      return;
    }
    setErrorMessage1("");
    if (password !== confirmPassword) {
      setErrorMessage2("Doesn't match!");
      return;
    }
    setPrivateKeyToLocalStorage(props.privateKey, password);
    props.handleConfirmedPassword();
  };

  return (
    <Wrapper>
      <WalletTitle>Select your wallet password</WalletTitle>
      <PasswordInputWrapper>
        <PasswordInput
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ErrorMessage>{errMsg1}</ErrorMessage>
      </PasswordInputWrapper>
      <PasswordInputWrapper>
        <PasswordInput
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <ErrorMessage>{errMsg2}</ErrorMessage>
      </PasswordInputWrapper>
      <Row gap="10px">
        <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
        <SetPasswordButton onClick={handleSetPasswordClick}>
          Set Password
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
const PasswordInputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const PasswordInput = styled.input`
  display: flex;
  width: 100%;
  height: 60px;
  border-radius: 30px;
  border: 1px solid #c14f4f;
  color: #c14f4f;
  font-size: 24px;
  font-family: Livvic, sans-serif;
  background-color: transparent;
  padding: 15px 35px;
  @media (max-width: 550px) {
    padding: 15px 25px;
    height: 50px;
    font-size: 20px;
  }
  @media (max-width: 450px) {
    padding: 15px;
    height: 40px;
  }
`;
const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  font-family: Livvic, sans-serif;
`;
const CancelButton = styled.div`
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
export default ArmzStepSetPassword;
