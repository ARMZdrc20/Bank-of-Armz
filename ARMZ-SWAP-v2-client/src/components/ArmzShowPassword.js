import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import BackImage from "../assets/ico_back.png";
import Row from "./Row";
import Col from "./Col";
import { moveToWalletInfo } from "../redux/walletSlice";
import { isBackuped, setBackupState } from "../config/wallet";

const ArmzShowPassword = () => {
  const dispatch = useDispatch();

  const privateKey = useSelector((state) => state.wallet.privateKey);
  
  const [visibleToast, setVisibleToast] = useState(false);
  const [message, setMessage] = useState("");
  const [backupState, setIsBackuped] = useState(false);

  useEffect(() => {
    setIsBackuped(isBackuped());
  }, []);

  useEffect(() => {
    if (visibleToast) {
        const timer = setTimeout(() => {
          setVisibleToast(false);
          // dispatch(clearMessage());
        }, 2000); // Text will fade out after 2 seconds
        return () => clearTimeout(timer); // Cleanup the timer on unmount or re-render
    }
  }, [visibleToast]);

  const handleBackClick = () => {
    dispatch(moveToWalletInfo());
  };
  const handleCopyClick = () => {
    navigator.clipboard.writeText(privateKey).then(() => {
      setVisibleToast(true);
      setMessage("Secret Phrase copied");
    });
  }
  const handleBackupClick = () => {
    setBackupState();
    setIsBackuped(true);
    setVisibleToast(true);
    setMessage("Secret Phrase backup success!");
  }

  const mnemonics = privateKey.split(" ");
  return (
    <Wrapper>
      <Row gap="20px" width="100%">
        <BackButton onClick={handleBackClick} src={BackImage} />
        <WalletTitle>
          Your Secret Phrase
        </WalletTitle>
      </Row>
      <Col>
        <PhraseWrapper>
          {mnemonics.map((item, index) => (
            <Row gap="10px" key={index}>
              <PhraseNumber>{index + 1}.</PhraseNumber>
              <PhraseWord>{item}</PhraseWord>
            </Row>
          ))}
        </PhraseWrapper>
      </Col>
      {backupState === false && <BackupButton onClick={handleBackupClick}>Backup</BackupButton>}
      <CopyButton onClick={handleCopyClick}>Copy</CopyButton>
      <ToastBox isvisible={visibleToast}>Secret Phrase copied</ToastBox>
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
  align-items: center;
  flex-direction: column;
  padding: 20px 25px;
  border: 2px solid #efecc2;
  border-radius: 20px;
  background: radial-gradient(circle, #efecc21a, #f7f4cb1a);
  backdrop-filter: blur(42px);
  gap: 30px;
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
const ToastBox = styled.div`
  position: absolute;
  left: 50%;
  bottom: 15%;
  transform: translate(-50%, -80%);
  
  z-index: ${props => props.isvisible ? "3" : "-1"};
  padding: 5px 20px;
  width: 180px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  color: white;
  font-size: 14px;
  font-weight: bold;
  font-family: Livvic, sans-serif;
  user-select: none;

  opacity: 1;
  transition: opacity 0.5s ease-in-out, height 0.5s ease-in-out;

  opacity: ${props => props.isvisible ? "1" : "0"};
`;
const WalletTitle = styled.div`
  font-size: 20px;
  color: #c14f4f;
  font-family: Livvic, sans-serif;
  font-weight: bold;
`;
const PhraseWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 400px;
  gap: 10px;
  @media (max-width: 450px) {
    width: 300px;
  }
`;
const PhraseNumber = styled.div`
  text-align: right;
  font-size: 20px;
  color: #c14f4f;
  font-family: Livvic, sans-serif;
  width: 30px;
`;
const PhraseWord = styled.div`
  text-align: left;
  font-size: 20px;
  color: #c14f4f;
  font-family: Livvic, sans-serif;
  width: 120px;
  background-color: #44444420;
  @media (max-width: 450px) {
    width: 80px;
  }
`;
const CopyButton = styled.div`
  width: 200px;
  height: 40px;
  font-size: 20px;
  background-color: white;
  color: #c14f4f;
  display: flex;
  border: 2px solid #c14f4f;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
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
const BackupButton = styled.div`
  margin-bottom: -15px;
  width: 200px;
  height: 40px;
  font-size: 20px;
  display: flex;
  background-color: transparent;
  border-radius: 30px;
  border: 2px solid #c14f4f;
  justify-content: center;
  align-items: center;
  color: #c14f4f;
  border-radius: 30px;
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
const BackButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export default ArmzShowPassword;
