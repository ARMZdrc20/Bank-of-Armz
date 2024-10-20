import styled from "styled-components";

const StyledButton1 = styled.div`
    margin: ${props => props.margin ? props.margin : "0px" };
    padding: ${props => props.padding ? props.padding: "7px 40px"};
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: ${props => props.fSize ? props.fSize : "20px"};
    font-family: Livvic, sans-serif;
    border-radius: 40px;
    background-color: ${props => props.disabled ? "#888888" : "#C14F4F"};
    cursor: pointer;
    user-select: none;
    transition: 0.2s;
    &: hover {
        background-color: ${props => props.disabled ? "#888888" : "#C14F4Fb0"};
    }
    &: active {
        background-color: ${props => props.disabled ? "#888888" : "#C14F4Fd0"};
    }
`;

export default StyledButton1;