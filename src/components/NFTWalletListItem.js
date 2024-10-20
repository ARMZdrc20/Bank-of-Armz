import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaAngleRight } from "react-icons/fa";

import { NFT_IMAGE_URL, SERVER_URL } from "../config/constants";
import { shortenTransaction } from "../config/utils";
import Row from "./Row";
import axios from "axios";

const NFTWalletListItem = (props) => {
  const [image, setImage] = useState("");
  useEffect(() => {
    (async () => {
      if(props.data.imageType !== "image") {
        const result_nft_image = await axios.get(`${SERVER_URL}/api/information/nfts/${props.data.inscriptionId}/image`);
        if(result_nft_image.data.data) setImage(result_nft_image.data.data);
        else setImage(NFT_IMAGE_URL + "/" + props.data.inscriptionId);
      } else setImage(NFT_IMAGE_URL + "/" + props.data.inscriptionId);
    })();
  }, []);

  return (
    <ListItemView onClick={() => props.handleClick(props.data)}>
      <Row gap="10px">
        {props.data.imageType === "html" ? (
          <ImageIframe src={image} />
        ) : (
          <ImageImage src={image} />
        )}
        <NFTItemText>{shortenTransaction(props.data.txid)}</NFTItemText>
      </Row>
      <FaAngleRight />
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
const ImageIframe = styled.iframe`
  width: 45px;
  height: 45px;
  color-scheme: initial;
  border: none;
  border-radius: 10px;
`;
const ImageImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 10px;
`;
const NFTItemText = styled.div`
  font-size: 20px;
  font-family: Livvic, sans-serif;
`;

export default NFTWalletListItem;
