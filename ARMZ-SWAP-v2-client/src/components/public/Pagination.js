import React from "react";
import styled from "styled-components";
import { RiArrowLeftDoubleLine, RiArrowLeftLine, RiArrowRightLine, RiArrowRightDoubleLine } from "react-icons/ri";

import Row from "../Row";

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  setPageNumber,
}) => {
  const handleFirstClick = () => {
    setPageNumber(1);
  }
  const handlePrevClick = () => {
    if(currentPage >= 2) setPageNumber(currentPage - 1);
  }
  const handlePageClick = (page) => {
    setPageNumber(page);
  }
  const handleNextClick = () => {
    if(currentPage < Math.ceil(totalItems / itemsPerPage)) setPageNumber(currentPage + 1);
  }
  const handleLastClick = () => {
    setPageNumber(Math.ceil(totalItems / itemsPerPage));
  }

  let pageList = [];
  if (Math.ceil(totalItems / itemsPerPage) <= 5) {
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) pageList.push(i);
  } else {
    let min = Math.max(currentPage - 2, 1);
    let max = Math.min(currentPage + 3, Math.ceil(totalItems / itemsPerPage));
    for (let i = min; i <= max; i++) pageList.push(i);
  }
  return (
    <Wrapper>
      <Button onClick={handleFirstClick}><RiArrowLeftDoubleLine /></Button>
      <Button onClick={handlePrevClick}><RiArrowLeftLine /></Button>
      {pageList.map((page, index) => (
        <Button key={index} active={page === currentPage} onClick={() => handlePageClick(page)}>
          {page}
        </Button>
      ))}
      <Button onClick={handleNextClick}><RiArrowRightLine /></Button>
      <Button onClick={handleLastClick}><RiArrowRightDoubleLine /></Button>
    </Wrapper>
  );
};

const Wrapper = styled(Row)`
  gap: 15px;
`;
const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: #c14f4f;
  font-size: 20px;
  font-weight: bold;
  background-color: #e9e9e9;
  cursor: pointer;
  user-select: none;
  border-radius: 10px;
  border: ${(props) => (props.active ? "1px solid #C14F4F" : "none")};
  &:hover {
    background-color: #f9f9f9;
  }
  &: active {
    background-color: #d9d9d9;
  }
  @media (max-width: 1130px) {
    width: 35px;
    height: 35px;
    font-size: 20px;
  }
  @media (max-width: 800px) {
    width: 30px;
    height: 30px;
    font-size: 18px;
  }
  @media (max-width: 600px) {
    width: 25px;
    height: 25px;
    font-size: 15px;
  }
`;

export default Pagination;
