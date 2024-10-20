import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "@chakra-ui/react";

import MenuIcon from "../assets/ico_menu.png";
import RefreshIcon from "../assets/ico_refresh.png";
import DogecoinIcon from "../assets/dogeIcon.png";

import Row from "./Row";
import Col from "./Col";
import IconContainer from "./IconContainer";
import { shortenAddress } from "../config/utils";
import { isBackuped } from "../config/wallet";
import {
  disconnectWallet,
  deleteWallet,
  moveToSendDoge,
  startedLoading,
  updateWalletInfo,
  finishedLoading,
  moveToSendNFT,
  moveToSendDRC20,
  updateMessage,
  moveToShowSecret,
} from "../redux/walletSlice";
import NFTWalletListItem from "./NFTWalletListItem";
import DRC20WalletListItem from "./DRC20WalletListItem";
import { getTransactions, getWalletInfo } from "../services/walletService";
import TransactionWalletListItem from "./TransactionWalletListItem";

const ContextMenuBar = (props) => {
  const dispatch = useDispatch();
  const handleDisconnectWalletClick = () => {
    dispatch(disconnectWallet());
  };
  const handleDeleteAccountClick = () => {
    dispatch(deleteWallet());
  };
  const handleSendDogeClick = () => {
    dispatch(moveToSendDoge());
  };
  const handleShowSecretClick = () => {
    dispatch(moveToShowSecret());
  };

  return (
    <ContextMenuBarWrapper show={props.show}>
      <ContextMenuItem onClick={handleSendDogeClick}>Send doge</ContextMenuItem>
      <ContextMenuItem onClick={handleShowSecretClick}>
        Show my secret
      </ContextMenuItem>
      <ContextMenuItem onClick={handleDeleteAccountClick}>
        Delete Account
      </ContextMenuItem>
      <ContextMenuItem onClick={handleDisconnectWalletClick}>
        Disconnect Wallet
      </ContextMenuItem>
    </ContextMenuBarWrapper>
  );
};

const AssetsTabContent = (props) => {
  const dispatch = useDispatch();

  const handleNFTItemClick = (nft) => {
    dispatch(moveToSendNFT({ nft: nft }));
  };
  const handleDRC20ItemClick = (drc20, tick) => {
    dispatch(moveToSendDRC20({ tick: tick, drc20: drc20 }));
  };

  return (
    <Row justify="center">
      {props.nfts.length === 0 && Object.keys(props.tokens).length === 0 ? (
        <ArmzDescription>nothing here</ArmzDescription>
      ) : (
        <TokenWrapper>
          {props.nfts.length !== 0 && (
            <>
              <TokenTitle>NFTs</TokenTitle>
              {props.nfts.map((nft, index) => (
                <NFTWalletListItem
                  data={nft}
                  key={index}
                  handleClick={handleNFTItemClick}
                />
              ))}
            </>
          )}
          {props.tokens.length !== 0 && (
            <>
              <TokenTitle>DRC-20</TokenTitle>
              {props.tokens.map((drc20, index) => (
                <DRC20WalletListItem
                  name={drc20.tick}
                  total={parseInt(drc20.total)}
                  image={drc20.image}
                  key={index}
                  handleClick={() =>
                    handleDRC20ItemClick(drc20, drc20.tick)
                  }
                />
              ))}
            </>
          )}
        </TokenWrapper>
      )}
    </Row>
  );
};

const TransactionTabContent = (props) => {
  return (
    <Row justify="center">
      {props.txs.length === 0 ? (
        <ArmzDescription>nothing here</ArmzDescription>
      ) : (
        <TokenWrapper>
          {props.txs.length !== 0 &&
            props.txs.map((tx, index) => (
              <TransactionWalletListItem data={tx} key={index} />
            ))}
          {props.cursor !== null &&
            (props.loading === true ? (
              <Spinner color="#c14f4f" width={30} height={30} minHeight={30}/>
            ) : (
              <ViewMoreButton onClick={props.viewMoreButtonClick}>
                More
              </ViewMoreButton>
            ))}
        </TokenWrapper>
      )}
    </Row>
  );
};

