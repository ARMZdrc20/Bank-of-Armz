import React from "react";
import styled from "styled-components";

import ArrowButtonImage from "../assets/ico_arrowButton.png";

const SelectChainButton = () => {
    return (
        <Wrapper>
            <TitleText>Dogecoin</TitleText>
            <ArrowButton src={ArrowButtonImage} />
        </Wrapper>
    )
};

const Wrapper = styled.div`
    width: 170px;
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 15px 0px 20px;
    background-color: #EFECC2;
    border-radius: 20px;
    user-select: none;
    cursor: pointer;
    @media (max-width: 630px) {
      display: none;
    }
`
const TitleText = styled.div`
    font-family: Livvic, sans-serif;
    font-size: 16px;
    font-weight: bold;
    color: #c14f4f;
`
const ArrowButton = styled.img`
    width: 18px;
`

export default SelectChainButton;