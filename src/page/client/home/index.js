import React from "react";
import styled from "styled-components";

import MainSection from "./MainSection";
import SwapSection from "./SwapSection";
import StatsticsSection from "./StatsticsSection";
import WhyArmzSection from "./WhyArmzSection";
import HowItWorksSection from "./HowItWorksSection";
import DAOGovernanceSection from "./DAOGovernanceSection";
import GetStartedNowSection from "./GetStartedNowSection";

const HomePage = () => {
  return (
    <Wrapper>
        <MainSection />
        <SwapSection />
        <StatsticsSection />
        <WhyArmzSection />
        {/*<HowItWorksSection /> */}
        <DAOGovernanceSection />
        <GetStartedNowSection />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding-top: 60px;
`;
export default HomePage;
