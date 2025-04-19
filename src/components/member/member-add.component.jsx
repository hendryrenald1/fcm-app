import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { Button } from '../button/button.component';
import { FormInput } from '../form-input/form-input.component';
import { createMember, updateMember, fetchAllBranches, storage } from '../../utils/firebase/firebase.utils';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  background: #f9f0ff;
  min-height: 100vh;
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

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
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



const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  
  &:hover {
    color: #6a26cd;
  }
`;

const ModalMessage = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
  color: #333;
`;

const DocumentViewButton = styled.a`
  display: inline-block;
  margin-top: 15px;
  padding: 12px 24px;
  background-color: #6a26cd;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  font-size: 16px;
  
  &:hover {
    background-color: #5a20b0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid #eee;
`;

// Arrow icon for back button
const ArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Upload icon for document upload
const UploadIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Document icon for preview
const DocumentIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
  phone: '',
  joinedOn: '',
  dateOfBirth: '',
  baptised: false,
  physicalFormUrl: ''
};

const ProgressBarInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.progress}%;
  background-color: #6a26cd;
  transition: width 0.3s ease;
`;

const UploadContainer = styled.div`
  margin-bottom: 20px;
`;

const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f9fafb;
  color: #666;
  transition: all 0.2s;
  
  &:hover {
    border-color: #6a26cd;
    color: #6a26cd;
    background-color: rgba(106, 38, 205, 0.05);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const UploadInput = styled.input`
  display: none;
`;

const SelectedFilesContainer = styled.div`
  margin-top: 16px;
`;

const SelectedFilesTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const ExistingDocumentsContainer = styled.div`
  margin-top: 24px;
`;

const ExistingDocumentsTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const FileName = styled.div`
  font-size: 14px;
  color: #333;
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background-color: #fee2e2;
    color: #ef4444;
  }
`;

const DocumentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ViewDocumentButton = styled.button`
  background: none;
  border: none;
  color: #6a26cd;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(106, 38, 205, 0.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  padding: 8px 0;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #6a26cd;
`;

const CheckboxLabel = styled.span`
  font-size: 16px;
  color: #333;
