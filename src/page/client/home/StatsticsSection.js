import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Row from "../../../components/Row";
import Col from "../../../components/Col";

import IcoDogecoinImage from "../../../assets/ico_dogecoin.png";
// import IcoLaikaChainImage from "../../../assets/ico_laikachain.png";
// import IcoDogechainImage from "../../../assets/ico_dogechain.png";
import ChainButton from "../../../components/ChainButton";
import { getArmzInVault, getAvailableNoteCount } from "../../../config/utils";

const StatsticsSection = () => {
  const [availableNote, setAvailableNote] = useState(0);
  const [armzInVault, setArmzInVault] = useState(0);

  const updateStaticsData = async () => {
    const t_availableNote = await getAvailableNoteCount();
    const t_armzInVault = await getArmzInVault();
    setAvailableNote(t_availableNote);
    setArmzInVault(t_armzInVault);
  }

  useEffect(() => {
    updateStaticsData();
    const timerId = setInterval(updateStaticsData, 60000);

    return () => {
      clearInterval(timerId);
    };
  }, [])
  return (
    <Wrapper>
      <Container>
        <WholeContainer gap="115px">
          <NumberWrapper>
            <Col gap="25px">
              <LabelText>Total Users:</LabelText>
              <LabelValue>1,200</LabelValue>
            </Col>
            <Col gap="25px">
              <LabelText>Available Notes:</LabelText>
              <LabelValue>{availableNote.toLocaleString()}</LabelValue>
            </Col>
            <Col gap="25px">
              <LabelText>Total Armz in the vault wallet:</LabelText>
              <LabelValue>{armzInVault.toLocaleString()}&nbsp;ARMZ</LabelValue>
            </Col>
          </NumberWrapper>
          <Row gap="40px">
            <ChainButton image={IcoDogecoinImage} name="Dogecoin" bkcolor="#E1B303" />
            {/* <ChainButton image={IcoLaikaChainImage} name="Laikachain" bkcolor="#0376E1b2" /> */}
            {/* <ChainButton image={IcoDogechainImage} name="Dogechain" bkcolor="#C203E1b2" /> */}
          </Row>
        </WholeContainer>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #EFECC219;
  padding: 50px 0px;
`;
const Container = styled.div`
  margin: auto;
  width: 100%;
  max-width: 1700px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 80px;
`;
const WholeContainer = styled(Col)`
  gap: 115px;
  @media (max-width: 620px) {
    gap: 30px;
  }
`
const LabelText = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 36px;
  font-weight: bold;
  @media (max-width: 620px) {
    font-size: 24px;
  }
  @media (max-width: 400px) {
    font-size: 15px;
  }
`;
const LabelValue = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 48px;
  font-weight: bold;
  @media (max-width: 620px) {
    font-size: 30px;
  }
  @media (max-width: 400px) {
    font-size: 20px;
  }
`;
const NumberWrapper = styled(Row)`
  gap: 60px;
  @media (max-width: 1220px) {
    gap: 20px;
    flex-direction: column;
  }
`
export default StatsticsSection;
