import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { BASE_URL } from "../config/constants";
import { Link, useLocation } from "react-router-dom";

const tabItems = [
  {
    link: "/swap/swap-drc20",
    name: "Swap DRC20",
  },
  {
    link: "/swap/swap-nft",
    name: "Swap NFT",
  },
];

const Tabbar = () => {
  const location = useLocation();
  const [currentURL, setCurrentURL] = useState("");

  useEffect(() => {
    setCurrentURL(window.location.href.substring(BASE_URL.length));
  }, [location]);
  return (
    <Wrapper>
      {tabItems.map((data, index) => (
        <Tab key={index} to={data.link} active={data.link === currentURL}>
          {data.name}
        </Tab>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  gap: 50px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: inset 0px -1px 1px 0px #a0a0a0;
`;
const Tab = styled(Link)`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Livvic, sans-serif;
  font-size: 16px;
  font-weight: 200;
  color: #c14f4fcd;
  border-bottom: ${(props) => (props.active ? "6px solid #C14F4F" : "none")};
  text-decoration: none;
  user-select: none;
  cursor: pointer;
`;
export default Tabbar;
