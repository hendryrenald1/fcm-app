import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/button/button.component';
import MemberList from '../../components/member/member-list.component';

const MemberContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #f9f0ff;
    min-height: 100vh;
    width: 100%;
`;

const MemberFilter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin: 20px;
    margin-bottom: 0;
`;

const MemberListContainer = styled.div`  
    display: flex;
    flex: 1;
    padding: 0 20px;
`;


const SearchInput = styled.input`
    height: 48px;
    padding: 0 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    flex: 1;
    max-width: 500px;
    
    &:focus {
        outline: none;
        border-color: #6a26cd;
        box-shadow: 0 0 0 2px rgba(106, 38, 205, 0.1);
    }
    
    &::placeholder {
        color: #aaa;
    }
`;

const AddMemberButton = styled(Button)`
    height: 48px;
    padding: 0 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
        width: 20px;
        height: 20px;
    }
`;

// Plus icon for add button
const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Members = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset page to 1 when searching
    };

    const handleAddMember = () => {
        navigate('/add-member');
    };

    return (
        <MemberContainer>
            <MemberFilter>
                <SearchInput
                    type='text'
                    placeholder='Search by name, email, or branch...'
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <AddMemberButton onClick={handleAddMember}>
                    <PlusIcon /> Add Member
                </AddMemberButton>
            </MemberFilter>
            <MemberListContainer>
                <MemberList 
                    searchQuery={searchQuery} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    onSearch={setSearchQuery}
                />
            </MemberListContainer>
        </MemberContainer>
    )
}

export default Members;