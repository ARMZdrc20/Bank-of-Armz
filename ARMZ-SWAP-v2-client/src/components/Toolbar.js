import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ArmzIconImage from "../assets/armzIcon.png";
import LanguageIcon from "../assets/ico_language.png";
import SettingIcon from "../assets/ico_setting.png";
import AlarmIcon from "../assets/ico_alarm.png";

import IconContainer from "./IconContainer";
import Row from "./Row";

const Toolbar = () => {
  const armzPrice = useSelector((state) => state.information.armzPrice);
  
  return (
    <Row gap="20px">
      <PriceWrapper>
        <IconContainer src={ArmzIconImage} width="25px" />
        <PriceText>${armzPrice.toFixed(3)}</PriceText>
      </PriceWrapper>
      <ToolWrapper>
        <IconContainer src={LanguageIcon} height="30px" />
        <IconContainer src={SettingIcon} height="30px" />
        <IconContainer src={AlarmIcon} height="30px" />
      </ToolWrapper>
    </Row>
  );
};

const PriceText = styled.div`
    font-family: Livvic, sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #c14f4f;
`
const ToolWrapper = styled(Row)`
    gap: 20px;
    @media (max-width: 1500px) {
      display: none;
    }
`
const PriceWrapper = styled(Row)`
    gap: 10px;
    @media (max-width: 530px) {
      display: none;
    }
`
export default Toolbar;
