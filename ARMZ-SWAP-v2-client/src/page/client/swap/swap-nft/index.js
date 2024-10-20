import React from "react";
import styled from "styled-components";

import Tabbar from "../../../../components/Tabbar";
import ReturnNoteBox from "../../../../components/ReturnNoteBox";

const SwapNFT = () => {
  return (
    <Wrapper>
      <Tabbar />
      <Container>
        <ReturnNoteBox/>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 60px;
  width: 100%;
  background-color: white;
`;
const Container = styled.div`
position: relative;
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    z-index: 2;
    position: absolute;
    width: 100%;
    height: 100%;
    content: "Swap is down for maintenance and upgrades";
    font-size: 50px;
    font-weight: bold;
    color: #c14f4f;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffffd0;
  }
`;

export default SwapNFT;
