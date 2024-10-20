import React, { useState, useEffect } from "react";
import styled from "styled-components";

const SliderContent = (props) => {
  return (
    <div className="sliderContent">
      <CarouselImage src={props.image} />
    </div>
  );
};

const CarouselImage = styled.img`
  width: 300px;
  @media (max-width: 900px) {
    width: 200px;
  }
`;

const CarouselMiddle = (props) => {
  const [activeSlide, setactiveSlide] = useState(props.activeSlide);

  useEffect(() => {
    const timerId = setInterval(() => {
      next();
    }, 2000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const next = () => {
    setactiveSlide((prev) => (prev < props.data.length - 1 ? prev + 1 : 0));
  };

  const getStyles = (index) => {
    if (activeSlide === index)
      return {
        opacity: 1,
        transform:
          "translateX(0px) translateZ(0px) rotateY(0deg) scale(1.5, 1.5)",
        zIndex: 10,
      };
    else if (activeSlide - 1 === index)
      return {
        opacity: 1,
        transform:
          "translateX(-240px) translateZ(-400px) rotateY(35deg) scale(1.45, 1.45)",
        zIndex: 9,
      };
    else if (activeSlide + 1 === index)
      return {
        opacity: 1,
        transform:
          "translateX(240px) translateZ(-400px) rotateY(-35deg) scale(1.45, 1.45)",
        zIndex: 9,
      };
    else if (activeSlide - 2 === index)
      return {
        opacity: 1,
        transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
        zIndex: 8,
      };
    else if (activeSlide + 2 === index)
      return {
        opacity: 1,
        transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
        zIndex: 8,
      };
    else if (index < activeSlide - 2)
      return {
        opacity: 0,
        transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
        zIndex: 7,
      };
    else if (index > activeSlide + 2)
      return {
        opacity: 0,
        transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
        zIndex: 7,
      };
  };

  return (
    <SlideC>
      {props.data.map((item, index) => (
        <React.Fragment key={index}>
          <Slide
            style={{
              ...getStyles(index),
            }}
          >
            <SliderContent {...item} />
          </Slide>
        </React.Fragment>
      ))}
    </SlideC>
  );
};

const SlideC = styled.div`
  position: relative;
  perspective: 1000px;
  transform-style: preserve-3d;
  width: 362px;
  height: 272px;
  margin: 0 auto;
  @media (max-width: 900px) {
    width: 250px;
    height: 180px;
  }
`;
const Slide = styled.div`
  width: 362px;
  height: 272px;
  transition: transform 500ms ease 0s, opacity 500ms ease 0s,
    visibility 500ms ease 0s;
  position: absolute;
  top: 0;
  border-radius: 12px;
  @media (max-width: 900px) {
    width: 250px;
    height: 180px;
  }
`;
export default CarouselMiddle;
