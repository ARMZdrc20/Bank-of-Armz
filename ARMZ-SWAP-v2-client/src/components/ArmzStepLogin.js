import React, { useState } from "react";
import styled from "styled-components";

import Col from "./Col";
import { validateKey } from "../config/validators";
import { getPrivateKeyFromLocalStorage } from "../config/wallet";

const ArmzStepLogin = (props) => {
  const [password, setPassword] = useState("");

  const handleUnlockClick = () => {
    const privateKey = getPrivateKeyFromLocalStorage(password);
    // console.log("PRIVATE", privateKey);
    if(!validateKey(privateKey)) return false;
    props.forwardWalletInfo(privateKey);
  };

  return (
    <Wrapper>
      <WalletTitle>Enter your wallet password</WalletTitle>
      <Col gap="20px" width="100%">
        <PasswordInput placeholder="Password" type="password" password={password} onChange={(e) => setPassword(e.target.value)} />
        <UnlockButton onClick={handleUnlockClick}>Unlock</UnlockButton>
      </Col>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 0px;
  width: 550px;
  height: 380px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px 35px;
  border: 2px solid #efecc2;
  border-radius: 20px;
  background: radial-gradient(circle, #efecc21a, #f7f4cb1a);
  backdrop-filter: blur(42px);
  gap: 2px;
  @media (max-width: 800px) {
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    height: 300px;
  }
  @media (max-width: 640px) {
    width: 500px;
    height: 250px;
    padding: 20px 20px;
  }
  @media (max-width: 550px) {
    width: 400px;
  }
  @media (max-width: 450px) {
    width: 300px;
  }
`;
const WalletTitle = styled.div`
  width: 100%;
  text-align: center;
  padding: 40px 20px;
  font-size: 20px;
  color: #c14f4f;
  font-family: Livvic, sans-serif;
  font-weight: bold;
  text-align: center;
  @media (max-width: 800px) {
    padding: 30px 20px;
  }
  @media (max-width: 640px) {
    padding: 20px 20px;
  }
  @media (max-width: 550px) {
    padding: 0px 0px 10px 0px;
  }
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
  @media (max-width: 800px) {
    padding: 10px 35px;
    font-size: 20px;
    height: 40px;
  }
  @media (max-width: 640px) {
    padding: 5px 35px;
    font-size: 15px;
    height: 40px;
  }
  @media (max-width: 550px) {
    padding: 5px 20px;
    height: 40px;
  }
`;
const UnlockButton = styled.div`
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
  @media (max-width: 800px) {
    font-size: 20px;
    height: 40px;
  }
  @media (max-width: 640px) {
    font-size: 15px;
    height: 40px;
  }
  @media (max-width: 550px) {
    height: 40px;
  }
`;

export default ArmzStepLogin;
