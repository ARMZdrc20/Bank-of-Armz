import React from "react";
import styled from "styled-components";
import FaqItem from "../../../components/FaqItem";

const faqList = [
  {
    title: "MVP Launch: The Foundation",
    content: `ARMZ Swap and Wallet Release:\n\nLaunch the MVP featuring the ARMZ Swap and Wallet, enabling seamless transactions of ARMZ tokens and notes.\n\nUsers can inscribe, send, and receive Doginals and Dogecoin with ease.`,
  },
  {
    title: "Full Integration: The Marketplace",
    content: "DRC-20 and NFT Marketplace Launch:\n\nDevelop and launch a fully integrated marketplace for DRC-20 tokens and NFTs. This platform will enable seamless trading, buying, and selling of digital assets within the Bank of ARMZ ecosystem.",
  },
  {
    title: "Staking 2.0: Passive Earnings",
    content: "Staking Without Staking:\n\nIntroduce the Staking 2.0 mechanism, allowing ARMZ Note holders to earn a percentage of platform fees (from the marketplace, swap, etc.) without traditional lockups.\n\nSecond Edition Banknotes:\n\nLaunch the second edition of banknotes: 1,000 notes of various lower denominations, adding value and utility within the ecosystem.",
  },
  {
    title: "DAO Governance: Community-Driven Future",
    content: "Empowering Note Holders:\n\nImplement DAO governance, where note holders can participate in key decisions, such as:\n\nThe release schedule of future denominations.\n\nAdjusting platform fees and rewards distribution.\n\nMaking significant strategic decisions.",
  },
  {
    title: "Long-Term Vision: Controlled Expansion",
    content: "100-Year Note Release Timeline:\n\nInitially set a 100-year timeframe for the complete release of ARMZ notes, with potential for adjustments. Governance may decide to accelerate the timeline to a minimum of 31 years or extend it up to 313 years, ensuring a balanced and sustainable approach to the ARMZ ecosystem's growth.\n\nHalving System for Note Releases:\n\nThe release of new banknotes will mirror a halving system, gradually releasing fewer and fewer notes of lower denominations until the total supply of ARMZ is fully represented in notes.\n\nAnd Beyond...\n\nTop Secret Developments:\n\nExpect the unexpected. We're not ready to divulge everything yet, but rest assured—bombs will be dropped, shots will be fired, kings will fall and new a new King will rise - Doginals.2.0 ARMZ-ORD",
  },
];

const RoadmapSection = () => {
  return (
    <Wrapper>
      <Title>ROADMAP</Title>
      <RoadmapWrapper>
        {faqList.map((faq, index) => (
          <FaqItem
            key={index}
            id={index + 1}
            title={faq.title}
            content={faq.content}
          />
        ))}
      </RoadmapWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 45px;
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  @media (max-width: 700px) {
    padding: 20px;
  }
`;
const Title = styled.div`
  padding: 15px 70px;
  display: flex;
  justify-conent: center;
  align-items: center;
  border: 4px solid #c14f4f;
  font-family: Livvic, sans-serif;
  font-weight: bold;
  color: #c14f4f;
  font-size: 48px;
  @media (max-width: 700px) {
    padding: 10px 50px;
    font-size: 30px;
  }
  @media (max-width: 400px) {
    padding: 10px 30px;
    font-size: 24px;
  }
`;
const RoadmapWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default RoadmapSection;
