import React from 'react';
import styled from 'styled-components';

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  color: #333;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  
  ${props => props.required && `
    &::after {
      content: '*';
      color: #e53e3e;
      margin-left: 4px;
    }
  `}
`;

const Input = styled.input`
  height: 48px;
  padding: 0 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #6a26cd;
    box-shadow: 0 0 0 2px rgba(106, 38, 205, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;




export const FormInput = ({ handleChange, label, required, ...otherProps }) => (
  <InputGroup>
    {label && (
      <Label required={required}>{label}</Label>
    )}
    <Input 
      className='form-input' 
      onChange={handleChange} 
      required={required}
      {...otherProps} 
    />
  </InputGroup>
);