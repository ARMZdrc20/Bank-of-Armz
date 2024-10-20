import React from "react";
import styled from "styled-components";

const NFTListItem = (props) => {
    return (
        <Wrapper>
            <NotesImage src={props.image}/>
            <NFTExpression>x</NFTExpression>
            <NFTNumber>{props.count}</NFTNumber>
            <NFTExpression>=</NFTExpression>
            <NFTTotal>{props.total}</NFTTotal>
        </Wrapper>
    )
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const NotesImage = styled.img`
    height: 50px;
`
const NFTExpression = styled.div`
    font-size: 24px;
    font-family: Livvic, sans-serif;
    color: #c14f4f;
`
const NFTNumber = styled.div`
    font-size: 24px;
    font-family: Livvic, sans-serif;
    color: #c14f4f;
`
const NFTTotal = styled(NFTNumber)`
    width: 100px;
    min-width: 100px;
    text-align: right;
`
export default NFTListItem;