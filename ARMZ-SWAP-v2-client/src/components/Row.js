import styled from "styled-components";

const Row = styled.div`
    width: ${(props) => (props.width ? props.width : "auto")};
    height: ${(props) => (props.height ? props.height : "auto")};
    display: flex;
    align-items: ${(props) => (props.align ? props.align : "center")};
    justify-content: ${(props) => (props.justify ? props.justify : "flex-start")};
    gap: ${(props) => (props.gap ? props.gap : '5px')};
`

export default Row;