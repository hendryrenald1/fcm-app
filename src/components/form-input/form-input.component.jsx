import React from 'react';
import styled from 'styled-components';

const InputGroup = styled.div`
display: flex;
flex-direction: column;
`;

const Label = styled.label`
 color: #140516;
 padding: 10px 0;
font-family: "Kumbh Sans";
font-size: 13.477px;
font-style: normal;
font-weight: 500;
line-height: normal;
`;

const Input = styled.input`


    border-radius: 28px;
    border: 0.963px solid #656565;
    font-family: "Kumbh Sans";
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    padding: 10px 20px;
`;




export const FormInput = ({ handleChange, label, ...otherProps }) => (
    <InputGroup>
    { label && 
            <Label> {label}  </Label>
        }        

        <Input className='form-input' onChange={handleChange} {...otherProps} />
    </InputGroup>
);