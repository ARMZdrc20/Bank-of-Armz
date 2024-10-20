import React from "react";
import styled from "styled-components";
import { IoIosAlert } from "react-icons/io";

const WarningAlert = (props) => {
  return (
    <Wrapper>
      <AlertIconWrapper>
        <IoIosAlert />
      </AlertIconWrapper>
      <AlertText>{props.text}</AlertText>
      <ConfirmButton onClick={props.onClose}>Confirm</ConfirmButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(circle, #efecc280, #f7f4cb);
  border-radius: 20px;
  gap: 10px;
`;
const AlertIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 120px;
  color: #c14f4f;
`;
const AlertText = styled.div`
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  font-size: 24px;
`;
const ConfirmButton = styled.div`
  margin-top: 30px;
  width: 200px;
  border-radius: 30px;
  padding: 10px; 
  font-size: 20px;
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  text-align: center;
  background-color: transparent;
  border: 3px solid #c14f4f;
  transition: 0.1s;
  &: hover {
    background-color: #c14f4f;
    color: white;
  }
  &: active {
    background-color: #c14f4fc0;
    color: white;
  }
  cursor: pointer;
  user-select: none;
`;
export default WarningAlert;
