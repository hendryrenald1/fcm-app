import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { FormInput } from '../form-input/form-input.component';
import { Button } from '../button/button.component';
import { createMember, updateMember, fetchAllBranches } from '../../utils/firebase/firebase.utils';

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

const Select = styled.select`
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const defaultFormFields = {
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  county: '',
  city: '',
  postalCode: '',
  country: '',
  branchId: '',
  email: '',
  dateOfBirth: '',
  phone: '',
  joinedOn: new Date().toISOString().split('T')[0]
};

const MemberAdd = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.member != null;

  // Fetch branches for dropdown
  const { data: branches = [], isLoading: branchesLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchAllBranches
  });

  useEffect(() => {
    if (editMode && location.state?.member) {
      const member = location.state.member;
      console.log('Member data:', member);
      console.log('dateOfBirth:', member.dateOfBirth);
      console.log('joinedOn:', member.joinedOn);

      // Convert Firestore Timestamp to Date string in YYYY-MM-DD format
      const formatFirestoreDate = (timestamp) => {
        if (!timestamp) return '';
        try {
          // If it's a Firestore timestamp
          if (timestamp.toDate) {
            return timestamp.toDate().toISOString().split('T')[0];
          }
          // If it's a Date object
          if (timestamp instanceof Date) {
            return timestamp.toISOString().split('T')[0];
          }
          // If it's already in YYYY-MM-DD format
          if (typeof timestamp === 'string' && timestamp.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return timestamp;
          }
          // If it's a number (timestamp)
          if (typeof timestamp === 'number') {
            return new Date(timestamp).toISOString().split('T')[0];
          }
          return '';
        } catch (error) {
          console.error('Error formatting date:', timestamp, error);
          return '';
        }
      };

      const formattedDateOfBirth = formatFirestoreDate(member.dateOfBirth);
      const formattedJoinedOn = formatFirestoreDate(member.joinedOn);

      console.log('Formatted dates:', { formattedDateOfBirth, formattedJoinedOn });

      setFormFields({
        ...member,
        dateOfBirth: formattedDateOfBirth,
        joinedOn: formattedJoinedOn
      });
    }
  }, [editMode, location.state?.member]);

  const {
    firstName,
    lastName,
    addressLine1,
    addressLine2,
    county,
    city,
    postalCode,
    country,
    email,
    dateOfBirth,
    branchId,
    phone,
    joinedOn
  } = formFields;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editMode) {
        await updateMember(location.state.member.id, formFields);
      } else {
        await createMember(formFields);
      }
      navigate('/members');
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'creating'} member:`, error);
      alert(`Failed to ${editMode ? 'update' : 'create'} member. Please try again.`);
    }
  };

  const handleCancel = () => {
    navigate('/members');
  };

  return (
    <FormContainer>
      <h2>{editMode ? 'Edit Member' : 'Add New Member'}</h2>
      <Form onSubmit={handleSubmit}>
        <FormInput
          label="First Name"
          type="text"
          required
          name="firstName"
          value={firstName}
          onChange={handleChange}
        />
        <FormInput
          label="Last Name"
          type="text"
          required
          name="lastName"
          value={lastName}
          onChange={handleChange}
        />
        <FormInput 
          label="Email"
          type="email"
          required
          name="email"
          value={email}
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
          name="postalCode"
          value={postalCode}
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
        <FormInput
          label="Date of Birth"
          type="date"
          required
          name="dateOfBirth"
          value={dateOfBirth}
          onChange={handleChange}
        />
        <FormInput
          label="Phone"
          type="tel"
          required
          name="phone"
          value={phone}
          onChange={handleChange}
        />
        <FormInput
          label="Joined On"
          type="date"
          required
          name="joinedOn"
          value={joinedOn}
          onChange={handleChange}
        />
        <SelectContainer>
          <Label>Branch</Label>
          <Select
            required
            name="branchId"
            value={branchId}
            onChange={handleChange}
            disabled={branchesLoading}
          >
            <option value="">Select a branch</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </SelectContainer>
        <ButtonContainer>
          <Button type="submit">{editMode ? 'Update Member' : 'Add Member'}</Button>
          <Button type="button" onClick={handleCancel}>Cancel</Button>
        </ButtonContainer>
      </Form>
    </FormContainer>
  );
};

export default MemberAdd;
