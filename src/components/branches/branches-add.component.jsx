import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createBranch, updateBranch } from '../../utils/firebase/firebase.utils';
import { fetchMemberById } from '../../utils/firebase/member.utils';
import styled from 'styled-components';
import { Button } from '../button/button.component';
import { FormInput } from '../form-input/form-input.component';
import MemberSearchModal from '../member-search-modal/member-search-modal.component';


const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  background: #f9f0ff;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none; 
  color: #333;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 0;
  
  &:hover {
    color: #6a26cd;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;




const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid #eee;
`;




const FormSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const FormRow = styled.div`
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'span 1'};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #eee;
  border-radius: 4px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: #6a26cd;
    transition: width 0.3s ease;
  }
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
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9fafb;
`;

const PastorInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #444;
  flex: 1;
  gap: 4px;
`;

const PastorLabel = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 16px;
  margin-bottom: 8px;
`;

const EllipsisButton = styled.button`
  background: #6a26cd;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #5a20b0;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SelectLabel = styled.label`
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

const Select = styled.select`
  height: 48px;
  padding: 0 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  width: 100%;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #6a26cd;
    box-shadow: 0 0 0 2px rgba(106, 38, 205, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

// FormSelect component to match FormInput style
const FormSelect = ({ label, required, children, ...otherProps }) => (
  <SelectGroup>
    {label && (
      <SelectLabel required={required}>{label}</SelectLabel>
    )}
    <Select required={required} {...otherProps}>
      {children}
    </Select>
  </SelectGroup>
);


const BranchAdd = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPastor, setSelectedPastor] = useState(null);
    const [formProgress, setFormProgress] = useState(0);
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
          
          // Set form progress to 100% in edit mode
          setFormProgress(100);
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
        
        // Calculate form progress
        const requiredFields = ['name', 'contactNumber', 'addressLine1', 'city', 'postCode', 'country'];
        const filledRequiredFields = requiredFields.filter(field => formFields[field] || (name === field && value));
        const progress = Math.round((filledRequiredFields.length / requiredFields.length) * 100);
        setFormProgress(progress);
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

    // Arrow icon for back button
    const ArrowIcon = () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
        <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    
    // Search icon for pastor search
    const SearchIcon = () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );

    const handleBack = () => {
      navigate('/branches');
    };

    return (
      <PageContainer>
        <BackButton onClick={handleBack}>
          <ArrowIcon />
          Back to Branches
        </BackButton>
        
        <FormContainer>
          <PageTitle>{editMode ? 'Edit Branch' : 'Add New Branch'}</PageTitle>
          <ProgressBar progress={formProgress} />
          <Form onSubmit={handleSubmit}>  
        
    
          {/* Hidden pastorId field */}
          <input 
            type="hidden"
            name="pastorId"
            value={pastorId}
          />
          <SectionTitle>Branch Information</SectionTitle>
          <FormSection>
            <FormRow>
              <FormInput
                label="Branch Name"
                type="text"
                required
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Enter branch name"
              />
            </FormRow>
            <FormRow>
              <FormInput
                label="Contact Number"
                type="text"
                required
                name="contactNumber"
                value={contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
              />
            </FormRow>
          </FormSection>
          
          <PastorFieldContainer>
            <PastorInfoContainer>
              <PastorLabel>Branch Pastor</PastorLabel>
              {selectedPastor ? (
                <div>
                  {selectedPastor.firstName} {selectedPastor.lastName}
                </div>
              ) : (
                <div>No pastor assigned</div>
              )}
            </PastorInfoContainer>
            <EllipsisButton type="button" onClick={() => setIsModalOpen(true)}>
              <SearchIcon />
              Select Pastor
            </EllipsisButton>
          </PastorFieldContainer>
          
          <SectionTitle>Address Information</SectionTitle>
          <FormSection>
            <FormRow fullWidth>
              <FormInput
                label="Address Line 1"
                type="text"
                required
                name="addressLine1"
                value={addressLine1}
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </FormRow>
            <FormRow fullWidth>
              <FormInput
                label="Address Line 2"
                type="text"
                name="addressLine2"
                value={addressLine2}
                onChange={handleChange}
                placeholder="Apartment, suite, unit, etc. (optional)"
              />
            </FormRow>
            <FormRow>
              <FormInput
                label="City"
                type="text"
                required
                name="city"
                value={city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </FormRow>
            <FormRow>
              <FormInput
                label="County"
                type="text"
                name="county"
                value={county}
                onChange={handleChange}
                placeholder="Enter county (optional)"
              />
            </FormRow>
            <FormRow>
              <FormInput
                label="Postal Code"
                type="text"
                required
                name="postCode"
                value={postCode}
                onChange={handleChange}
                placeholder="Enter postal code"
              />
            </FormRow>
            <FormRow>
              <FormSelect
                label="Country"
                required
                name="country"
                value={country}
                onChange={handleChange}
              >
                <option value="">Select country</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </FormSelect>
            </FormRow>
          </FormSection>
          
          <ButtonContainer>
            <Button type="button" onClick={handleCancel} buttonType="inverted">
              Cancel
            </Button>
            <Button type="submit">
              {editMode ? 'Update Branch' : 'Save Branch'}
            </Button>
          </ButtonContainer>
        </Form>
        <MemberSearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectMember={(member) => {
            setSelectedPastor(member);
            setFormFields({ ...formFields, pastorId: member.id });
            setIsModalOpen(false);
          }}
        />
        </FormContainer>
      </PageContainer>
    );
};

export default BranchAdd;
