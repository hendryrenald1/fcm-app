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

const TableContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 20px;
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
  background-color: ${props => props.active ? '#7B2A8A' : 'white'};
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
          <ActionButton
            onClick={() => {
              console.log('Editing branch:', branch);
              navigate('/add-branch', { 
                state: { branch: branch }
              });
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit
          </ActionButton>
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
          <PageInfo>
            Showing {data?.branches?.length || 0} of {data?.total || 0} branches
          </PageInfo>
          <PageButtons>
            <PageButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </PageButton>
            
            {/* Generate page buttons */}
            {Array.from({ length: Math.min(table.getPageCount(), 5) }, (_, i) => {
              let pageNum;
              const currentPageIndex = table.getState().pagination.pageIndex;
              
              if (table.getPageCount() <= 5) {
                pageNum = i;
              } else if (currentPageIndex <= 2) {
                pageNum = i;
              } else if (currentPageIndex >= table.getPageCount() - 3) {
                pageNum = table.getPageCount() - 5 + i;
              } else {
                pageNum = currentPageIndex - 2 + i;
              }
              
              return (
                <PageButton
                  key={pageNum}
                  active={currentPageIndex === pageNum}
                  onClick={() => table.setPageIndex(pageNum)}
                >
                  {pageNum + 1}
                </PageButton>
              );
            })}
            
            <PageButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </PageButton>
          </PageButtons>
        </PaginationContainer>
      </TableContainer>
    </div>
  );
};
