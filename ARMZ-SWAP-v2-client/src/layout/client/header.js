import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import BrandLogoImage from "../../assets/brand.png";

import Navbar from "../../components/Navbar";
import Row from "../../components/Row";
import Toolbar from "../../components/Toolbar";
import MenuBar from "../../components/MenuBar";

const Header = () => {
  return (
    <Wrapper>
      <Container>
        <Row gap="40px">
          <StyledLink to="/">
            <LogoContainer>
              <LogoImage src={BrandLogoImage} />
              <LogoText>Bank of ARMZ</LogoText>
            </LogoContainer>
          </StyledLink>
          <NavbarContainer>
            <Navbar />
          </NavbarContainer>
        </Row>
        <Row gap="30px">
          <Toolbar />
          <MenuBar />
        </Row>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 60px;
  background-color: #fff;
  box-shadow: inset 0px -1px 1px 0px #a0a0a0;
  z-index: 10;
`;
const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 0px 30px 0px 60px;
  @media (max-width: 800px) {
    padding: 0px 20px;
  }
`;
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const LogoImage = styled.img`
  width: 30px;
  height: 30px;
`;
const LogoText = styled.div`
  font-family: Livvic, sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: black;
`;
const NavbarContainer = styled.div`
  @media (max-width: 1320px) {
    display: none;
  }
`;
const StyledLink = styled(Link)`
  text-decoration: none;
`;
export default Header;
