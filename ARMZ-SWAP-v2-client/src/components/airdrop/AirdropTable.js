import React, { useRef } from "react";
import styled from "styled-components";
import Papa from "papaparse";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaDownload, FaUpload } from "react-icons/fa";
// import Papa

import Row from "../Row";
import Col from "../Col";
import StyledButton1 from "../public/StyledButton1";

const AirdropTable = ({
  title,
  fieldNameList,
  tableItemList,
  page,
  itemPerPage,
  handleClearAll,
  handleRemove,
  handleUploadCSV,
  linkDownloadCSV,
  nameCSV
}) => {
  const fileInputRef = useRef(null);

  const handleUploadCSVClick = (e) => {
    const file = e.target.files[0];

    if(file) {
      Papa.parse(file, {
        complete: (result) => {
          handleUploadCSV(result.data)
        },
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
    }
    
    e.target.value = '';
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); 
  };

  const showItemList = tableItemList.slice(page * itemPerPage - itemPerPage, page * itemPerPage);
  const startPageNumber = page * itemPerPage - itemPerPage + 1;
  return (
    <Wrapper>
      <ToolWrapper>
        <Title>{title}</Title>
        <ToolContainer>
          <CustomizedButton onClick={handleClearAll} disabled={tableItemList.length === 0}>
            Clear&nbsp;All
          </CustomizedButton>
          <CustomizedIconButton onClick={handleClearAll} disabled={tableItemList.length === 0}>
            <RiDeleteBinLine style={{ width: 15, height: 15 }}/>
          </CustomizedIconButton>
          <CustomizedButton onClick={handleButtonClick} disabled={tableItemList.length !== 0}>
            Upload&nbsp;CSV
          </CustomizedButton>
          <CustomizedIconButton onClick={handleButtonClick} disabled={tableItemList.length === 0}>
            <FaUpload style={{ width: 15, height: 15 }}/>
          </CustomizedIconButton>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleUploadCSVClick}
          />
          <StyledLink href={linkDownloadCSV} target="_blank" download={nameCSV}>
            <CustomizedButton>
              Download&nbsp;Sample&nbsp;CSV
            </CustomizedButton>
            <CustomizedIconButton>
              <FaDownload style={{ width: 15, height: 15 }}/>
            </CustomizedIconButton>
          </StyledLink>
        </ToolContainer>
      </ToolWrapper>
      <TableWrapper>
        <Table>
          <THeader>
            <TableTr>
              <TableTh maxWidth="110px">ID</TableTh>
              {fieldNameList.map((field, index) => (
                <TableTh key={index} maxWidth={field.maxWidth} align={field.align}>{field.title}</TableTh>
              ))}
              <TableTh maxWidth="110px">Action</TableTh>
            </TableTr>
          </THeader>
          {showItemList.map((tableItem, index) => (
            <TableTr key={index}>
              <TableTd align="center" maxWidth="110px">{startPageNumber + index}</TableTd>
              {tableItem.map((field, index) => (
                <TableTd key={index}>{field}</TableTd>
              ))}
              <TableTd align="center" maxWidth="100%">
                <RemoveButton onClick={() => handleRemove(index)}>Remove</RemoveButton>
              </TableTd>
            </TableTr>
          ))}
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(Col)`
  gap: 10px;
  width: 100%;
`;
const Title = styled.div`
  color: #c14f4f;
  font-size: 20px;
  width: 100%;
  font-family: Livvic, sans-serif;
  @media (max-width: 1130px) {
    font-size: 15px;
  }
  @media (max-width: 800px) {
    font-size: 12px;
  }
  @media (max-width: 500px) {
    display: none;
  }
`;
const ToolWrapper = styled(Row)`
  width: 100%;
  padding: 0px 10px;
  align-items: flex-end;
`;
const ToolContainer = styled(Row)`
  gap: 20px;
  @media (max-width: 500px) {
    justify-content: center;
    width: 100%;
  }
`;
const TableWrapper = styled.div`
  padding: 20px;
  width: 100%;
  background-color: white;
  border-radius: 20px;
  border: 1px solid #c14f4f;
  overflow: auto;
  @media (max-width: 1130px) {
    padding: 10px;
  }
`;
const Table = styled.table`
    cellpadding: 20px;
    min-width: 500px;
`;
const THeader = styled.thead``;
const TBody = styled.tbody``;
const TableTh = styled.th`
  padding: 10px 0px;
  color: #c14f4f;
  font-weight: bold;
  font-size: 20px;
  font-family: Livvic, sans-serif;
  width: ${props => props.maxWidth};
  text-align: ${props => props.align};
  @media (max-width: 1130px) {
    font-size: 15px;
  }
  @media (max-width: 800px) {
    font-size: 12px;
  }
`;
const TableTr = styled.tr`
    cursor: pointer;
    user-select: none;
    width: 100%;
    &: hover {
        td {
            background: #eee;
        }
    }
`;
const TableTd = styled.td`
  padding: 10px 1px;
  font-size: 20px;
  font-family: Livvic, sans-serif;
  color: #c14f4f;
  text-align: ${props => props.align ? props.align : "left"};
  @media (max-width: 1130px) {
    font-size: 15px;
  }
  @media (max-width: 800px) {
    font-size: 12px;
  }
`;
const RemoveButton = styled.div`
  color: blue;
  font-size: 20px;
  font-family: Livvic, sans-serif;
  text-decoration: underline;
  @media (max-width: 1130px) {
    font-size: 15px;
  }
  @media (max-width: 800px) {
    font-size: 12px;
  }
`
const StyledLink = styled.a`
    text-decoration: none;
`
const CustomizedButton = styled(StyledButton1)`
  @media (max-width: 1130px) {
    font-size: 15px;
    padding: 5px 30px;
  }
  @media (max-width: 800px) {
    font-size: 12px;
    padding: 5px 20px;
  }
  @media (max-width: 600px) {
    font-size: 12px;
    padding: 10px;
    display: none;
  }
`
const CustomizedIconButton = styled(StyledButton1)`
  display: none;
  @media (max-width: 600px) {
    padding: 5px 10px;
    display: block;
  }
`
export default AirdropTable;
