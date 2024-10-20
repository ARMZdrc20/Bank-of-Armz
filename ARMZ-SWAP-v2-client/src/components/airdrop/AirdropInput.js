import React from "react";
import styled from "styled-components";

import Col from "../Col";

const AirdropInput = ({ isRequired, title, type, value, setValue, errorMessage }) => {
    const handleChange = (e) => {
        if(type === "number") {
            if(e.target.value >= 0) setValue(e.target.value);
        } else setValue(e.target.value);
    }
    return (
        <Wrapper>
            <Title>
                {isRequired && <Required>*</Required>}
                &nbsp;{title}:
            </Title>
            <StyledInput type={type} value={value} onChange={handleChange} />
            <ErrorMessage>{(errorMessage ? errorMessage : " ")}</ErrorMessage>
        </Wrapper>
    )
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
    color: #C14F4F;
    font-size: 20px;
    width: 100%;
    font-family: Livvic, sans-serif;
    @media (max-width: 1130px) {
        font-size: 15px;
    }
`;
const StyledInput = styled.input`
    width: 100%;
    padding: 12px 20px;
    font-size: 20px;
    font-family: Livvic, sans-serif;
    border: 1px solid #C14F4F;
    border-radius: 10px;
    color: #C14F4F;
    transition: 0.5s;
    @media (max-width: 1130px) {
        padding: 6px 10px;
        font-size: 15px;
    }
`;
const ErrorMessage = styled.div`
    margin-top: -10px;
    margin-left: 10px;
    width: 100%;
    color: red;
    font-size: 12px;
    font-family: Livvic, sans-serif;
`

export default AirdropInput;