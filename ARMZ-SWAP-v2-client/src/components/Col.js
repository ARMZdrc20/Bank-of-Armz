import styled from "styled-components";

const Col = styled.div`
    display: flex;
    width: ${(props) => props.width ? props.width : "auto"};
    height: ${(props) => props.height ? props.height : "auto"};
    flex-direction: column;
    align-items: ${(props) => props.align ? props.align : "center"};
    gap: ${(props) => (props.gap ? props.gap : '5px')};
`

export default Col;