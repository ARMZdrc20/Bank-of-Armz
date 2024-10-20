import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import Row from "../Row";
import Col from "../Col";
import IconContainer from "../IconContainer";

import ArrowIcon from "../../assets/ico_arrowButton.png";
import { NFT_IMAGE_URL, SERVER_URL } from "../../config/constants";
import { shortenTransaction } from "../../config/utils";
import axios from "axios";

const OptionType1 = (props) => {
  return (
    <>
      <StyledOptionAvatar src={props.image} />
      <OptionText>{props.title}</OptionText>
      {props.count && (
        <OptionAmount>{props.count}</OptionAmount>
      )}
    </>
  )
}

const OptionType2 = (props) => {
  const [image, setImage] = useState("");
  useEffect(() => {
    (async () => {
      if(props.imageType !== "image") {
        const result_nft_image = await axios.get(`${SERVER_URL}/api/information/nfts/${props.inscriptionId}/image`);
        if(result_nft_image.data.data) setImage(result_nft_image.data.data);
        else setImage(NFT_IMAGE_URL + "/" + props.inscriptionId);
      } else setImage(NFT_IMAGE_URL + "/" + props.inscriptionId);
    })();
  }, [props.inscriptionId]);

  return (
    <>
      {props.imageType === "html" ? (
        <ImageIframe src={image} />
      ) : (
        <ImageImage src={image} />
      )}
      <OptionText>{shortenTransaction(props.inscriptionId)}</OptionText>
    </>
  )
}

const AirdropSelect = ({
  isRequired,
  title,
  currentValue,
  setCurrentValue,
  options,
  errorMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  const handleSelect = (option) => {
    setCurrentValue(option);
    setIsOpen(false);
  };

  return (
    <Wrapper>
      <Title>
        {isRequired && <Required>*</Required>}
        &nbsp;{title}:
      </Title>
      <StyledSelectWrapper ref={selectRef}>
        <StyledSelectContainer onClick={() => setIsOpen(!isOpen)}>
          <StyledSelect>
            {options.length && (
              (options[currentValue].imageType ? <OptionType2 {...options[currentValue]} /> : <OptionType1 {...options[currentValue]} />)
            )}
          </StyledSelect>
          <IconContainer src={ArrowIcon} />
        </StyledSelectContainer>
        <OptionContainer isOpen={isOpen}>
          {options.map((option, index) => (
            <StyledOptionWrapper
              key={index}
              value={index}
              onClick={() => handleSelect(index)}
            >
              {option.imageType ? <OptionType2 {...option} /> : <OptionType1 {...option} />}
            </StyledOptionWrapper>
          ))}
        </OptionContainer>
      </StyledSelectWrapper>
      <ErrorMessage>{errorMessage ? errorMessage : " "}</ErrorMessage>
    </Wrapper>
  );
};

const Wrapper = styled(Col)`
  gap: 17px;
  width: 100%;
  @media (max-width: 1130px) {
    gap: 10px;
  }
`;
const Required = styled.span`
  color: red;
`;
const Title = styled.div`
  color: #c14f4f;
  font-size: 20px;
  width: 100%;
  font-family: Livvic, sans-serif;
  @media (max-width: 1130px) {
    font-size: 15px;
  }
`;
const StyledSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const StyledSelectContainer = styled(Row)`
  justify-content: space-between;
  width: 100%;
  padding: 12px 20px;
  font-size: 20px;
  border: 1px solid #c14f4f;
  border-radius: 10px;
  color: #c14f4f;
  cursor: pointer;
  user-select: none;
  @media (max-width: 1130px) {
    padding: 6px 10px;
  }
`;
const StyledSelect = styled(Row)`
  gap: 20px;
  align-items: center;
`;
const StyledOptionWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 6px 10px;
  cursor: pointer;
  user-select: none;

  &: hover {
    background-color: #ddd;
  }
`;
const OptionContainer = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px 10px;
  border: 1px solid #c14f4f;
  border-radius: 10px;
  background-color: white;
  z-index: 1;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transform: ${(props) =>
    props.isOpen ? "translateY(0)" : "translateY(-10px)"};
  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
  transition: all 0.3s ease;
`;
const OptionText = styled.div`
  font-size: 20px;
  color: #c14f4f;
  font-family: Livvic, sans-serif;
  @media (max-width: 1130px) {
    font-size: 15px;
  }
`;
const OptionAmount = styled.div`
  font-size: 20px;
  color: #c14f4f;
  font-family: Livvic, sans-serif;
  @media (max-width: 1130px) {
    font-size: 15px;
  }
`;
const StyledOptionAvatar = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 20px;
  @media (max-width: 1130px) {
    width: 15px;
    height: 15px;
  }
`;
const ErrorMessage = styled.div`
  margin-top: -10px;
  margin-left: 10px;
  width: 100%;
  color: red;
  font-size: 12px;
  font-family: Livvic, sans-serif;
`;
const ImageIframe = styled.iframe`
  width: 25px;
  height: 25px;
  color-scheme: initial;
  border: none;
  border-radius: 10px;
  @media (max-width: 1130px) {
    width: 15px;
    height: 15px;
  }
`;
const ImageImage = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 10px;
  @media (max-width: 1130px) {
    width: 15px;
    height: 15px;
  }
`;
export default AirdropSelect;
