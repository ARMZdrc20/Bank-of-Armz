import React from "react";
import styled from "styled-components";

const TempPage = (props) => {
    return (
        <NavbarItem>
            {props.children}
        </NavbarItem>
    );
};

const NavbarItem = styled.div`
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: blue;
  }
`;

export default TempPage;