import React, { useState } from "react";
import styled from "styled-components";

import IconFaqBottomButton from "../assets/ico_faqBottomButton.png";
import IconFaqTopButton from "../assets/ico_faqTopButton.png";

const FaqItem = ({id, title, content}) => {
    const [active, setActive] = useState(false);
    return (
        <FaqItemWrapper>
            <FaqItemTitleWrapper onClick={() => setActive(!active)}>
                <FaqItemTitle>{id}.&nbsp;{title}</FaqItemTitle>
                <FaqIcon src={active ? IconFaqTopButton : IconFaqBottomButton} />
            </FaqItemTitleWrapper>
            <FaqDescription active={active}>{content}</FaqDescription>
        </FaqItemWrapper>
    );
};

const FaqItemWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 15px 30px 15px 45px;
    background-color: white;
    border: 1px solid #c14f4f;
    @media (max-width: 700px) {
        padding: 10px 10px 10px 20px;
    }
`;
const FaqItemTitleWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
`;
const FaqItemTitle = styled.div`
    font-family: Livvic, sans-serif;
    font-weight: bold;
    color: #c14f4f;
    font-size: 25px;
    @media (max-width: 700px) {
        font-size: 20px;
    }
    @media (max-width: 450px) {
        font-size: 15px;
    }
`;
const FaqIcon = styled.img`
    width: 70px;
    @media (max-width: 700px) {
        width: 40px;
    }
`;
const FaqDescription = styled.div`
    display: ${(props) => props.active ? "block" : "none"};
    width: 100%;
    text-align: justiy;
    color: black;
    font-size: 20px;
    white-space: pre-wrap;
    margin-bottom: 15px;
    @media (max-width: 700px) {
        font-size: 15px;
    }
`;

export default FaqItem;