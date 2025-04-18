import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchMembers } from '../../utils/firebase/firebase.utils';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 800px;
  height: 600px; /* Fixed height */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 400px; /* Minimum height for table container */
`;

const MemberTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  tr:hover {
    background-color: #f9f9f9;
    cursor: pointer;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.secondary ? '#ccc' : '#4CAF50'};
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.secondary ? '#bbb' : '#45a049'};
  }
`;

const MemberSearchModal = ({ isOpen, onClose, onSelectMember }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  
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
    onSelectMember(member);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>Select Pastor</h2>
        
        <form onSubmit={handleSearchSubmit}>
          <SearchInput
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </form>
        
        {loading ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p>Loading...</p>
          </div>
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
                    <td colSpan="4">No members found</td>
                  </tr>
                ) : (
                  members.map(member => (
                    <tr key={member.id} onClick={() => handleSelectMember(member)}>
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
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MemberSearchModal;
