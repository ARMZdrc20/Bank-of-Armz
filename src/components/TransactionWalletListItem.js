import React from "react";
import styled from "styled-components";
import { FaAngleRight } from "react-icons/fa";

import { satoshisToValue, shortenTransaction } from "../config/utils";
import Row from "./Row";

const TransactionWalletListItem = (props) => {
  const handleClick = () => {
    console.log("EHLLO");
    window.open(`https://sochain.com/resolver/DOGE/?query=${props.data.txid}`)
  };
  return (
    <ListItemView onClick={handleClick}>
      <Row gap="10px">
        <TransactionItemText>
          {shortenTransaction(props.data.txid)}
        </TransactionItemText>
        {props.data.confirmations === undefined && (
          <PendingBadge>Pending</PendingBadge>
        )}
      </Row>
      {props.data.satoshis > 0 ? (
        <TransactionSatoshiPlus>
          {satoshisToValue(props.data.satoshis)}
        </TransactionSatoshiPlus>
      ) : (
        <TransactionSatoshiMinus>
          {satoshisToValue(props.data.satoshis)}
        </TransactionSatoshiMinus>
      )}
    </ListItemView>
  );
};

const ListItemView = styled.div`
  width: 100%;
  height: 50px;
  min-height:50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 20px;
  font-family: Livvic, sans-serif;
  cursor: pointer;
  user-select: none;
  background-color: #00000020;
  &: hover {
    background-color: #00000050;
  }
`;
const PendingBadge = styled.div`
  font-size: 15px;
  font-family: Livvic, sans-serif;
  padding: 2px 5px;
  color: #c14f4f;
  background-color: #c14f4f20;
`;
const TransactionItemText = styled.div`
  font-size: 20px;
  font-family: Livvic, sans-serif;
`;
const TransactionSatoshiPlus = styled.div`
  background-color: #00ff0020;
  color: #00ff00;
  width: 50px;
  font-size: 12px;
  font-family: Livvic, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: bold;
`;
const TransactionSatoshiMinus = styled.div`
  background-color: #0000ff20;
  color: #0000ff;
  width: 50px;
  font-size: 12px;
  font-family: Livvic, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: bold;
`;

export default TransactionWalletListItem;
