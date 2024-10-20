import React from "react";
import styled from "styled-components";

import TempPage from "../../../components/TempPage";

const DAOGovernancePage = () => {
  return (
    <Wrapper>
      <Container>
        <TempPage>DAOGovernancePage</TempPage>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 500px;
  background-color: white;
`;
const Container = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  color: grey;
  font-size: 50px;
`;
export default DAOGovernancePage;
