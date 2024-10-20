import React from "react";
import styled from "styled-components";

const ChainButton = (props) => {
    return (
        <Wrapper bkcolor={props.bkcolor}>
            <ChaingImage src={props.image} />
            <ChainText>{props.name}</ChainText>
        </Wrapper>
    )
};

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    padding: 8px 25px;
    background-color: ${props => props.bkcolor ? props.bkcolor : "tomato"};
    border-radius: 40px;
    gap: 10px;
    user-select: none;
    cursor: pointer;
    &: hover {
        &:: before {
            position: absolute;
            content: "";
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ffffff30;
        }
    }
    &: active {
        &:: before {
            position: absolute;
            content: "";
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ffffff50;
        }
    }
    @media (max-width: 620px) {
        padding: 5px 10px;
    }
`;
const ChaingImage = styled.img`
    width: 35px;
    height: 35px;
    @media (max-width: 620px) {
        width: 20px;
        height: 20px;
    }
`;
const ChainText = styled.div`
    font-family: Livvic, sans-serif;
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
    @media (max-width: 620px) {
        font-size: 15px;
    }
`
export default ChainButton;