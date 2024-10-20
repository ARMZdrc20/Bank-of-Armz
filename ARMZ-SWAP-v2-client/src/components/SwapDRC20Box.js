import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { alertAmountInvalidDialog, getBalanceNFTList } from "../config/utils";
import { validateInscriptionAmountArmz } from "../config/validators";
import { moveToNewInscription, showDialog } from "../redux/walletSlice";
import { MAIN_TOKEN_NAME, LOADING_TEXT, NotesData } from "../config/constants";

import Row from "./Row";
import Col from "./Col";

const maxAmount = 500000;
const SwapDRC20Box = () => {
  const dispatch = useDispatch();
  const connected = useSelector((state) => state.wallet.connected);
  const drc20s = useSelector((state) => state.wallet.drc20s);
  const swapState = useSelector((state) => state.wallet.swapState);

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(0);

  const [nftSelected, setNFTSelected] = useState(0);
  const [balanceNFT, setBalanceNFT] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await getBalanceNFTList();
      setBalanceNFT(result);
    })();
  }, []);

  useEffect(() => {
    if (swapState === 2) {
      setLoading(false);
    } else if (swapState === 3) {
      setLoading(false);
    }
  }, [swapState]);

  const handleSwapClick = () => {
    // const totalAmount = NotesData[nftSelected].denomination;
    // const amount = balanceNFT.reduce(
    //   (prev, item) => (item.denomination === NotesData[nftSelected].denomination) ? prev + item.count : prev,
    //   0
    // );
    // if (connected === false) { alertAmountInvalidDialog("Not connected the wallet!"); return; }
    // if (amount === 0) { alertAmountInvalidDialog("Not sufficient balance!"); return; }
    // if (validateInscriptionAmountArmz(totalAmount, drc20s) === false) { alertAmountInvalidDialog("Your balance is invalid!"); return; }
    // dispatch(showDialog());
    // dispatch(
    //   moveToNewInscription({
    //     inscriptionTokenName: MAIN_TOKEN_NAME,
    //     inscriptionTokenAmount: NotesData[nftSelected].denomination
    //   })
    // );
  };

  const handleSelectButtonClick = (index) => {
    setNFTSelected(index);
  }

  return (
    <SwapBoxWrapper loading={loading} loadingText={LOADING_TEXT[loadingText]}>
      <SwapBoxContainer>
        <SwapTitle>Swap</SwapTitle>
        <SwapDescription>Trade tokens in an instant</SwapDescription>
        <NFTImage src={NotesData[nftSelected].image} />
        <Hr />
        <ResultWrapper>
          <Result>
            Balance:&nbsp;
            {balanceNFT.reduce(
              (prev, item) => (item.denomination === NotesData[nftSelected].denomination) ? prev + item.count : prev,
              0
            )}
          </Result>
        </ResultWrapper>
        <ButtonContainer>
          <MinContainer>
            <NFTSelectButton active={nftSelected === 0} onClick={() => handleSelectButtonClick(0)}>1000</NFTSelectButton>
            <NFTSelectButton active={nftSelected === 1} onClick={() => handleSelectButtonClick(1)}>10000</NFTSelectButton>
            <NFTSelectButton active={nftSelected === 2} onClick={() => handleSelectButtonClick(2)}>20000</NFTSelectButton>
            <NFTSelectButton active={nftSelected === 3} onClick={() => handleSelectButtonClick(3)}>50000</NFTSelectButton>
          </MinContainer>
          <MaxContainer>
            <NFTSelectButton active={nftSelected === 4} onClick={() => handleSelectButtonClick(4)} width="200px">100000</NFTSelectButton>
            <NFTSelectButton active={nftSelected === 5} onClick={() => handleSelectButtonClick(5)} width="200px">300000</NFTSelectButton>
          </MaxContainer>
        </ButtonContainer>
        <ResultSwap>
          {swapState === 2
            ? "Succeed! You will receive nfts in short time!"
            : swapState === 3
            ? "Failed! Not enough Balance"
            : ""}
        </ResultSwap>
        <SwapButton onClick={handleSwapClick}>Swap</SwapButton>
      </SwapBoxContainer>
    </SwapBoxWrapper>
  );
};

const SwapBoxWrapper = styled.div`
  position: relative;
  min-width: 530px;
  width: 530px;
  &::before {
    position: absolute;
    width: 100%;
    height: 100%;
    content: "${(props) => (props.loading === true ? props.loadingText : "")}";
    font-size: 30px;
    display: ${(props) => (props.loading === true ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    background-color: #ffffffa0;
  }
  @media (max-width: 700px) {
    width: fit-content;
    min-width: fit-content;
  }
`;
const SwapBoxContainer = styled.div`
  position: relative;
  padding: 30px 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: radial-gradient(circle, #efecc280, #f7f4cb);
  border: 2px solid #efecc2;
  border-radius: 20px;
  align-items: center;
  @media (max-width: 700px) {
    padding: 20px;
  }
`;
const SwapTitle = styled.div`
  font-family: Livvic, sans-serif;
  font-size: 32px;
  font-weight: bold;
  color: #c14f4f;
  width: 100%;
  @media (max-width: 500px) {
    text-align: center;
  }
`;
const SwapDescription = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
  font-weight: bold;
  width: 100%;
  @media (max-width: 500px) {
    text-align: center;
  }
`;
const ResultSwap = styled.div`
  width: 100%;
  font-size: 20px;
  color: #c14f4f;
  text-align: center;
`;
const SwapButton = styled.div`
  margin-top: 50px;
  border: 3px solid #c14f4f;
  width: 250px;
  height: 60px;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Livvic, sans-serif;
  font-weight: 400;
  border-radius: 30px;
  color: #c14f4f;
  font-size: 24px;
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
  @media (max-width: 500px) {
    margin: 0px;
  }
`;
const NFTSelectButton = styled.div`
  border: 2px solid #c14f4f;
  width: ${props => props.width ? props.width : "100px"};
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Livvic, sans-serif;
  border-radius: 30px;
  color: ${props => props.active ? "white" : "#c14f4f"};
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  transition: 0.1s;
  background-color: ${props => props.active ? "#c14f4f" : "transparent"};
  &: hover {
    background-color: #c14f4f;
    color: white;
  }
  &: active {
    background-color: #c14f4fc0;
    color: white;
  }
`;
const NFTImage = styled.img`
  width: 100%;
`
const Hr = styled.hr`
  color: #c14f4f;
  border: 1px solid #c14f4f;
  width: 100%;
  margin: 0px;
`;
const ResultWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const Result = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
`;
const ButtonContainer = styled(Col)`
  gap: 20px;
  @media (max-width: 700px) {
    gap: 10px;
  }
`;
const MinContainer = styled(Row)`
  width: 100%;
  justify-content: center;
  white-space: nowrap; /* Prevent line breaks */
  @media (max-width: 700px) {
    width: 300px;
  }  
`
const MaxContainer = styled(Row)`
  width: 100%;
  justify-content: center;
  white-space: nowrap; /* Prevent line breaks */
  @media (max-width: 700px) {
    width: 300px;
  }
`
export default SwapDRC20Box;
