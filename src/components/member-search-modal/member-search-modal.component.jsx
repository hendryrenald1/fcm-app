import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchMembers } from '../../utils/firebase/firebase.utils';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  padding: 12px 16px 12px 42px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #6a26cd;
    box-shadow: 0 0 0 2px rgba(106, 38, 205, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const MemberTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  
  th, td {
    padding: 16px;
    text-align: left;
  }
  
  th {
    background-color: #f8f8f8;
    font-weight: 600;
    color: #333;
    font-size: 14px;
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 1px solid #eee;
  }
  
  td {
    border-bottom: 1px solid #eee;
    color: #444;
    font-size: 14px;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tbody tr {
    transition: background-color 0.2s;
    cursor: pointer;
  }
  
  tbody tr:hover td {
    background-color: #f9f0ff;
  }
  
  tbody tr.selected td {
    background-color: #f0e6ff;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: #666;
  
  svg {
    width: 48px;
    height: 48px;
    color: #ddd;
    margin-bottom: 16px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0;
  color: #666;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #6a26cd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 12px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.secondary ? 'transparent' : '#6a26cd'};
  color: ${props => props.secondary ? '#666' : 'white'};
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  border: ${props => props.secondary ? '1px solid #ddd' : 'none'};
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.secondary ? '#f5f5f5' : '#5a20b0'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const MemberSearchModal = ({ isOpen, onClose, onSelectMember }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Using useCallback to memoize the function
  const loadMembers = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchMembers({ searchQuery });
      setMembers(result.members);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);
  
  useEffect(() => {
    if (isOpen) {
      loadMembers();
    }
  }, [isOpen, loadMembers]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadMembers();
  };
  
  const handleSelectMember = (member) => {
    setSelectedMember(member);
  };
  
  const handleConfirmSelection = () => {
    if (selectedMember) {
      onSelectMember(selectedMember);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  // Search icon SVG
  const SearchIconSvg = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  
  // Empty state icon
  const EmptyStateIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  
  // Check icon for select button
  const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Select Pastor</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <form onSubmit={handleSearchSubmit}>
          <SearchContainer>
            <SearchIcon>
              <SearchIconSvg />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
          </SearchContainer>
        </form>
        
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <span>Loading members...</span>
          </LoadingContainer>
        ) : (
          <TableContainer>
            <MemberTable>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <EmptyState>
                        <EmptyStateIcon />
                        <p>No members found matching your search</p>
                      </EmptyState>
                    </td>
                  </tr>
                ) : (
                  members.map(member => (
                    <tr 
                      key={member.id} 
                      onClick={() => handleSelectMember(member)}
                      className={selectedMember?.id === member.id ? 'selected' : ''}
                    >
                      <td>{member.firstName}</td>
                      <td>{member.lastName}</td>
                      <td>{member.email}</td>
                      <td>{member.phone}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </MemberTable>
          </TableContainer>
        )}
        
        <ButtonContainer>
          <Button secondary onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirmSelection} 
            disabled={!selectedMember}
          >
            <CheckIcon /> Select Pastor
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MemberSearchModal;
