import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { Button } from '../button/button.component';
import { createMember, updateMember, fetchAllBranches, storage } from '../../utils/firebase/firebase.utils';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

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

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  margin-top: 30px;
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const Select = styled.select`
  height: 48px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #6a26cd;
    box-shadow: 0 0 0 2px rgba(106, 38, 205, 0.1);
  }
`;

const FieldLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  height: 48px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #6a26cd;
    box-shadow: 0 0 0 2px rgba(106, 38, 205, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const DocumentUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 120px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
  overflow: hidden;
  position: relative;
  
  &:hover {
    border-color: #6a26cd;
    background-color: rgba(106, 38, 205, 0.03);
  }
`;

const DocumentPreview = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  
  svg {
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
    color: #6a26cd;
  }
  
  span {
    font-size: 12px;
    color: #333;
    text-align: center;
  }
`;

const UploadIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  font-size: 14px;
  
  svg {
    margin-bottom: 8px;
    color: #6a26cd;
  }
`;

const UploadText = styled.div`
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 8px;
`;

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

const DocumentFrame = styled.iframe`
  width: 800px;
  height: 600px;
  border: none;
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 40px;
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
  dateOfBirth: '',
  phone: '',
  joinedOn: new Date().toISOString().split('T')[0]
};

const MemberAdd = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.member != null;

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  

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

      // Set the downloadURL if the member has a physical form URL
      if (member.physicalFormUrl) {
        setDownloadURL(member.physicalFormUrl);
      }

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
      const memberDataWithFile = {
        ...formFields,
        physicalFormUrl: downloadURL || null // Include the file URL in member data
      };

      if (editMode) {
        await updateMember(location.state.member.id, memberDataWithFile);
      } else {
        await createMember(memberDataWithFile);
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      // Create a unique filename using timestamp and original name
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `physicalForms/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
      setFormFields({
        ...formFields,
        physicalFormUrl: url
      });
      
      // Reset file state after successful upload
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  
  const openDocumentModal = () => {
    if (downloadURL) {
      setShowDocumentModal(true);
    }
  };
  
  const closeDocumentModal = () => {
    setShowDocumentModal(false);
  };

  return (
    <PageContainer>
      <BackButton onClick={handleCancel}>
        <ArrowIcon /> Add Member
      </BackButton>
      
      <FormContainer>
        <SectionTitle>Basic Details</SectionTitle>
        <Form onSubmit={handleSubmit}>
        <InputGroup>
          <FieldLabel>First Name</FieldLabel>
          <Input
            type="text"
            required
            name="firstName"
            value={firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />
        </InputGroup>
        
        <InputGroup>
          <FieldLabel>Last Name</FieldLabel>
          <Input
            type="text"
            required
            name="lastName"
            value={lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />
        </InputGroup>
        
        <InputGroup>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            required
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="example@gmail.com"
          />
        </InputGroup>
          
        <SectionTitle>Address</SectionTitle>
        
        <InputGroup>
          <FieldLabel>Address Line 1</FieldLabel>
          <Input
            type="text"
            required
            name="addressLine1"
            value={addressLine1}
            onChange={handleChange}
            placeholder="Door No, Apartment, Building, Floor etc."
          />
        </InputGroup>
        
        <InputGroup>
          <FieldLabel>Address Line 2</FieldLabel>
          <Input
            type="text"
            name="addressLine2"
            value={addressLine2}
            onChange={handleChange}
            placeholder="Street address"
          />
        </InputGroup>
        
        <InputGroup>
          <FieldLabel>Country</FieldLabel>
          <Select
            required
            name="country"
            value={country}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </Select>
        </InputGroup>
        
        <InputGroup>
          <FieldLabel>State/Province</FieldLabel>
          <Select
            name="county"
            value={county}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="London">London</option>
            <option value="Manchester">Manchester</option>
            <option value="Birmingham">Birmingham</option>
            <option value="Liverpool">Liverpool</option>
          </Select>
        </InputGroup>
        
        <InputGroup>
          <FieldLabel>City</FieldLabel>
          <Select
            required
            name="city"
            value={city}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="London">London</option>
            <option value="Manchester">Manchester</option>
            <option value="Birmingham">Birmingham</option>
            <option value="Liverpool">Liverpool</option>
          </Select>
        </InputGroup>
        
        <InputGroup>
          <FieldLabel>Postal Code</FieldLabel>
          <Input
            type="text"
            required
            name="postalCode"
            value={postalCode}
            onChange={handleChange}
            placeholder="Enter Code"
          />
        </InputGroup>
        <SectionTitle>Other Details</SectionTitle>
        
        <InputGroup>
          <FieldLabel>Mobile Number</FieldLabel>
          <Input
            type="tel"
            required
            name="phone"
            value={phone}
            onChange={handleChange}
            placeholder="Enter Mobile Number"
          />
        </InputGroup>
        
        <InputGroup>
          <FieldLabel>Date of Birth</FieldLabel>
          <Input
            type="date"
            required
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={handleChange}
          />
        </InputGroup>
        
        <InputGroup>
          <FieldLabel>Branch</FieldLabel>
          <Select
            required
            name="branchId"
            value={branchId}
            onChange={handleChange}
            disabled={branchesLoading}
          >
            <option value="">Select</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </InputGroup>
        
        <InputGroup>
          <FieldLabel>Joined On</FieldLabel>
          <Input
            type="date"
            required
            name="joinedOn"
            value={joinedOn}
            onChange={handleChange}
          />
        </InputGroup>
        
        <SectionTitle>Physical Form Document</SectionTitle>
        
        <InputGroup style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            {downloadURL ? (
              <DocumentUploadContainer onClick={openDocumentModal}>
                <DocumentPreview>
                  <DocumentIconSvg />
                  <span>View Document</span>
                </DocumentPreview>
              </DocumentUploadContainer>
            ) : (
              <DocumentUploadContainer onClick={() => document.getElementById('documentUpload').click()}>
                <UploadIcon>
                  <UploadIconSvg />
                  <span>Upload Document</span>
                </UploadIcon>
              </DocumentUploadContainer>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                id="documentUpload"
                type="file" 
                accept="application/pdf" 
                name="physicalForm" 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
              />
              
              {!downloadURL && (
                <>
                  <Button 
                    type="button" 
                    onClick={() => document.getElementById('documentUpload').click()}
                  >
                    Select Document
                  </Button>
                  <UploadText>
                    Supported format: PDF
                  </UploadText>
                </>
              )}
              
              {file && !downloadURL && (
                <Button 
                  type="button" 
                  onClick={handleFileUpload} 
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              )}
              
              {downloadURL && (
                <div>
                  <Button 
                    type="button" 
                    onClick={openDocumentModal}
                  >
                    View Document
                  </Button>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    Click to view the uploaded document
                  </div>
                </div>
              )}
            </div>
          </div>
        </InputGroup>
        
        {showDocumentModal && (
          <ModalOverlay onClick={closeDocumentModal}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <CloseButton onClick={closeDocumentModal}>×</CloseButton>
              <DocumentFrame src={downloadURL} title="Physical Form Document" />
            </ModalContent>
          </ModalOverlay>
        )}
        <ButtonContainer>
          <Button type="button" onClick={handleCancel}>Cancel</Button>
          <Button type="submit">{editMode ? 'Update Member' : 'Add Member'}</Button>
        </ButtonContainer>
      </Form>
    </FormContainer>
  </PageContainer>
  );
};

export default MemberAdd;