`;



const MemberAdd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.member != null;
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState([]);
  const [previewDocumentName, setPreviewDocumentName] = useState([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const { data: branches = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchAllBranches
  });

  useEffect(() => {
    if (editMode && location.state?.member) {
      const member = location.state.member;
      // Format the joinedOn date for the date input (YYYY-MM-DD format)
      let formattedJoinedOn = '';
      if (member.joinedOn) {
        // If it's a Firestore timestamp, convert to JS Date
        const joinedDate = member.joinedOn.toDate ? member.joinedOn.toDate() : new Date(member.joinedOn);
        // Format as YYYY-MM-DD for the date input
        formattedJoinedOn = joinedDate.toISOString().split('T')[0];
      }
      
      // Format the dateOfBirth for the date input (YYYY-MM-DD format)
      let formattedDateOfBirth = '';
      if (member.dateOfBirth) {
        // If it's a Firestore timestamp, convert to JS Date
        const birthDate = member.dateOfBirth.toDate ? member.dateOfBirth.toDate() : new Date(member.dateOfBirth);
        // Format as YYYY-MM-DD for the date input
        formattedDateOfBirth = birthDate.toISOString().split('T')[0];
      }
      
      setFormFields({
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone || '',
        addressLine1: member.addressLine1,
        addressLine2: member.addressLine2 || '',
        city: member.city,
        county: member.county || '',
        postalCode: member.postalCode,
        country: member.country,
        branchId: member.branchId,
        joinedOn: formattedJoinedOn,
        dateOfBirth: formattedDateOfBirth,
        baptised: member.baptised || false,
        physicalFormUrl: member.physicalFormUrl || ''
      });
      
      // Set form progress to 100% in edit mode
      setFormProgress(100);
    }
  }, [editMode, location.state?.member]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
    
    // Calculate form progress
    const requiredFields = ['firstName', 'lastName', 'email', 'addressLine1', 'city', 'postalCode', 'country', 'branchId'];
    const filledRequiredFields = requiredFields.filter(field => formFields[field] || (name === field && value));
    const progress = Math.round((filledRequiredFields.length / requiredFields.length) * 100);
    setFormProgress(progress);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormFields({ ...formFields, [name]: checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Process the joinedOn date if it exists
      let processedFormFields = { ...formFields };
      
      // Process joinedOn date
      if (processedFormFields.joinedOn && processedFormFields.joinedOn.trim() !== '') {
        try {
          // Convert the string date to a JavaScript Date object
          const dateObj = new Date(processedFormFields.joinedOn);
          
          // Check if date is valid before assigning
          if (!isNaN(dateObj.getTime())) {
            processedFormFields.joinedOn = dateObj;
          } else {
            // If invalid, remove the joinedOn field
            delete processedFormFields.joinedOn;
          }
        } catch (error) {
          console.error('Error parsing joinedOn date:', error);
          // If there's an error, remove the joinedOn field
          delete processedFormFields.joinedOn;
        }
      } else {
        // If empty string or undefined, remove the field
        delete processedFormFields.joinedOn;
      }
      
      // Process dateOfBirth date
      if (processedFormFields.dateOfBirth && processedFormFields.dateOfBirth.trim() !== '') {
        try {
          // Convert the string date to a JavaScript Date object
          const dateObj = new Date(processedFormFields.dateOfBirth);
          
          // Check if date is valid before assigning
          if (!isNaN(dateObj.getTime())) {
            processedFormFields.dateOfBirth = dateObj;
          } else {
            // If invalid, remove the dateOfBirth field
            delete processedFormFields.dateOfBirth;
          }
        } catch (error) {
          console.error('Error parsing dateOfBirth:', error);
          // If there's an error, remove the dateOfBirth field
          delete processedFormFields.dateOfBirth;
        }
      } else {
        // If empty string or undefined, remove the field
        delete processedFormFields.dateOfBirth;
      }
      
      let memberData = { ...processedFormFields };
      
      // Handle file upload to Firebase Storage if there's a new file
      if (selectedFiles.length > 0) {
        const file = selectedFiles[0];
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        // Use a storage path that the user has permission to access
        const storageRef = ref(storage, `pdfs/${fileName}`);
        
        // Convert data URL to Blob
        const response = await fetch(previewUrl[0]);
        const blob = await response.blob();
        
        // Upload to Firebase Storage
        const uploadResult = await uploadBytes(storageRef, blob);
        
        // Get the download URL
        const downloadURL = await getDownloadURL(uploadResult.ref);
        
        // Set the URL in the member data
        memberData.physicalFormUrl = downloadURL;
      }

      if (editMode) {
        await updateMember(location.state.member.id, memberData);
      } else {
        await createMember(memberData);
      }
      navigate('/members');
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'creating'} member:`, error);
      alert(`Failed to ${editMode ? 'update' : 'create'} member. Please try again.`);
    }
  };

  const handleBack = () => {
    navigate('/members');
  };

  const handleFileChange = (event) => {
    // We only need one file for the physical form
    const file = event.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please select a smaller file.');
        return;
      }
      
      setSelectedFiles([file]);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl([reader.result]);
        setPreviewDocumentName([file.name]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (index) => {
    // Make sure we're working with arrays
    const files = Array.isArray(selectedFiles) ? selectedFiles.slice() : [];
    files.splice(index, 1);
    setSelectedFiles(files);
    
    const previewUrls = Array.isArray(previewUrl) ? previewUrl.slice() : [];
    previewUrls.splice(index, 1);
    setPreviewUrl(previewUrls);
    
    const previewDocumentNames = Array.isArray(previewDocumentName) ? previewDocumentName.slice() : [];
    previewDocumentNames.splice(index, 1);
    setPreviewDocumentName(previewDocumentNames);
  };

  const handleViewDocument = (doc) => {
    // Open directly in a new tab
    window.open(doc.url, '_blank');
  };

  const handleRemoveExistingDocument = () => {
    setFormFields({ ...formFields, physicalFormUrl: '' });
  };

  return (
    <PageContainer>
      <BackButton onClick={handleBack}>
        <ArrowIcon />
        Back to Members
      </BackButton>
      
      <FormContainer>
        <PageTitle>{editMode ? 'Edit Member' : 'Add New Member'}</PageTitle>
        <ProgressBar>
          <ProgressBarInner progress={formProgress} />
        </ProgressBar>
        <Form onSubmit={handleSubmit}>
          <SectionTitle>Personal Information</SectionTitle>
          <FormSection>
            <FormRow>
              <FormInput
                label="First Name"
                type="text"
                required
                name="firstName"
                value={formFields.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </FormRow>
            
            <FormRow>
              <FormInput
                label="Last Name"
                type="text"
                required
                name="lastName"
                value={formFields.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </FormRow>
            
            <FormRow>
              <FormInput
                label="Email"
                type="email"
                name="email"
                value={formFields.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </FormRow>
            
            <FormRow>
              <FormInput
                label="Phone"
                type="tel"
                name="phone"
                value={formFields.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </FormRow>
            
            <FormRow>
              <FormInput
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                required
                value={formFields.dateOfBirth}
                onChange={handleChange}
                placeholder="Select date of birth"
              />
            </FormRow>
          </FormSection>
          
          <SectionTitle>Address Information</SectionTitle>
          <FormSection>
            <FormRow fullWidth>
              <FormInput
                label="Address Line 1"
                type="text"
                required
                name="addressLine1"
                value={formFields.addressLine1}
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </FormRow>
            
            <FormRow fullWidth>
              <FormInput
                label="Address Line 2"
                type="text"
                name="addressLine2"
                value={formFields.addressLine2}
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
                value={formFields.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </FormRow>
            
            <FormRow>
              <FormInput
                label="County"
                type="text"
                name="county"
                value={formFields.county}
                onChange={handleChange}
                placeholder="Enter county (optional)"
              />
            </FormRow>
            
            <FormRow>
              <FormInput
                label="Postal Code"
                type="text"
                required
                name="postalCode"
                value={formFields.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
              />
            </FormRow>
            
            <FormRow>
              <FormSelect
                label="Country"
                required
                name="country"
                value={formFields.country}
                onChange={handleChange}
              >
                <option value="">Select country</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other</option>
              </FormSelect>
            </FormRow>
          </FormSection>
          
          <SectionTitle>Church Information</SectionTitle>
          <FormSection>
            <FormRow>
              <FormSelect
                label="Branch"
                required
                name="branchId"
                value={formFields.branchId}
                onChange={handleChange}
              >
                <option value="">Select branch</option>
                {branches?.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </FormSelect>
            </FormRow>
            
            <FormRow>
              <FormInput
                label="Joined On"
                type="date"
                name="joinedOn"
                required
                value={formFields.joinedOn}
                onChange={handleChange}
                placeholder="Select join date"
              />
            </FormRow>
            
            <FormRow>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  name="baptised"
                  checked={formFields.baptised}
                  onChange={handleCheckboxChange}
                />
                <CheckboxLabel>Baptised</CheckboxLabel>
              </CheckboxContainer>
            </FormRow>
          </FormSection>
          
          <SectionTitle>Physical Form</SectionTitle>
          <FormSection>
            <FormRow fullWidth>
              <UploadContainer>
                <UploadLabel htmlFor="document-upload">
                  <UploadIconSvg />
                  <span>Upload Physical Form</span>
                </UploadLabel>
                <UploadInput
                  id="document-upload"
                  type="file"
                  onChange={handleFileChange}
                />
              </UploadContainer>
              
              {selectedFiles.length > 0 && (
                <SelectedFilesContainer>
                  <SelectedFilesTitle>Selected File:</SelectedFilesTitle>
                  <FileList>
                    <FileItem>
                      <FileName>{selectedFiles[0].name}</FileName>
                      <RemoveFileButton onClick={() => handleRemoveFile(0)}>
                        &times;
                      </RemoveFileButton>
                    </FileItem>
                  </FileList>
                </SelectedFilesContainer>
              )}
              
              {formFields.physicalFormUrl && (
                <ExistingDocumentsContainer>
                  <ExistingDocumentsTitle>Existing Physical Form:</ExistingDocumentsTitle>
                  <FileList>
                    <FileItem>
                      <FileName>Physical Form</FileName>
                      <DocumentActions>
                        <ViewDocumentButton onClick={() => handleViewDocument({ name: 'Physical Form', url: formFields.physicalFormUrl })}>
                          <DocumentIconSvg />
                          View
                        </ViewDocumentButton>
                        <RemoveFileButton onClick={() => handleRemoveExistingDocument()}>
                          &times;
                        </RemoveFileButton>
                      </DocumentActions>
                    </FileItem>
                  </FileList>
                </ExistingDocumentsContainer>
              )}
            </FormRow>
          </FormSection>
          <ButtonContainer>
            <Button type="button" onClick={handleBack} buttonType="inverted">
              Cancel
            </Button>
            <Button type="submit">
              {editMode ? 'Update Member' : 'Save Member'}
            </Button>
          </ButtonContainer>
        </Form>
        
        {isPreviewModalOpen && (
          <ModalOverlay onClick={() => setIsPreviewModalOpen(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <CloseButton onClick={() => setIsPreviewModalOpen(false)}>×</CloseButton>
              <h3>{typeof previewDocumentName === 'string' ? previewDocumentName : 'Physical Form'}</h3>
              
              <ModalMessage>
                Click the button below to view the document in a new tab
              </ModalMessage>
              
              <DocumentViewButton 
                href={typeof previewUrl === 'string' ? previewUrl : Array.isArray(previewUrl) && previewUrl.length > 0 ? previewUrl[0] : ''}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </DocumentViewButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </FormContainer>
    </PageContainer>
  );
};

export default MemberAdd;
