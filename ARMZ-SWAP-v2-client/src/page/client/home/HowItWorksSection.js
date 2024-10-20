import React, { useState } from "react";
import styled from "styled-components";

import Col from "../../../components/Col";

const HowItWorksSection = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Wrapper>
      <Container>
        <Card>
          <CardTitle>How it works</CardTitle>
          <Col gap="80px">
            <CardTab active={currentTab === 0} onClick={() => setCurrentTab(0)}>ARMZ -&gt; Notes</CardTab>
            <CardTab active={currentTab === 1} onClick={() => setCurrentTab(1)}>Notes -&gt; ARMZ</CardTab>
          </Col>
        </Card>
      </Container>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 100%;
  height: 850px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
`;
const Container = styled.div`
  margin: auto;
  width: 100%;
  max-width: 1700px;
  display: flex;
  align-items: center;
`;
const Card = styled.div`
  width: 600px;
  height: 660px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  border-radius: 20px;
  gap: 110px;
  background-color: #F1F0F1;
`
const CardTitle = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-weight: bold;
  font-size: 64px;
`
const CardTab = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 35px;
  color: white;
  font-size: 36px;
  border-radius: 40px;
  background-color: ${ props => props.active ? "#C14F4F" : "#999999" };
  user-select: none;
  cursor: pointer;
  &: hover {
    &:: before {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #ffffff30;
    }
  }
  &: active {
    &:: before {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #ffffff50;
    }
  }
`
export default HowItWorksSection;
