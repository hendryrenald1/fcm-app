import React, { useState } from 'react';
import styled from "styled-components";
import { FormInput } from '../../components/form-input/form-input.component';
import { Button } from '../../components/button/button.component';
import { Branches } from "../../components/branches/branches.component";

const BranchesContainer = styled.div`
    border: 1px solid black;
    background: #ECE7E0;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: stretch;
    justify-content: top;
    height: 100vh;
`;

const BranchFilter = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 10px;
    border: 1px solid black;
    background: #ECE7E0;
`;

const BranchListContainer = styled.div`
    display: flex;
`;

const BranchesRoute = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset page to 1 when searching
    };

    return (
        <BranchesContainer>
            <BranchFilter>
                <FormInput
                    placeholder="Search branches..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <Button>Add Branch</Button>
            </BranchFilter>
            <BranchListContainer>
                <Branches searchQuery={searchQuery} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </BranchListContainer>
        </BranchesContainer>
    );
};

export default BranchesRoute;
