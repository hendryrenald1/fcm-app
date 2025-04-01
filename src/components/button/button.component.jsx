import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    border-radius: 28.879px;
    background: #62186D;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    `;

export const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
}
