import { useQuery } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import styled from "styled-components";
import { fetchMembers } from "../../utils/firebase/firebase.utils";
import { Button } from "../button/button.component";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  background: #f9f0ff;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 20px;
`;


const AddButton = styled(Button)`
  height: 48px;
  padding: 0 24px;
  background-color: #6a26cd;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #5a20b0;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 24px;

  th, td {
    padding: 16px;
    text-align: left;
  }

  th {
    background-color: #f8f8f8;
    font-weight: 600;
    color: #333;
    font-size: 14px;
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

  tr:hover td {
    background-color: #f9f7ff;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;

const PageInfo = styled.div`
  font-size: 14px;
  color: #666;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button`
  height: 40px;
  min-width: 40px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: ${props => props.active ? '#6a26cd' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active ? '#5a20b0' : '#f5f5f5'};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  background-color: transparent;
  color: #6a26cd;
  border: 1px solid #6a26cd;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background-color: rgba(106, 38, 205, 0.05);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
  
  svg {
    width: 64px;
    height: 64px;
    color: #ddd;
    margin-bottom: 16px;
  }
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
  }
`;



// Icons
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmptyStateIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MemberList = ({ searchQuery = '', currentPage = 1, setCurrentPage, onSearch }) => {
  const navigate = useNavigate();
  const pageSize = 10;
  
  const handleAddMember = () => {
    navigate('/add-member');
  };
  


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["members", currentPage, searchQuery],
    queryFn: () => fetchMembers({ page: currentPage, pageSize, searchQuery }),
    placeholderData: (previousData) => previousData,
  });

  const columns = [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { 
      accessorKey: "branch",
      header: "Branch",
      cell: ({ row }) => {
        const branch = row.original.branch;
        return branch?.name || 'N/A';
      }
    },
    {
      accessorKey: "joinedOn",
      header: "Joined On",
      cell: ({ row }) => {
        const member = row.original;
        const date = member.joinedOn?.toDate?.() || member.joinedOn;
        return date ? new Intl.DateTimeFormat('en-US').format(date) : 'N/A';
      }
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;
        // Format dates before passing to edit form
        const memberToEdit = {
          ...member,
          dateOfBirth: member.dateOfBirth?.toDate?.() || member.dateOfBirth,
          joinedOn: member.joinedOn?.toDate?.() || member.joinedOn
        };
        return (
          <ActionButton 
            onClick={() => {
              console.log('Editing member:', memberToEdit);
              navigate('/add-member', { 
                state: { member: memberToEdit }
              });
            }}
          >
            <EditIcon /> Edit
          </ActionButton>
        );
      }
    },
  ];

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const table = useReactTable({
    data: data?.members || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: totalPages,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
  });

  if (isLoading) return (
    <PageContainer>
      <ContentContainer>
        <p>Loading members...</p>
      </ContentContainer>
    </PageContainer>
  );
  
  if (isError) return (
    <PageContainer>
      <ContentContainer>
        <p>Error loading members: {error.message}</p>
      </ContentContainer>
    </PageContainer>
  );

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Members</PageTitle>
      </PageHeader>
      
      <ContentContainer>
        {data?.members?.length > 0 ? (
          <>
            <StyledTable>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            
            <PaginationContainer>
              <PageInfo>
                Showing {data.members.length} of {data.total} members
              </PageInfo>
              <PageButtons>
                <PageButton
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon />
                </PageButton>
                
                {/* Generate page buttons */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <PageButton
                      key={pageNum}
                      active={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PageButton>
                  );
                })}
                
                <PageButton
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRightIcon />
                </PageButton>
              </PageButtons>
            </PaginationContainer>
          </>
        ) : (
          <EmptyState>
            <EmptyStateIcon />
            <h3>No members found</h3>
            <p>Try adjusting your search or add a new member</p>
            <AddButton onClick={handleAddMember}>
              <PlusIcon /> Add Member
            </AddButton>
          </EmptyState>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default MemberList;