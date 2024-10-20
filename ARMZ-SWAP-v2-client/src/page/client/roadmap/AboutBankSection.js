import React from "react";
import styled from "styled-components";

import ArmzLogo from "../../../assets/armzLogo.png";

const AboutBankSection = () => {
    return (
        <Wrapper>
            <ArmzLogoImage src={ArmzLogo}/>
            <RoadmapTitle>The Bank of ARMZ</RoadmapTitle>
            <RoadmapDescription>Welcome to the Bank of ARMZ, a cutting-edge blockchain project where you can seamlessly swap ARMZ tokens for ARMZ notes. Just like a traditional bank exchanging gold for paper money, you can deposit your ARMZ fungible tokens and receive equivalent ARMZ note NFTs. Your ARMZ tokens are securely stored in a multi-signature wallet, ensuring that neither the server nor the user can control them without mutual consent. When you return your ARMZ notes, you regain access to your ARMZ tokens.  Experience secure, innovative digital finance with the Bank of ARMZ, where your assets are protected and empowered within a futuristic blockchain ecosystem.</RoadmapDescription>
        </Wrapper>
    )
};


const Wrapper = styled.div`
    margin-top: 66px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    @media (max-width: 650px) {
        gap: 20px;
        padding: 20px;
    }
`;
const ArmzLogoImage = styled.img`
    width: 200px;
    height: 200px;
    @media (max-width: 400px) {
        width: 150px;
        height: 150px;
    }
`;
const RoadmapTitle = styled.div`
    font-family: Lily Script One, sans-serif;
    color: #c14f4f;
    font-size: 64px;
    @media (max-width: 650px) {
        font-size: 40px;
    }
    @media (max-width: 400px) {
        font-size: 30px;
    }
`;
const RoadmapDescription = styled.div`
    font-family: Livvic, sans-serif;
    color: #c14f4f;
    font-size: 24px;
    line-height: 180%;
    letter-spacing: 3px;
    text-align: center;
    @media (max-width: 650px) {
        font-size: 20px;
        line-height: 130%;
    }
    @media (max-width: 650px) {
        font-size: 15px;
    }
`
export default AboutBankSection;