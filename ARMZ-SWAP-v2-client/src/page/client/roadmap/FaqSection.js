import React from "react";
import styled from "styled-components";
import FaqItem from "../../../components/FaqItem";

const faqList = [
  {
    title: "Why ARMZ?",
    content: "ARMZ distinguishes itself as a revolutionary digital currency with its dual-token system and unique innovations. It is the first to integrate both fungible tokens and NFTs, allowing users to leverage the flexibility of a digital currency while participating in the world of unique digital collectibles. Additionally, ARMZ introduces the world's first digital banknotes, transforming how digital assets are represented and utilized. By converting ARMZ tokens into ARMZ note NFTs, it combines traditional finance concepts with cutting-edge blockchain technology. As a 2023 Doginals pioneer, ARMZ showcases originality and leadership in the evolving cryptocurrency landscape. ",
  },
  {
    title: "Why Dogecoin?",
    content: `Dogecoin is renowned as the "people's coin" and the progenitor of all memecoins. It holds a foundational role as the first memecoin and the mother of all meme-based cryptocurrencies. Its success and widespread appeal underscore its significance in the crypto community, symbolizing the power of memes and community-driven projects. Dogecoin's accessibility, playful nature, and strong community support have solidified its place as a beloved and influential cryptocurrency, reflecting its pioneering role in the memecoin ecosystem.`,
  },
  {
    title: "What is the Bank of ARMZ?",
    content: "The Bank of ARMZ is a groundbreaking blockchain-based financial platform that redefines how digital assets are managed. It allows users to exchange ARMZ tokens for ARMZ notes, similar to how traditional banks handle gold and paper money. Tokens are securely stored in a multi-signature wallet, ensuring that transactions require mutual consent for enhanced security. When users return ARMZ notes, they regain access to their ARMZ tokens. This innovative system combines the best of traditional banking and blockchain technology, offering a secure and futuristic approach to digital finance.",
  },
  {
    title: "The Future of ARMZ Token",
    content: "DAO Governance: Community-Driven Future\n\nEmpowering Note Holders: ARMZ will implement DAO governance to empower note holders with decision-making power. This system will allow participants to influence key aspects such as future note releases, platform fees, and strategic directions, ensuring that the community has a significant role in shaping the platform's future.\nLong-Term Vision: Controlled Expansion\n\n100-Year Note Release Timeline: The release of ARMZ notes will follow a 100-year timeline, with the flexibility for adjustments based on governance decisions. This timeline will feature a halving system for new note releases, gradually reducing the supply of lower denomination notes. This controlled expansion strategy aims to balance growth and sustainability within the ARMZ ecosystem.",
  },
];

const FaqSection = () => {
  return (
    <Wrapper>
      <Title>FAQ</Title>
      <FaqWrapper>
        {faqList.map((faq, index) => (
          <FaqItem
            key={index}
            id={index + 1}
            title={faq.title}
            content={faq.content}
          />
        ))}
      </FaqWrapper>
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
const FaqWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default FaqSection;
