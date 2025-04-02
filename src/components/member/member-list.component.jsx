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

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  flex: 1;  
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
  background: #ECE7E0;
  padding: 10px;
  border-radius: 5px;
`;

const StyledTable = styled.table`
  
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background-color: white;
    cursor: pointer;

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #f5f5f5;
    }
  }
`;



const MemberList = ({ searchQuery, currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const pageSize = 10;

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
          <Button 
            onClick={() => {
              console.log('Editing member:', memberToEdit);
              navigate('/add-member', { 
                state: { member: memberToEdit }
              });
            }}
          >
            ✏️ Edit
          </Button>
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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <SearchContainer>
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
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </PaginationContainer>
    </SearchContainer>
  );
};

export default MemberList;