const ArmzStepWalletInfo = (props) => {
  const dispatch = useDispatch();
  const address = useSelector((state) => state.wallet.address);
  const tokens = useSelector((state) => state.wallet.drc20s);
  const nfts = useSelector((state) => state.wallet.nfts);
  const balance = useSelector((state) => state.wallet.balance);
  const message = useSelector((state) => state.wallet.toastMessage);
  const dogecoinPrice = useSelector((state) => state.information.dogecoinPrice);

  const [showMenuBar, setShowMenuBar] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [visibleToast, setVisibleToast] = useState(false);
  const [txs, setTxs] = useState([]);
  const [cursor, setCursor] = useState("");
  const [loading, setLoading] = useState(false);

  const updateTransactions = async (cursor) => {
    const result = await getTransactions(address, cursor);
    if(result.cursor) setCursor(result.cursor);
    if (cursor) setTxs([...txs, ...result.txs]);
    else setTxs([...result.txs]);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    updateTransactions();
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

  useEffect(() => {
    if (message && !visibleToast) setVisibleToast(true);
  }, [message]);

  const handleAddressClick = () => {
    navigator.clipboard.writeText(address).then(() => {
      // console.log("Address copied!");
      dispatch(updateMessage({ message: "Address copied!" }));
      setVisibleToast(true);
    });
  };
  const handleRefreshClick = () => {
    // dispatch(disconnectWallet());
    dispatch(startedLoading());
    getWalletInfo(address).then((result) => {
      dispatch(
        updateWalletInfo({
          balance: result.balance,
          utxos: result.utxos,
          nfts: result.nfts,
          drc20s: result.tokens,
        })
      );
      dispatch(finishedLoading()); // setLoading(false);
    });
    setTxs([]);
    setLoading(true);
    updateTransactions();
  };
  const handleMenuClick = () => {
    // removePrivateKey();
    // dispatch(deleteWallet());
    setShowMenuBar(!showMenuBar);
  };
  const handleTabClick = (index) => {
    setCurrentTab(index);
  };

  return (
    <Wrapper>
      <Row justify="space-between">
        <Address onClick={handleAddressClick}>
          {shortenAddress(address)}
        </Address>
        <Row gap="20px">
          <IconContainer
            height="25px"
            src={RefreshIcon}
            handleClick={handleRefreshClick}
          />
          <div style={{ position: "relative" }}>
            <IconContainer
              height="25px"
              src={MenuIcon}
              handleClick={handleMenuClick}
            />
            <ContextMenuBar show={showMenuBar} />
          </div>
        </Row>
      </Row>
      {props.loading === false ? (
        <>
          <Row gap="10px">
            <DogecoinIconImage src={DogecoinIcon} />
            <ArmzDescription>
              {balance.toFixed(2)} ( ${(dogecoinPrice * balance).toFixed(2)} )
            </ArmzDescription>
          </Row>
          {isBackuped() === false && (
            <Row gap="5px">
              <ArmzDescription>
                Your wallet needs backup&nbsp;
                <BackupButton>Backup now</BackupButton>
              </ArmzDescription>
            </Row>
          )}
          <Row gap="15px">
            <Tab onClick={() => handleTabClick(0)} active={currentTab === 0}>
              Transactions
            </Tab>
            <Tab onClick={() => handleTabClick(1)} active={currentTab === 1}>
              Assets
            </Tab>
          </Row>
          {currentTab === 0 && (
            <TransactionTabContent
              txs={txs}
              viewMoreButtonClick={() => {
                setLoading(true);
                updateTransactions(cursor);
              }}
              cursor={cursor}
              loading={loading}
            />
          )}
          {currentTab === 1 && <AssetsTabContent nfts={nfts} tokens={tokens} />}
        </>
      ) : (
        <Row width="100%" height="100%" justify="center">
          <Spinner color="#c14f4f" width={30} height={30} />
        </Row>
      )}
      <ToastBox isvisible={visibleToast}>{message}</ToastBox>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  bottom: -25px;
  right: 0px;
  transform: translateY(100%);
  width: 550px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  padding: 40px 40px;
  border: 2px solid #efecc2;
  border-radius: 20px;
  background: radial-gradient(circle, #efecc21a, #f7f4cb1a);
  backdrop-filter: blur(42px);
  gap: 20px;
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
const Address = styled.div`
  font-size: 24px;
  color: #c14f4f;
  font-family: Livvic, sans-serif;
  cursor: pointer;
  user-select: none;
  margin-left: -15px;
  padding: 2px 15px;
  border-radius: 20px;
  &:hover {
    background-color: #ffffff80;
  }
  &:active {
    background-color: #ffffffa0;
  }
`;
const DogecoinIconImage = styled.img`
  width: 20px;
`;
const ArmzDescription = styled.div`
  font-size: 20px;
  color: #c14f4f;
  font-family: Livvic, sans-serif;
`;
const BackupButton = styled.span`
  font-size: 20px;
  color: #791e8f;
  font-family: Livvic, sans-serif;
`;
const Tab = styled.div`
  color: white;
  font-family: Livvic, sans-serif;
  border-radius: 20px;
  display: flex;
  font-size: 20px;
  padding: 2px 20px;
  background-color: ${(props) => (props.active ? "black" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#C14F4F")};
  user-select: none;
  cursor: pointer;
  &: hover {
    background-color: ${(props) => (props.active ? "#333" : "#eeeeee80")};
  }
  &: active {
    background-color: ${(props) => (props.active ? "#222" : "#eeeeeec0")};
  }
`;
const TokenWrapper = styled(Col)`
  width: 100%;
  gap: 10px;
  height: 300px;
  max-height: 300px;
  overflow-y: auto;
`;
const TokenTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  font-family: Livvic, sans-serif;
`;
const ToastBox = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-60%, -80%);

  z-index: 1;
  padding: 5px 20px;
  width: fit-content;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  color: white;
  font-size: 14px;
  font-weight: bold;
  font-family: Livvic, sans-serif;

  opacity: 1;
  transition: opacity 0.5s ease-in-out, height 0.5s ease-in-out;

  opacity: ${(props) => (props.isvisible ? "1" : "0")};
`;
const ContextMenuBarWrapper = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  right: 0;
  width: 120px;
  z-index: 5;
  margin-top: 10px;
  background-color: white;
  border: 1px solid black;
`;
const ContextMenuItem = styled.div`
  width: 100%;
  padding: 5px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: #eee;
  }
  &:active {
    background-color: #ddd;
  }
`;
const ViewMoreButton = styled.div`
  margin-bottom: -15px;
  width: 200px;
  height: 40px;
  font-size: 25px;
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

export default ArmzStepWalletInfo;
