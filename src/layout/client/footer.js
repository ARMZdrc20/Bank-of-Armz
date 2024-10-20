import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const linkData = [
  {
    title: "Use",
    content: [
      {
        caption: "Buy Armz",
        link: "https://doggy.market/armz"
      },
      {
        caption: "Swap Notes",
        link: "/swap/swap-drc20"
      },
      {
        caption: "Return Notes",
        link: "/swap/swap-nft"
      },
      {
        caption: "Marketplace",
        link: "#"
      },
      {
        caption: "Wallet",
        link: "#"
      }
    ]
  },
  {
    title: "DAO",
    content: [
      {
        caption: "About dao",
        link: "#"
      },
      {
        caption: "Community",
        link: "#"
      },
      {
        caption: "Chart",
        link: "#"
      }
    ]
  },
  {
    title: "Airdrop",
    content: [
      {
        caption: "About airdrop",
        link: "#"
      },
      {
        caption: "Tools",
        link: "#"
      },
      {
        caption: "Tutorials",
        link: "#"
      }
    ]
  },
  {
    title: "About Us",
    content: [
      {
        caption: "Contact Us",
        link: "#"
      },
      {
        caption: "Support Team",
        link: "#"
      },
      {
        caption: "FAQ",
        link: "#"
      },
      {
        caption: "Documentation",
        link: "#"
      }
    ]
  },
  {
    title: "Join Us",
    content: [
      {
        caption: "Telegram",
        link: "https://t.me/armzdrc20"
      },
      {
        caption: "Twitter",
        link: "https://twitter.com/ArmzDrc20"
      },
      {
        caption: "Chart",
        link: "https://coinranking.com/coin/g0kZn_L5U+armzdrc-armz"
      },
    ]
  }
];

const Footer = () => {
  return (
    <Wrapper>
      <Container>
          {
            linkData.map((section, index) => (
              <FooterSection key={index}>
                <FooterTitle>{section.title}</FooterTitle>
                {
                  section.content.map((sectionItem, index) => (
                    <FooterDetail key={index} to={sectionItem.link}>
                      {sectionItem.caption}
                    </FooterDetail>
                  ))
                }
              </FooterSection>
            ))
          }
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 70px 100px 100px 100px;
  background-color: #eee;
  @media (max-width: 600px) {
    padding: 20px 50px 50px 50px;
  }
`;
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 100px;
  @media (max-width: 1300px) {
    flex-wrap: wrap;
    gap: 20px;
  }
`;
const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 200px;
  @media (max-width: 600px) {
    align-items: center;
  }
`;
const FooterTitle = styled.div`
  color: black;
  font-weight: bold;
  font-size: 32px;
  font-family: Livvic, sans-serif;
  margin-bottom: 5px;
  @media (max-width: 600px) {
    font-size: 20px;
  }
`;
const FooterDetail = styled(Link)`
  color: black;
  font-size: 24px;
  font-family: Livvic, sans-serif;
  text-decoration: none;
  @media (max-width: 600px) {
    font-size: 15px;
  }
`

export default Footer;