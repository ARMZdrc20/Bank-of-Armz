import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaAngleRight } from "react-icons/fa";

import { formattedNumber } from "../config/utils";
import Row from "./Row";
import { SERVER_URL } from "../config/constants";
import axios from "axios";

const DRC20WalletListItem = (props) => {

  return (
    <ListItemView onClick={() => props.handleClick()}>
      <Row gap="10px">
        <ImageImage src={props.image} />
        <DRC20ItemText>{props.name}</DRC20ItemText>
      </Row>
      <Row gap="20px">
        <DRC20ItemCount>{formattedNumber(props.total)}</DRC20ItemCount>
        <FaAngleRight />
      </Row>
    </ListItemView>
  );
};

const ListItemView = styled.div`
  width: 100%;
  height: 60px;
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
const ImageImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 10px;
`;
const DRC20ItemText = styled.div`
  font-size: 20px;
  font-family: Livvic, sans-serif;
`;
const DRC20ItemCount = styled.div`
  font-weight: bold;
  font-size: 20px;
  font-family: Livvic, sans-serif;
`;

export default DRC20WalletListItem;
