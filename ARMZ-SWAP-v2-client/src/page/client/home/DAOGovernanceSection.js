import React from "react";
import styled from "styled-components";

import BankImageFile from "../../../assets/bank.png";
import Col from "../../../components/Col";

const DAOGovernanceSection = () => {
  return (
    <Wrapper>
      <Container>
        <Col gap="50px" height="100%">
          <Col gap="0px">
            <BankImage src={BankImageFile} />
            <ProjectTitle>DAO Governance</ProjectTitle>
          </Col>
          <ProjectDescription>ARMZ note holders are granted voting rights on future releases, including denominations, quantities, and other significant decisions, ensuring a decentralized and community-driven approach.</ProjectDescription>
        </Col>
      </Container>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  padding: 0px 50px 50px 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F9F9F9;
  @media (max-width: 700px) {
    padding: 20px;
  }
`;
const Container = styled.div`
  margin: auto;
  width: 100%;
  height: 100%;
  max-width: 1700px;
  display: flex;
  flex-direction: column;
`;
const ProjectTitle = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 96px;
  font-weight: bold;
  user-select: none;
  @media (max-width: 900px) {
    font-size: 60px;
  }
  @media (max-width: 700px) {
    font-size: 30px;
    text-align: center;
  }
`
const BankImage = styled.img`
  width: 300px;
  height: 300px;
`
const ProjectDescription = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 32px;
  text-align: center;
  @media (max-width: 900px) {
    font-size: 25px;
  }
  @media (max-width: 700px) {
    font-size: 15px;
    text-align: center;
  }
`
export default DAOGovernanceSection;
