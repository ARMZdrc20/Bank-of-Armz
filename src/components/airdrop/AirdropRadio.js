import React from "react";
import styled from "styled-components";

import Row from "../Row";

const AirdropRadio = ({ isActive, children }) => {
    return (
        <Wrapper>
            <Button active={isActive}/>
            <ButtonText>{children}</ButtonText>
        </Wrapper>
    )
};

const Wrapper = styled(Row)`
    gap: 15px;
    align-items: center;
`;
const Button = styled.div`
    position: relative;
    width: 20px;
    height: 20px;
    border: 2px solid #C14F4F;
    border-radius: 10px;
    background-color: white;
    &::after {
        position: absolute;
        left: 2px;
        top: 2px;
        content: "";
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background-color: ${props => props.active ? "#C14F4F" : "white"};
    }
`;
const ButtonText = styled.div`
    font-size: 20px;
    color: #C14F4F;
    font-family: Livvic, sans-serif;
  @media (max-width: 1130px) {
    font-size: 15px;
  }
`;

export default AirdropRadio;