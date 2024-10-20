import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import ArrowButtonImage from "../assets/ico_arrowButton.png";
import WalletIconImage from "../assets/ico_wallet.png";

import Row from "./Row";
import ArmzWallet from "./ArmzWallet";
import { shortenAddress } from "../config/utils";
import { showDialog, hideDialog } from "../redux/walletSlice";
import IconContainer from "./IconContainer";

const SelectMenu = () => {
  const dispatch = useDispatch();
  const connected = useSelector((state) => state.wallet.connected);
  const address = useSelector((state) => state.wallet.address);
  const show = useSelector((state) => state.wallet.show);

  const walletRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideWallet);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideWallet);
    };
  }, []);

  const handleShowWallet = () => {
    if(show) dispatch(hideDialog());
    else dispatch(showDialog());
  };

  const handleClickOutsideWallet = (event) => {
    if (walletRef.current && !walletRef.current.contains(event.target)) {
      dispatch(hideDialog());
    }
  };

  return (
    <Wrapper ref={walletRef}>
      <ArmzWalletContainer show={show}>
        <ArmzWallet />
      </ArmzWalletContainer>
      <Container connected={connected} onClick={handleShowWallet}>
        <ConnectButtonLargeContainer>
          {connected === true ? (
            <Row gap="15px">
              <TitleText>{shortenAddress(address)}</TitleText>
              <ArrowButton src={ArrowButtonImage} />
            </Row>
          ) : (
            <TitleText>Connect Wallet</TitleText> 
          )}
        </ConnectButtonLargeContainer>
        <ConnectButtonSmallContainer>  
          <IconContainer
              src={WalletIconImage}
              width="20px"
              height="20px"
            />
        </ConnectButtonSmallContainer>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;
const Container = styled.div`
  height: 35px;
  display: flex;
  justify-content: ${(props) => (props.connected ? "space-between" : "center")};
  align-items: center;
  padding: 0px 20px;
  background-color: #efecc2;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;
  @media (max-width: 450px) {
    padding: 10px;
  }
`;
const TitleText = styled.div`
  font-family: Livvic, sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #c14f4f;
  @media (max-width: 450px) {
    font-size: 12px;
    text-align: center;
  }
`;
const ArmzWalletContainer = styled.div`
  display: ${props => props.show ? "block" : "none"};
`;
const ArrowButton = styled.img`
  width: 18px;
`;
const ConnectButtonLargeContainer = styled.div`
  display: block;
  @media (max-width: 450px) {
    display: none;
  }
`;
const ConnectButtonSmallContainer = styled.div`
  display: none;
  @media (max-width: 450px) {
    display: block;
  }
`

export default SelectMenu;
