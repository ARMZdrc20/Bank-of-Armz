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
import { AIRDROP_NFT_TABLE_LIST, LINK_DOWNLOAD_CSV_NFT, NAME_DOWNLOAD_CSV_NFT, BASE_URL } from "../../../../config/constants";
import { alertAmountInvalidDialog, shortenTransaction } from "../../../../config/utils";

import { validateAddress } from "../../../../config/validators";
import { getLevelOfUser, sendAirdropNFTs } from "../../../../services/airdropService";

const AirdropNFTPage = () => {
  const connected = useSelector((state) => state.wallet.connected);
  const address = useSelector((state) => state.wallet.address);
  const privateKey = useSelector((state) => state.wallet.privateKey);
  const nfts = useSelector((state) => state.wallet.nfts);
  const drc20s = useSelector((state) => state.wallet.drc20s);

  const [nftDataList, setNFTDataList] = useState([]);
  const [currentNFT, setCurrentNFT] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [remainWallet, setRemainWallet] = useState(0);
  const [errorMessageWallet, setErrorMessageWallet] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [walletDataList, setWalletDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  const optionList = nftDataList.map((nft) => {
    return {
      imageType: nft.imageType,
      inscriptionId: nft.inscriptionId,
    }
  });

  useEffect(() => {
    setNFTDataList(nfts);
    setCurrentNFT(0);
    setWalletAddress("");
    setRemainWallet(0);
    setErrorMessageWallet("");
    setCurrentPage(1);
    setWalletDataList([]);
    setLoading(false);
  }, [nfts]);
  useEffect(() => {
    setRemainWallet(walletDataList.length);
  }, [walletDataList]);

  const handleAddClick = () => {
    if(validateAddress(walletAddress) === false || optionList.length === 0) return;
    const t_WalletDataList = [
      ...walletDataList,[
        walletAddress,
        optionList[currentNFT].inscriptionId,
        "Unspent"
      ]
    ];
    const t_NFTDataList = nftDataList.slice(0, currentNFT).concat(nftDataList.slice(currentNFT + 1));
    setNFTDataList(t_NFTDataList);
    setWalletDataList(t_WalletDataList);
    setWalletAddress("");
  }
  const handleWalletAddressChange = (address) => {
    if(address === "" || validateAddress(address)){
      setErrorMessageWallet('  ');
    } else setErrorMessageWallet('Invalid wallet address now');
    setWalletAddress(address);
  }
  const handleAirdropClick = async () => {
    if(walletDataList.length === 0) return;
    setLoading(true);
    const level = await getLevelOfUser(drc20s, nfts);
    console.log("LEVEL", level);
    const wallets = walletDataList.map((wallet) => wallet[0]);
    const inscriptions = walletDataList.map((wallet) => wallet[1]);
    // console.log("wallets", wallets);
    const result = await sendAirdropNFTs(address, privateKey, wallets, inscriptions, level);
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
      const t_WalletDataList = walletDataList.map((wallet) => [wallet[0], shortenTransaction(result.txids[0]), message]);
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
  const handleRemove = (index) => {
    const t_WalletDataList = walletDataList.slice(0, index).concat(walletDataList.slice(index+1, walletDataList.length));
    const t_NFTDataList = nftDataList;
    const t_data = nfts.find((nft) => nft.inscriptionId === walletDataList[index][1]);
    t_NFTDataList.push(t_data);
    setWalletDataList(t_WalletDataList);
    setNFTDataList(t_NFTDataList);
  }
  const handleClearAll = () => {
    setNFTDataList(nfts);
    setCurrentNFT(0);
    setWalletAddress("");
    setRemainWallet(0);
    setErrorMessageWallet("");
    setCurrentPage(1);
    setWalletDataList([]);
    setLoading(false);
  }
  const handleUploadCSV = (array) => {
    const t_WalletDataList = [];
    let t_NFTDataList = nftDataList;
    for(let i = 0;i < array.length; i ++) {
      if(array[i].wallet === undefined || array[i].nft === undefined) {
        alertAmountInvalidDialog("CSV file type not valid!");
        return;
      } else if (!validateAddress(array[i].wallet)) {
        alertAmountInvalidDialog(`${array[i].wallet}\nWallet is not valid!`);
        return;
      } else {
        const temp = t_NFTDataList.find((nft) => nft.inscriptionId === array[i].nft);
        if(!temp) {
          alertAmountInvalidDialog(`${array[i].nft}\nNFT is not valid!`);
          return;
        }
        t_NFTDataList = t_NFTDataList.filter((nft) => nft !== temp);
        t_WalletDataList.push([array[i].wallet, array[i].nft, "Unspent"]);
      }
    }
    // const t_WalletDataList =  array.map((item) => item['wallet']);
    setWalletDataList(t_WalletDataList);
    setNFTDataList(t_NFTDataList);
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
              <AirdropRadio isActive={false}>
                Airdrop tool for drc-20
              </AirdropRadio>
            </BigAirdropRadio>
            <SmallAirdropRadio to={BASE_URL + "/airdrop/airdrop-drc20"}>
              <AirdropRadio isActive={false}>
                DRC-20
              </AirdropRadio>
            </SmallAirdropRadio>
            <BigAirdropRadio to={BASE_URL + "/airdrop/airdrop-nft"}>
              <AirdropRadio isActive={true}>
                Airdrop tool for nft
              </AirdropRadio>
            </BigAirdropRadio>
            <SmallAirdropRadio to={BASE_URL + "/airdrop/airdrop-nft"}>
              <AirdropRadio isActive={true}>
                NFT
              </AirdropRadio>
            </SmallAirdropRadio>
          </BodyOptionWrapper>
          <BodyContainer connected={connected}>
            <TokenDataOption>
              <AirdropInput
                isRequired={false}
                title="Enter wallet address here"
                type="text"
                value={walletAddress}
                setValue={handleWalletAddressChange}
                errorMessage={errorMessageWallet} 
              />
              <AirdropSelect
                isRequired={true}
                title="Select NFT Token"
                options={optionList}
                currentValue={currentNFT}
                setCurrentValue={setCurrentNFT}
              />
              <ButtonWrapper>
                <AddButton onClick={handleAddClick} margin="0px 0px 7px 0px">Add</AddButton>
              </ButtonWrapper>
            </TokenDataOption>
            <AirdropTable
              title="Wallet List"
              fieldNameList={AIRDROP_NFT_TABLE_LIST}
              tableItemList={walletDataList}
              page={currentPage}
              itemPerPage={itemsPerPage}
              handleClearAll={handleClearAll}
              handleRemove={handleRemove}
              handleUploadCSV={handleUploadCSV}
              linkDownloadCSV={LINK_DOWNLOAD_CSV_NFT}
              nameCSV={NAME_DOWNLOAD_CSV_NFT}
            />
            <AirdropStatusInfoWrapper>
              <AirdropStatusDescription>Total wallet: {walletDataList.length}</AirdropStatusDescription>
              <AirdropStatusDescription>Sent wallet: {walletDataList.length - remainWallet}</AirdropStatusDescription>
              <AirdropStatusDescription>Remain wallet: {remainWallet}</AirdropStatusDescription>
            </AirdropStatusInfoWrapper>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={walletDataList.length} setPageNumber={setCurrentPage}/>
            <AirdropButton onClick={handleAirdropClick} disabled={walletDataList.length === 0 }>
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
  max-width: 1600px;
  margin: auto;
  display: flex;
  justify-content: center;
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
  align-items: flex-end;
  @media (max-width: 600px) {
    gap: 10px;
    flex-direction: column;
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
const ButtonWrapper = styled.div`
  margin-left: -50px;
`;
const StyledLinkA = styled.a`
  text-decoration: none;
`
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
export default AirdropNFTPage;
