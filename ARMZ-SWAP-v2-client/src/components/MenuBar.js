import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import Row from "./Row";
import SelectChainButton from "./SelectChainButton";
import SelectMenu from "./SelectMenu";
import IconContainer from "./IconContainer";

import NavIcon from "../assets/ico_nav.png";
import CloseIcon from "../assets/ico_close.png";
import Navbar from "./Navbar";

const MenuBar = () => {
  const navbartRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideWallet);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideWallet);
    };
  }, []);

  const handleClickOutsideWallet = (event) => {
    if (navbartRef.current && !navbartRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  return (
    <Row gap="20px">
      <SelectChainButton />
      <SelectMenu />
      <NavbarWrapper ref={navbartRef}>
        {show === false ? (
          <IconContainer
            src={NavIcon}
            width="30px"
            height="30px"
            handleClick={() => setShow(true)}
          />
        ) : (
          <IconContainer
            src={CloseIcon}
            width="30px"
            height="30px"
            handleClick={() => setShow(false)}
          />
        )}
        <NavbarContainer show={show}>
          <Navbar />
        </NavbarContainer>
      </NavbarWrapper>
    </Row>
  );
};

const NavbarWrapper = styled.div`
  display: none;
  @media (max-width: 1320px) {
    display: block;
  }
`;
const NavbarContainer = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
`;
export default MenuBar;
