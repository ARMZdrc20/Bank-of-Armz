import React from "react";
import styled from "styled-components";

import Row from "../../../components/Row";
import Col from "../../../components/Col";

const GetStartedNowSection = () => {
  return (
    <Wrapper>
      <Container>
        <Col gap="35px" width="100%">
          <ProjectTitle>Get Started Now</ProjectTitle>
          <ProjectDescription>Find Resources you need to take advantage of ARMZ</ProjectDescription>
        </Col>
        <CardContainer>
          <Card>
            <CardTitle>Documentation</CardTitle>
            <CardText>Read a detailed breakdown of our product offering</CardText>
            <CardButton>Buy Armz</CardButton>
          </Card>
          <Card>
            <CardTitle>Tutorial</CardTitle>
            <CardText>Watch interactive tutorials to learn how bank of armz works</CardText>
            <CardButton>Buy Armz</CardButton>
          </Card>
        </CardContainer>
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
  background: linear-gradient(to bottom, #F9F9F9FF, #F9F9F980, #F9F9F9A0);
  @media (max-width: 500px) {
    gap: 30px;
  }
`;
const Container = styled.div`
  margin: auto;
  width: 100%;
  max-width: 1700px;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  gap: 100px;
  @media (max-width: 500px) {
    gap: 30px;
  }
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
const ProjectDescription = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 36px;
  @media (max-width: 900px) {
    font-size: 24px;
  }
  @media (max-width: 700px) {
    font-size: 15px;
  }
`
const Card = styled.div`
  width: 700px;
  height: 270px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 30px;
  background: radial-gradient(circle, #efecc2, #f7f4cb);
  border: 2px solid #EFECC2;
  border-radius: 20px;
  @media (max-width: 700px) {
    width: 400px;
    align-items: center;
    height: fit-content;
  }
  @media (max-width: 500px) {
    width: 300px;
    height: fit-content;
  }
`
const CardTitle = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-weight: bold;
  font-size: 32px;
`
const CardText = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
  text-align: justify;
  @media (max-width: 500px) {
    text-align: center;
  }
`
const CardButton = styled.div`
  width: 250px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 30px;
  border: 2px solid #c14f4f;
  padding: 15px 30px;
  font-family: Livvic, sans-serif;
  font-size: 24px;
  color: #c14f4f;
  cursor: pointer;
  user-select: none;
  transition: 0.1s;
  &: hover {
    background-color: #eee;
  }
  &: active {
    background-color: #e5e5e5;
  }
`;
const CardContainer = styled(Row)`
  justify-content: space-around;
  gap: 50px;
  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;
export default GetStartedNowSection;
