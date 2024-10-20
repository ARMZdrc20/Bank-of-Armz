import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";

import Row from "../../../components/Row";
import Col from "../../../components/Col";
import { NotesData } from "../../../config/constants";
import CarouselMiddle from "../../../components/CarouselMiddle";

const CarouselItem = ({ image }) => {
  return (
    <CarouselItemWrapper>
      <CarouselImage src={image} />
    </CarouselItemWrapper>
  )
}
const CarouselItemWrapper = styled.div`
  width: 100%;
`;
const CarouselImage = styled.img`
  width: 100%;
`;

const MainSection = () => {
  const onChange = () => {}
  const onClickItem = () => {}
  const onClickThumb = () => {}
  
  return (
    <Wrapper>
      <Container>
        <ContentWrapper>
          <ContentContainer>
            <CarouselContainer>
              <Carousel showArrows={true} showThumbs={false} autoPlay infiniteLoop onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}>
                {NotesData.map((item) => (
                  <CarouselItem image={item.image} />
                ))}
              </Carousel>
            </CarouselContainer>
            <CarouselMiddleContainer>
              <CarouselMiddle data={NotesData} activeSlide={3}/>
            </CarouselMiddleContainer>
            <Col gap="30px">
              <ProjectTitle>The Bank of Armz</ProjectTitle>
              <ProjectDescription>&nbsp;&nbsp;Welcome to The Bank of ARMZ, where the first digital bank notes in the world come to life. Our platform introduces the groundbreaking dual token currency, allowing you to hold $ARMZ as either fungible coins or non-fungible notes. This innovation offers unmatched flexibility and opens new horizons in your digital holdings. Experience secure, effortless transactions and embrace the future of digital finance with The Bank of ARMZ.</ProjectDescription>
            </Col>
            <Row justify="space-around" width="100%">
              <StyledLink to="https://doggy.market/armz" target="_blank"><ArmzButton>Buy Armz</ArmzButton></StyledLink>
              <StyledLink to="/swap/swap-drc20"><ArmzButton>Swap notes</ArmzButton></StyledLink>
            </Row>
          </ContentContainer>
          <CarouselLargeContainer>
            <Carousel showArrows={true} showThumbs={false} autoPlay infiniteLoop onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}>
              {NotesData.map((item) => (
                <CarouselItem image={item.image} />
              ))}
            </Carousel>
          </CarouselLargeContainer>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 100%;
  padding: 50px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #ffffff, #efecc24a, #efecc280);
`;
const Container = styled.div`
  margin: auto;
  padding: 0px 50px;
  max-width: 1800px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 600px) {
    padding: 0px 20px;
  }
`;
const ContentWrapper = styled(Row)`
  gap: 80px;
  align-items: flex-start;

  @media (max-width: 1750px) {
    gap: 30px;
  }
`;
const ContentContainer = styled(Col)`
  gap: 115px;
  @media (max-width: 1300px) {
    gap: 30px;
  }
`
const ProjectTitle = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 96px;
  font-weight: bold;

  @media (max-width: 1750px) {
    font-size: 70px;
  }
  @media (max-width: 750px) {
    font-size: 50px;
  }
  @media (max-width: 600px) {
    font-size: 30px;
  }
`;
const ProjectDescription = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 36px;
  text-align: justify;

  @media (max-width: 1700px) {
    font-size: 30px;
  }
  @media (max-width: 750px) {
    font-size: 20px;
  }
  @media (max-width: 600px) {
    font-size: 15px;
  }
`;
const CarouselLargeContainer = styled.div`
  margin-top: 100px;
  min-width: 745px;
  width: 745px;

  @media (max-width: 1700px) {
    min-width: 600px;
    width: 600px;
  }
  @media (max-width: 1300px) {
    display: none;
  }
`;
const CarouselMiddleContainer = styled.div`
  width: 100%;
  display: none;
  @media (max-width: 1300px) {
    display: block;
  }
  @media (max-width: 800px) {
    display: none;
  }
`;
const CarouselContainer = styled.div`
  display: none;

  @media (max-width: 800px) {
    display: block;
  }
`
const ArmzButton = styled.div`
  width: 250px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
  border: 3px solid #c14f4f;
  border-radius: 30px;
  cursor: pointer;
  user-select: none;
  transition: 0.1s;
  &: hover {
    background-color: #c14f4f;
    color: white;
  }
  &: active {
    background-color: #c14f4fc0;
    color: white;
  }
  @media (max-width: 600px) {
    width: 150px;
    height: 40px;
    font-size: 15px;
  }
  @media (max-width: 400px) {
    width: 120px;
    height: 40px;
    font-size: 15px;
  }
`;
const StyledLink = styled(Link)`
  text-decoration: none;
`;
export default MainSection;
