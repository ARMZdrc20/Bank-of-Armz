import React from "react";
import styled from "styled-components";

import Row from "../../../components/Row";
import Col from "../../../components/Col";

import IconMetamask from "../../../assets/wallet/ico_metamask.png";
import IconArmz from "../../../assets/wallet/ico_armz.png";
import IconMyDoge from "../../../assets/wallet/ico_mydoge.png";
import IconDogeLab from "../../../assets/wallet/ico_dogeLab.png";
import IconDoggyMarket from "../../../assets/wallet/ico_doggy.jpg";

const chainList = [
    {
        name: "Laika",
        hash: "0x1bFe52ec2486332297a8C0c21cEf651eA8A9fbb0",
        walletList: [
            IconMetamask
        ]
    },
    {
        name: "Dogechain",
        hash: "0xd5cfdb92446d52212db06cb941b21e5711aeedc7",
        walletList: [
            IconMetamask
        ]
    },
    {
        name: "Dogecoin",
        hash: "0xfb7c75d8abc454f47397ad10a16edc7ffc2c999e460e2a7216c295df8846af6ai0",
        walletList: [
            IconArmz,
            IconMyDoge,
            IconDogeLab,
            IconDoggyMarket
        ]
    },
];

const AboutOurTokenSection = () => {
    return (
        <Wrapper>
            <AboutOurTokenTitle>You can find our token here.</AboutOurTokenTitle>
            {chainList.map((chain, index) => (
                <Col gap="20px" key={index}>
                    <Col>
                        <ChainTitle>{chain.name}</ChainTitle>
                        <ChainHash>{chain.hash}</ChainHash>
                    </Col>
                    <Col gap="10px">
                        <ChainWallet>Supported wallets</ChainWallet>
                        <Row gap="20px">
                            {
                                chain.walletList.map((wallet, index) => (
                                    <ChainWalletImage src={wallet} key={index} />
                                ))
                            }
                        </Row>
                    </Col>
                </Col>
            ))}
        </Wrapper>
    )
};

const Wrapper = styled.div`
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    @media (max-width: 1050px) {
        gap: 30px;
    }
    @media (max-width: 660px) {
        gap: 10px;
    }
`;
const AboutOurTokenTitle = styled.div`
    font-family: Lily Script One, sans-serif;
    color: #c14f4f;
    font-size: 64px;
    padding: 10px;
    text-align: center;
    @media (max-width: 1050px) {
        font-size: 45px;
    }
    @media (max-width: 660px) {
        font-size: 30px;
    }
    @media (max-width: 460px) {
        font-size: 24px;
    }
`;
const ChainTitle = styled.div`
    font-family: Livvic, sans-serif;
    color: #c14f4f;
    font-size: 48px;
    font-weight: bold;
    @media (max-width: 1050px) {
        font-size: 32px;
    }
    @media (max-width: 660px) {
        font-size: 24px;
    }
    @media (max-width: 460px) {
        font-size: 20px;
    }
`;
const ChainHash = styled.div`
    font-family: Livvic, sans-serif;
    color: #c14f4f;
    font-size: 24px;
    text-align: center;
    word-break: break-all;
    @media (max-width: 1050px) {
        font-size: 20px;
    }
    @media (max-width: 870px) {
        font-size: 15px;
    }
`;
const ChainWallet = styled.div`
    font-family: Livvic, sans-serif;
    color: #c14f4f;
    font-size: 32px;
    @media (max-width: 1050px) {
        font-size: 24px;
    }
    @media (max-width: 660px) {
        font-size: 20px;
    }
`;
const ChainWalletImage = styled.img`
    width: 45px;
    @media (max-width: 1050px) {
        width: 35px;
    }
    @media (max-width: 660px) {
        width: 25px;
    }
`

export default AboutOurTokenSection;