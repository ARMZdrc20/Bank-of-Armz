import React from "react";
import styled from "styled-components";

import Row from "../../../components/Row";
import Col from "../../../components/Col";

const WhyArmzSection = () => {
  return (
    <Wrapper>
      <Container>
          <Col gap="20px" width="100%">
            <ProjectTitle>Why ARMZ?</ProjectTitle>
            <TotalVolumeText>
              ARMZ Total Volume: <TotalVolumeCount>100,000 Doge</TotalVolumeCount>
            </TotalVolumeText>
          </Col>
          <CardContainer>
            <Card>
              <CardTitle>First Redeemable NFTs</CardTitle>
              <CardText>
                Our digital bank notes, the first of their kind, are redeemable for their face value, ensuring your initial investment is secure. These notes can appreciate based on rarity and are tradable for Dogecoin. Selling the NFT transfers the ARMZ and redemption rights, ensuring only the holder can redeem the value.
              </CardText>
            </Card>
            <Card>
              <CardTitle>First Doginals Multi-Sig Wallets</CardTitle>
              <CardText>
                Enhance your security and decentralization with our multi-signature wallets, setting a new benchmark in digital asset management.
              </CardText>
            </Card>
            <Card>
              <CardTitle>First Direct Doginals Swap on Layer 1</CardTitle>
              <CardText>
                Swap $ARMZ directly on the Dogecoin network without relying on external platforms, for streamlined transactions and improved efficiency.
              </CardText>
            </Card>
            <Card>
              <CardTitle>A Unique and Original Experience</CardTitle>
              <CardText>
                Built for the community with fair minting, low supply, and organic growth, The Bank of ARMZ brings advanced financial features to the Dogecoin ecosystem, delivering a truly unique Doginals experience.  
              </CardText>
            </Card>
          </CardContainer>
      </Container>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  padding: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #F7F4CB00, #F7F4CB80, #F7F4CB50, #F1EEC5a0, #F1EEC500);
  @media (max-width: 500px) {
    padding: 20px;
  }
`;
const Container = styled.div`
  margin: auto;
  width: 100%;
  max-width: 1700px;
  display: flex;
  flex-direction: column;
  gap: 80px;
  @media (max-width: 500px) {
    gap: 30px;
  }
`;
const CardContainer = styled(Row)`
  gap: 80px;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: 750px) {
    flex-direction: column;
    gap: 30px;
  }
`
const ProjectTitle = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 96px;
  font-weight: bold;
  user-select: none;
  @media (max-width: 750px) {
    font-size: 60px;
  }
  @media (max-width: 500px) {
    font-size: 40px;
  }
`
const TotalVolumeText = styled.div`
  color: #8A8383;
  font-size: 36px;
  @media (max-width: 750px) {
    font-size: 24px;
  }
  @media (max-width: 500px) {
    font-size: 15px;
  }
`
const TotalVolumeCount = styled.span`
  font-family: Livvic, sans-serif;
  color: black;
  font-weight: bold;
`
const Card = styled.div`
  width: 350px;
  height: 470px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  padding: 40px 25px;
  background: radial-gradient(circle, #efecc2, #f7f4cb);
  border: 2px solid #EFECC2;
  border-radius: 20px;
  @media (max-width: 450px) {
    width: 280px;
    height: fit-content;
  }
`
const CardTitle = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-weight: bold;
  font-size: 25px;
  text-align: center;
  height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const CardText = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 20px;
  text-align: justify;
  text-indent: 20px;
`
const CardTextImportant = styled.span`
  font-weight: bold;
`
export default WhyArmzSection;
