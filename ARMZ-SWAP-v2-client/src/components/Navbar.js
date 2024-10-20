import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    link: "/",
    name: "Home",
    disabled: false,
  },
  {
    link: "/swap",
    name: "Swap",
    disabled: false,
  },
  {
    link: "/marketplace",
    name: "Marketplace",
    disabled: true,
  },
  {
    link: "/dao",
    name: "DAO Governance",
    disabled: true,
  },
  {
    link: "/airdrop",
    name: "Airdrop",
  },
  {
    link: "/roadmap",
    name: "Roadmap",
    disabled: false,
  },
];

const Navbar = () => {
  const location = useLocation();
  const [currentURL, setCurrentURL] = useState("");

  useEffect(() => {
    setCurrentURL(location.pathname);
  }, [location]);

  return (
    <NavbarWrapper>
      <NavbarContainer>
        {navItems.map((data, index) => (
          <NavItem
            key={index}
            active={
              (index !== 0 && currentURL.startsWith(data.link)) ||
              (index === 0 && data.link === currentURL)
            }
            disabled={data.disabled}
            to={(data.disabled === true ? "#" : data.link)}
          >
            {data.name}
          </NavItem>
        ))}
      </NavbarContainer>
    </NavbarWrapper>
  );
};

const NavbarWrapper = styled.div`
  position: relative;
`
const NavbarContainer = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 1320px) {
      position: absolute;
      top: 10px;
      right: 0;
      width: 200px;
      padding: 30px 20px;
      flex-direction: column;
      align-items: center;
      background-color: #efecc2;
      border-radius: 20px;
      border: 3px solid #cfcca2;
  }
`;
const NavItem = styled(Link)`
  font-family: Livvic, sans-serif;
  font-size: 16px;
  font-weight: ${(props) => (props.active === true ? "bold" : "100")};
  color: ${(props) => (props.active === true ? "#c14f4f" : "#c14f4fcd")};
  text-decoration: none;
  cursor: ${(props) => (props.disabled === true ? "not-allowed" : "pointer")};
`;
export default Navbar;
