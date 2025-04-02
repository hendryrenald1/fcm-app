import React from 'react';

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createBranch, updateBranch } from '../../utils/firebase/firebase.utils';
import styled from 'styled-components';
import { Button } from '../button/button.component';
import { FormInput } from '../form-input/form-input.component';


const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #ECE7E0;
  border: 1px solid black;
  border-radius: 5px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;




const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;




const defaultFormFields = {
  name: '',
  contactNumber: '',
  addressLine1: '',
  addressLine2: '',
  county: '',
  city: '',
  postCode: '',
  country: '',
  pastorId: ''
};


const BranchAdd = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const navigate = useNavigate();
    const location = useLocation();
    const editMode = location.state?.branch != null;

    const {
        name,
        contactNumber,
        addressLine1,
        addressLine2,
        county,
        city,
        postCode,
        country,
        pastorId
      } = formFields;


      const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
      };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
          if (editMode) {
            await updateBranch(location.state.branch.id, formFields);
          } else {
            await createBranch(formFields);
          }
          navigate('/branches');
        } catch (error) {
          console.error(`Error ${editMode ? 'updating' : 'creating'} branch:`, error);
          alert(`Failed to ${editMode ? 'update' : 'create'} branch. Please try again.`);
        }
      };

      const handleCancel = () => {
        navigate('/branches');
      };

    return (
        <FormContainer>
        <h2>{editMode ? 'Edit Branch' : 'Add Branch'}</h2>
        <Form onSubmit={handleSubmit}>  
          <FormInput
            label="Name"
            type="text"
            required
            name="name"
            value={name}
            onChange={handleChange}
          />
          <FormInput
            label="Contact Number"
            type="text"
            name="contactNumber"
            value={contactNumber}
            onChange={handleChange}
          />
          <FormInput 
            label="Pastor ID"
            type="text"
            required
            name="pastorId"
            value={pastorId}
            onChange={handleChange}
          />
            
          <FormInput
            label="Address Line 1"
            type="text"
            required
            name="addressLine1"
            value={addressLine1}
            onChange={handleChange}
          />
          <FormInput
            label="Address Line 2"
            type="text"
            name="addressLine2"
            value={addressLine2}
            onChange={handleChange}
          />
          <FormInput
            label="County"
            type="text"
            name="county"
            value={county}
            onChange={handleChange}
          />
          <FormInput
            label="City"
            type="text"
            required
            name="city"
            value={city}
            onChange={handleChange}
          />
          <FormInput
            label="Postal Code"
            type="text"
            required
            name="postCode"
            value={postCode}
            onChange={handleChange}
          />
          <FormInput
            label="Country"
            type="text"
            required
            name="country"
            value={country}
            onChange={handleChange}
          />
           <ButtonContainer>
          <Button type="submit">{editMode ? 'Update Branch' : 'Add Branch'}</Button>
          <Button type="button" onClick={handleCancel}>Cancel</Button>
        </ButtonContainer>
        </Form>
        </FormContainer>
       
    );
};

export default BranchAdd;
