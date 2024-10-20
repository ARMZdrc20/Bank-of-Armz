import React from "react";
import styled from "styled-components";

const IconContainer = (props) => {
  return <IconContainerImage src={props.src} onClick={props.handleClick} height={props.height} width={props.width}/>;
};

const IconContainerImage = styled.img`
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => (props.height ? props.height : "auto")};
  user-select: none;
  cursor: pointer;
`;
export default IconContainer;
