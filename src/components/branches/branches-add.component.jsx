import React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createBranch, updateBranch } from '../../utils/firebase/firebase.utils';
import { fetchMemberById } from '../../utils/firebase/member.utils';
import styled from 'styled-components';
import { Button } from '../button/button.component';
import { FormInput } from '../form-input/form-input.component';
import MemberSearchModal from '../member-search-modal/member-search-modal.component';


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

const PastorFieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  grid-column: span 2;
  margin-bottom: 10px;
`;

const PastorInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  color: #333;
  flex: 1;
`;

const PastorLabel = styled.div`
  font-weight: bold;
  margin-right: 10px;
  min-width: 120px;
`;

const EllipsisButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #45a049;
  }
`;


const BranchAdd = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPastor, setSelectedPastor] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const editMode = location.state?.branch != null;
    console.log('Edit mode:', editMode);
    console.log('Branch data:', location.state?.branch);

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

      useEffect(() => {
        if (editMode && location.state?.branch) {
          const branch = location.state.branch;
          setFormFields({
            name: branch.name,
            contactNumber: branch.contactNumber,
            addressLine1: branch.addressLine1,
            addressLine2: branch.addressLine2,
            county: branch.county,
            city: branch.city,
            postCode: branch.postCode,
            country: branch.country,
            pastorId: branch.pastorId
          });
          
          // If there's a pastorId, fetch the pastor details
          if (branch.pastorId) {
            fetchPastorDetails(branch.pastorId);
          }
        }
      }, [editMode, location.state?.branch]);
      
      const fetchPastorDetails = async (pastorId) => {
        try {
          const pastor = await fetchMemberById(pastorId);
          if (pastor) {
            setSelectedPastor(pastor);
          }
        } catch (error) {
          console.error('Error fetching pastor details:', error);
        }
      };

      const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
      };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
          // Remove undefined or empty string values for update operation
          if (editMode) {
            // Create a clean object without undefined or empty values
            const cleanedFields = {};
            
            // Loop through all fields and only include non-empty values
            Object.keys(formFields).forEach(key => {
              // Include the field if it's not undefined and not an empty string
              if (formFields[key] !== undefined && formFields[key] !== '') {
                cleanedFields[key] = formFields[key];
              }
            });
            
            console.log('Cleaned fields for update:', cleanedFields);
            await updateBranch(location.state.branch.id, cleanedFields);
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
          {/* Hidden pastorId field */}
          <input 
            type="hidden"
            name="pastorId"
            value={pastorId}
          />
          
          <PastorFieldContainer>
            <PastorLabel>Pastor:</PastorLabel>
            <PastorInfoContainer>
              {selectedPastor ? (
                <span>{selectedPastor.firstName} {selectedPastor.lastName}</span>
              ) : (
                <span style={{ color: '#666', fontStyle: 'italic' }}>No pastor selected</span>
              )}
            </PastorInfoContainer>
            <EllipsisButton type="button" onClick={() => setIsModalOpen(true)}>...</EllipsisButton>
          </PastorFieldContainer>
          
          <MemberSearchModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelectMember={(member) => {
              setSelectedPastor(member);
              setFormFields({
                ...formFields,
                pastorId: member.id
              });
            }}
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
