import React from "react";
import styled from "styled-components";
import AboutBankSection from "./AboutBankSection";
import FaqSection from "./FaqSection";
import AboutOurTokenSection from "./AboutOurTokenSection";
import RoadmapSection from "./RoadmapSection";

const RoadmapPage = () => {
  return (
    <Wrapper>
      <Container>
        <AboutBankSection />
        <FaqSection />
        <RoadmapSection />
        <AboutOurTokenSection />
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  background: radial-gradient(circle, #FFAAAA50, #FFAAAAA0);
`;
const Container = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: grey;
  font-size: 50px;
`;
export default RoadmapPage;
