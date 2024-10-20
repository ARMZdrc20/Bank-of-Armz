import React from "react";
import styled from "styled-components";

import Row from "../../../components/Row";
import Col from "../../../components/Col";
import ArmzToNoteImage from "../../../assets/armzToNote.png";
import NoteToArmzImage from "../../../assets/noteToArmz.png";

const SwapSection = () => {
  return (
    <Wrapper>
      <Container>
        <Col gap="40px" width="100%">
          <ProjectTitle>S W A P</ProjectTitle>
          <ImageWrapper>
            <SwapFromArmzToNote src={ArmzToNoteImage} />
            <SwapFromArmzToNote src={NoteToArmzImage} />
          </ImageWrapper>
        </Col>
      </Container>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  padding: 50px 0px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #EFECC280, #EFECC233, #EFECC219);
`;
const Container = styled.div`
  padding: 0px 50px;
  margin: auto;
  width: 100%;
  max-width: 1800px;
  display: flex;
  gap: 80px;
`;
const ProjectTitle = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 96px;
  font-weight: bold;
  user-select: none;
  @media (max-width: 800px) {
    font-size: 72px;
  }
  @media (max-width: 600px) {
    font-size: 50px;
  }
`
const SwapFromArmzToNote = styled.img`
  width: 530px;
  @media (max-width: 1220px) {
    width: 350px;
  }
  @media (max-width: 800px) {
    width: 250px;
  }
  @media (max-width: 620px) {
    width: 350px;
  }
  @media (max-width: 400px) {
    width: 250px;
  }
`;
const ImageWrapper = styled(Row)`
  width: 100%;
  justify-content: space-around;
  gap: 50px;
  @media (max-width: 620px) {
    gap: 20px;
    flex-direction: column;
  }
`
export default SwapSection;
