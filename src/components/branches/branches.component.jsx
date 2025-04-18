import { useQuery } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import styled from "styled-components";
import { fetchBranchesWithPastors } from "../../utils/firebase/branch.utils";
import { Button } from "../button/button.component";


const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  flex: 1;  
  background: #ECE7E0;
  padding: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f8f9fa;
    font-weight: 600;
  }

  tr:hover {
    background: #f8f9fa;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PageInfo = styled.span`
  color: #666;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;



export const Branches = ({ searchQuery, currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const pageSize = 10;
  const pageIndex = currentPage - 1;

  const columns = [
    {
      accessorKey: "name",
      header: "Branch Name",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "pastorName",
      header: "Pastor",
      cell: ({ row }) => {
        return row.original.pastorName || 'No Pastor Assigned';
      }
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <Button
            onClick={() => {
              console.log('Editing branch:', branch);
              navigate('/add-branch', { 
                state: { branch: branch }
              });
            }}
          >
            ✏️ Edit
          </Button>
        );
      }
    }
  ];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["branches", currentPage, searchQuery],
    queryFn: () => fetchBranchesWithPastors({ page: currentPage, pageSize, searchQuery }),
    placeholderData: (previousData) => previousData,
  });

  const table = useReactTable({
    data: data?.branches ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil((data?.total ?? 0) / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
        ? updater({ pageIndex, pageSize })
        : updater;
      setCurrentPage(newPagination.pageIndex + 1);
    },
    manualPagination: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading branches</div>;

  return (
    <div>
      <TableContainer>
        <StyledTable>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
          <PaginationButton
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </PaginationButton>
          <PageInfo>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </PageInfo>
          <PaginationButton
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </PaginationButton>
        </PaginationContainer>
      </TableContainer>
    </div>
  );
};
