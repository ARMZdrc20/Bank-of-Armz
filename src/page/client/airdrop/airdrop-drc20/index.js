import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "@chakra-ui/react";
import { confirmAlert } from 'react-confirm-alert';

import Row from "../../../../components/Row";
import Col from "../../../../components/Col";
import AirdropRadio from "../../../../components/airdrop/AirdropRadio";
import AirdropInput from "../../../../components/airdrop/AirdropInput";
import AirdropSelect from "../../../../components/airdrop/AirdropSelect";
import StyledButton1 from "../../../../components/public/StyledButton1";
import AirdropTable from "../../../../components/airdrop/AirdropTable";
import Pagination from "../../../../components/public/Pagination";
import { AIRDROP_DRC20_TABLE_LIST, LINK_DOWNLOAD_CSV_DRC20, NAME_DOWNLOAD_CSV_DRC20, BASE_URL } from "../../../../config/constants";
import { alertAmountInvalidDialog, shortenTransaction } from "../../../../config/utils";

import { validateAddress } from "../../../../config/validators";
import { getLevelOfUser, sendAirdropDRC20s } from "../../../../services/airdropService";

const AirdropDRC20Page = () => {
  const connected = useSelector((state) => state.wallet.connected);
  const address = useSelector((state) => state.wallet.address);
  const privateKey = useSelector((state) => state.wallet.privateKey);
  const nfts = useSelector((state) => state.wallet.nfts);
  const drc20s = useSelector((state) => state.wallet.drc20s);

  const [currentDRC20, setCurrentDRC20] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [remainWallet, setRemainWallet] = useState(0);
  const [errorMessageQuantity, setErrorMessageQuantity] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [errorMessageWallet, setErrorMessageWallet] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [walletDataList, setWalletDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  const optionList = drc20s.map((drc20) => {
    return {
      image: drc20.image,
      title: drc20.tick,
      count: parseInt(drc20.available)
    }
  });

  useEffect(() => {
    setRemainWallet(walletDataList.length);
  }, [walletDataList]);

  const handleAddClick = () => {
    if(validateAddress(walletAddress) === false) return;
    const t_WalletDataList = [
      ...walletDataList,[
        walletAddress,
        "",
        "Unspent"
      ]
    ];
    setWalletDataList(t_WalletDataList);
    setWalletAddress("");
  }
  const handleWalletAddressChange = (address) => {
    if(address === "" || validateAddress(address)){
      setErrorMessageWallet('  ');
    } else setErrorMessageWallet('Invalid wallet address now');
    setWalletAddress(address);
  }
  const handleQuantityChange = (quantity) => {
    if(quantity <= 0) setErrorMessageQuantity('Invalid Quantity');
    else setErrorMessageQuantity('');
    setQuantity(quantity);
  }
  const handleRemove = (index) => {
    const t_WalletDataList = walletDataList.slice(0, index).concat(walletDataList.slice(index+1, walletDataList.length));
    setWalletDataList(t_WalletDataList);
  }
  const handleClearAll = () => {
    setWalletDataList([]);
  }
  const handleAirdropClick = async () => {
    if(walletDataList.length === 0 || quantity <= 0 || optionList[currentDRC20] === undefined || optionList[currentDRC20].count < quantity * walletDataList.length) return;
    setLoading(true);
    const level = await getLevelOfUser(drc20s, nfts);
    console.log("LEVEL", level);
    const wallets = walletDataList.map((wallet) => wallet[0]);
    // console.log("wallets", wallets);
    const result = await sendAirdropDRC20s(address, privateKey, wallets, optionList[currentDRC20].title, quantity, level);
    setLoading(false);
    if (result.success === false && result.txids === undefined ) {  
      confirmAlert({
        title: 'Alert',
        message: 'Check your network status or wallet balance.',
        buttons: [
          {
            label: 'Ok',
          },
        ]
      });
    } else {
      const message = (result.success === true) ? "Success" : "Failed";
      const t_WalletDataList = walletDataList.map((wallet, index) => [wallet[0], shortenTransaction(result.txids[index + 1]), message]);
      setWalletDataList(t_WalletDataList);
      confirmAlert({
        title: 'Alert',
        message: `${message} the transactions`,
        buttons: [
          {
            label: 'Ok',
          },
        ]
      });
    }
  }
  const handleUploadCSV = (array) => {
    const t_WalletDataList = [];
    for(let i = 0;i < array.length; i ++) {
      if(array[i].wallet === undefined) {
        alertAmountInvalidDialog("CSV file type not valid!");
        return;
      } else if (!validateAddress(array[i].wallet)) {
        alertAmountInvalidDialog(`${array[i].wallet} is not valid!`);
        return;
      } else t_WalletDataList.push([array[i].wallet, "", "Unspent"]);
    }
    // const t_WalletDataList =  array.map((item) => item['wallet']);
    setWalletDataList(t_WalletDataList);
  }
  
  return (
    <Wrapper>
      <Container>
        <TitleWrapper>
          <Title>DRC-20 Airdrop Tool</Title>
          <TitleDescription>
            Easily send any DRC-20 Token or NFT to thousands of wallets without coding. Only 3 DOGE per wallet. For ARMZ token holders with more than 1000 ARMZ, only 2 DOGE per wallet. For ARMZ note holders, only 1 DOGE per wallet.
          </TitleDescription>
        </TitleWrapper>
        <BodyWrapper>
          <BodyOptionWrapper>
            <BigAirdropRadio to={BASE_URL + "/airdrop/airdrop-drc20"}>
              <AirdropRadio isActive={true}>
                Airdrop tool for drc-20
              </AirdropRadio>
            </BigAirdropRadio>
            <SmallAirdropRadio to={BASE_URL + "/airdrop/airdrop-drc20"}>
              <AirdropRadio isActive={true}>
                DRC-20
              </AirdropRadio>
            </SmallAirdropRadio>
            <BigAirdropRadio to={BASE_URL + "/airdrop/airdrop-nft"}>
              <AirdropRadio isActive={false}>
                Airdrop tool for nft
              </AirdropRadio>
            </BigAirdropRadio>
            <SmallAirdropRadio to={BASE_URL + "/airdrop/airdrop-nft"}>
              <AirdropRadio isActive={false}>
                NFT
              </AirdropRadio>
            </SmallAirdropRadio>
          </BodyOptionWrapper>
          <BodyContainer connected={connected}>
            <TokenDataOption>
              <AirdropSelect
                isRequired={true}
                title="DRC-20 token list"
                options={optionList}
                currentValue={currentDRC20}
                setCurrentValue={setCurrentDRC20}
              />
              <AirdropInput
                isRequired={true}
                title="Quantity per Wallet"
                type="number"
                value={quantity}
                setValue={handleQuantityChange}
                errorMessage={errorMessageQuantity} 
              />
            </TokenDataOption>
            <WalletAddressOptionWrapper>
              <WalletAddressOptionContainer>
                <AirdropInput
                  isRequired={false}
                  title="Enter wallet address here"
                  type="text"
                  value={walletAddress}
                  setValue={handleWalletAddressChange}
                  errorMessage={errorMessageWallet}
                />
                <AddButton margin="0px 0px 7px 0px" onClick={handleAddClick}>Add</AddButton>
              </WalletAddressOptionContainer>
            </WalletAddressOptionWrapper>
            <AirdropTable
              title="Wallet List:"
              fieldNameList={AIRDROP_DRC20_TABLE_LIST}
              tableItemList={walletDataList}
              page={currentPage}
              itemPerPage={itemsPerPage}
              handleClearAll={handleClearAll}
              handleRemove={handleRemove}
              handleUploadCSV={handleUploadCSV}
              linkDownloadCSV={LINK_DOWNLOAD_CSV_DRC20}
              nameCSV={NAME_DOWNLOAD_CSV_DRC20}
            />
            <AirdropStatusInfoWrapper>
              <AirdropStatusDescription>Total sending: {walletDataList.length * quantity} token</AirdropStatusDescription>
              <AirdropStatusDescription>Sent: {(walletDataList.length - remainWallet) * quantity} token</AirdropStatusDescription>
              <AirdropStatusDescription>Remain: {remainWallet * quantity} token</AirdropStatusDescription>
              <AirdropStatusDescription>Total wallet: {walletDataList.length}</AirdropStatusDescription>
              <AirdropStatusDescription>Sent wallet: {walletDataList.length - remainWallet}</AirdropStatusDescription>
              <AirdropStatusDescription>Remain wallet: {remainWallet}</AirdropStatusDescription>
            </AirdropStatusInfoWrapper>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={walletDataList.length} setPageNumber={setCurrentPage}/>
            <AirdropButton onClick={handleAirdropClick} disabled={walletDataList.length === 0 || quantity <= 0 || optionList[currentDRC20].count < quantity * walletDataList.length}>
              {loading === false ? "Execute Airdrop" : (<Spinner color="white" width={30} height={30} />)}
            </AirdropButton>
          </BodyContainer>
        </BodyWrapper>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 60px;
  width: 100%;
  background: linear-gradient(to bottom, #efecc280, #efecc233, #efecc219);
`;
const Container = styled(Col)`
  max-width: 1700px;
  padding: 0px 50px;
  margin: auto;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 100px;
  @media (max-width: 1130px) {
    padding: 0px 20px;
    gap: 70px;
  }
  @media (max-width: 800px) {
    padding: 0px 10px;
    gap: 10px;
  }
`;
const TitleWrapper = styled(Col)`
  padding: 50px 150px 0px 150px;
  gap: 30px;
  color: #c14f4f;
  justify-content: center;
  width: 100%;
  @media (max-width: 1130px) {
    padding: 30px;
    gap: 20px;
  }
  @media (max-width: 1130px) {
    padding: 15px;
    gap: 10px;
  }
`;
const Title = styled.div`
  font-weight: bold;
  font-size: 64px;
  font-family: Livvic, sans-serif;
  @media (max-width: 1130px) {
    font-size: 48px;
  }
  @media (max-width: 800px) {
    font-size: 24px;
  }
`;
const TitleDescription = styled.div`
  font-weight: medium;
  font-size: 32px;
  text-align: center;
  font-family: Livvic, sans-serif;
  @media (max-width: 1130px) {
    font-size: 24px;
  }
  @media (max-width: 800px) {
    font-size: 15px;
  }
`;
const BodyWrapper = styled(Col)`
  width: 100%;
  gap: 40px;
  padding-bottom: 30px;
  @media (max-width: 800px) {
    gap: 20px;
  }
`;
const BodyOptionWrapper = styled(Row)`
  gap: 50px;
  @media (max-width: 800px) {
    gap: 20px;
  }
`;
const BodyContainer = styled(Col)`
  position: relative;
  gap: 35px;
  background-color: white;
  padding: 40px 75px;
  border-radius: 20px;
  width: 100%;
  &:: before {
    position: absolute;
    z-index: 2;
    display: ${props => props.connected ? "none" : "flex"};
    justify-content: center;
    align-items: center;
    content: "Please connect wallet";
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    color: #c14f4f;
    font-size: 50px;
    font-family: Livvic, sans-serif;
    background-color: #ffffffe0;
    @media (max-width: 1130px) {
      font-size: 40px;
    }
    @media (max-width: 800px) {
      padding: 30px;
    }
    @media (max-width: 600px) {
      padding: 20px;
    }
  }
  @media (max-width: 1130px) {
    padding: 20px 50px;
  }
  @media (max-width: 800px) {
    padding: 10px 30px;
  }
  @media (max-width: 600px) {
    padding: 10px;
  }
`;
const StyledLink = styled(Link)`
  text-decoration: none;
`;
const TokenDataOption = styled(Row)`
  gap: 100px;
  width: 100%;
  @media (max-width: 600px) {
    gap: 10px;
    flex-direction: column;
  }
`;
const WalletAddressOptionWrapper = styled(Row)`
  width: 100%;
`;
const WalletAddressOptionContainer = styled(Row)`
  width: 45%;
  gap: 35px;
  align-items: flex-end;
  @media (max-width: 600px) {
    width: 100%;
  }
`;
const AirdropStatusInfoWrapper = styled(Row)`
  width: 100%;
  justify-content: center;
  gap: 50px;
  margin-top: -20px;
  @media (max-width: 1130px) {
    gap: 30px;
  }
  @media (max-width: 800px) {
    gap: 10px;
  }
  @media (max-width: 600px) {
    // gap: 10px;
    display: none;
  }
`;
const AirdropStatusDescription = styled.div`
  font-size: 20px;
  font-family: Livvic, sans-serif;
  @media (max-width: 1130px) {
    font-size: 15px;
  }
  @media (max-width: 800px) {
    font-size: 12px;
  }
`;
const AddButton = styled(StyledButton1)`
  @media (max-width: 1130px) {
    font-size: 15px;
    padding: 5px 30px;
    margin-bottom: 2px;
  }
  @media (max-width: 800px) {
    font-size: 12px;
  }
`
const AirdropButton = styled(StyledButton1)`
  font-size: 30px;
  padding: 15px 60px;
  margin: 0px 0px 7px 0px;
  @media (max-width: 1130px) {
    font-size: 25px;
    padding: 10px 40px;
  }
  @media (max-width: 800px) {
    font-size: 20px;
    padding: 5px 30px;
  }
`;
const BigAirdropRadio = styled(StyledLink)`
  display: block;
  @media (max-width: 600px) {
    display: none;
  }
`
const SmallAirdropRadio = styled(StyledLink)`
  display: none;
  @media (max-width: 600px) {
    display: block;
  }
`
export default AirdropDRC20Page;
