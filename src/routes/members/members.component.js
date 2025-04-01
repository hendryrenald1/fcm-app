import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FormInput } from '../../components/form-input/form-input.component';   
import { Button } from '../../components/button/button.component';
import MemberList from '../../components/member-list/member-list.component';

const MemberContainer = styled.div`
    border : 1px solid black;
    background: #ECE7E0;
    display: flex;
    flex : 1;
    flex-direction: column;
    align-items: stretch;
    justify-content: top;
    height: 100vh;
`;

const MemberFilter = styled.div`
     
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 10px;
    border: 1px solid black;
    background: #ECE7E0;


`;

const MemberListContainer = styled.div`  
   display: flex;

`;


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
                <FormInput
                    type='text'
                    placeholder='Search by name, email, or branch...'
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <Button onClick={handleAddMember}>Add Member</Button>
            </MemberFilter>
            <MemberListContainer>
                <MemberList 
                    searchQuery={searchQuery} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </MemberListContainer>
        </MemberContainer>
    )
}

export default Members;