import React, { useState, useEffect } from 'react';
import styled from "styled-components";

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: #f9f0ff;
    min-height: 100vh;
    width: 100%;
    padding: 20px;
`;

const DashboardGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
    
    @media (max-width: 1200px) {
        grid-template-columns: 1fr;
    }
`;

const PageTitle = styled.h1`
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0 0 24px 0;
`;


const Card = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const StatCard = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 20px;
    position: relative;
    overflow: hidden;
    
    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 30%;
        height: 100%;
        background: ${props => props.bgGradient || 'rgba(123, 42, 138, 0.05)'};
        border-radius: 0 12px 12px 0;
        z-index: 0;
    }
`;

const StatLabel = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: #666;
    margin-bottom: 8px;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const StatValue = styled.div`
    font-size: 36px;
    font-weight: 700;
    color: #333;
    position: relative;
    z-index: 1;
`;

const MapContainer = styled.div`
    position: relative;
    width: 100%;
    height: 500px;
    background-color: #f5f5f5;
    border-radius: 12px;
    overflow: hidden;
`;

const Map = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f0f8ff;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNTAwIj48cGF0aCBmaWxsPSIjZTBlMGUwIiBkPSJNMTYzLDM5N2wtMTMsLTMzbC0yMCwtOGwtMTcsLTI3bC0xNCwtNWwtMTAsLTI0bC0xNiwtMTBsLTEwLC0yMmwxLC0xOGwtMTQsLTI4bDksLTMwbC0yLC0yMGwtMTEsLTE0bDcsLTIxbC0xMCwtMjVsMTQsLTEybC0xLC0yNWwxMCwtMTRsMTQsLTNsMTAsLTI2bDIxLC0xbDEwLC0xMmwxNSw3bDIxLC0xM2wxMCwxMGwxOCw0bDI0LC0xNGwxNCwxMGwzMCwtMTFsMTEsMTBsMjEsLTEzbDE0LDEwbDIwLC0xbDEwLC0xMmwxOCw0bDEwLC0xMmwxOCw0bDEwLDIybDIxLC0xbDEwLDEwbC0xLDI1bC0xMCwxNGwtMTQsM2wtMTAsMTRsLTIwLDFsLTEwLDEybC0xNSwtN2wtMTAsMTJsLTIwLDFsLTEwLDI2bC0yNSwxNGwtMTAsLTEwbC0xOCwtNGwtMTAsMTJsLTIxLDEzbC0xMCwtMTBsLTE4LC00bC0xMCwxMmwtMTQsM2wtMTAsMjZsLTIxLC0xbC0xMCwxMmwtMTUsLTdsMSwzN2wtMTAsMTRsLTE0LDNsLTEwLDI2bC0yMCwxbC0xMCwxMmwtMTUsLTdsMSwyNWwtMTAsMTRaIi8+PC9zdmc+');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
`;

const MapMarker = styled.div`
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: ${props => props.color || '#7B2A8A'};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 4px rgba(123, 42, 138, 0.2);
    cursor: pointer;
    
    &:hover {
        transform: translate(-50%, -50%) scale(1.2);
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid ${props => props.color || '#7B2A8A'};
    }
`;

const MapTooltip = styled.div`
    position: absolute;
    background: white;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    min-width: 200px;
    z-index: 10;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    transform: translate(-50%, -130%);
    
    &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid white;
    }
`;

const TooltipTitle = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
`;

const TooltipLocation = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
`;

const TooltipContact = styled.div`
    font-size: 12px;
    color: #7B2A8A;
`;

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    
    th, td {
        padding: 12px 16px;
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

const CardTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
`;




// Icons for the stats cards
const BranchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 3V15" stroke="#7B2A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9Z" stroke="#7B2A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z" stroke="#7B2A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 9C18 11.3869 17.0518 13.6761 15.364 15.364C13.6761 17.0518 11.3869 18 9 18" stroke="#7B2A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const MembersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BaptisedIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16V12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8H12.01" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Home = () => {
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    
    useEffect(() => {
        // Set map as loaded after component mounts
        setMapLoaded(true);
    }, []);
    
    // Sample branch data
    const branches = [
        { id: 1, name: 'Surbiton Faith Church', location: 'Surbiton', members: 265, baptised: 198, position: { top: 70, left: 40 }, contact: '01632 960123' },
        { id: 2, name: 'Elmfield Church', location: 'Wembley', members: 300, baptised: 250, position: { top: 65, left: 45 }, contact: '01632 960124' },
        { id: 3, name: 'Liverpool Faith Church', location: 'Liverpool', members: 562, baptised: 489, position: { top: 40, left: 30 }, contact: '01632 960125' },
        { id: 4, name: 'North Evington Free Church', location: 'Leicester', members: 450, baptised: 320, position: { top: 50, left: 40 }, contact: '01632 960233' },
        { id: 5, name: 'St Lukes Church', location: 'Manchester', members: 723, baptised: 592, position: { top: 35, left: 35 }, contact: '01632 960126' },
        { id: 6, name: 'Stanton Road Baptist Church', location: 'Luton', members: 345, baptised: 289, position: { top: 60, left: 50 }, contact: '01632 960127' },
        { id: 7, name: 'East Ham Faith Church', location: 'East Ham', members: 652, baptised: 490, position: { top: 65, left: 55 }, contact: '01632 960128' },
        { id: 8, name: 'Elmfield Church', location: 'Wembley', members: 300, baptised: 250, position: { top: 65, left: 45 }, contact: '01632 960129' },
        { id: 9, name: 'Liverpool Faith Church', location: 'Liverpool', members: 450, baptised: 320, position: { top: 40, left: 30 }, contact: '01632 960130' },
        { id: 10, name: 'St Lukes Church', location: 'Manchester', members: 723, baptised: 592, position: { top: 35, left: 35 }, contact: '01632 960131' },
    ];
    
    // Calculate totals
    const totalBranches = branches.length;
    const totalMembers = branches.reduce((sum, branch) => sum + branch.members, 0);
    const totalBaptised = branches.reduce((sum, branch) => sum + branch.baptised, 0);
    
    const handleMarkerClick = (branch) => {
        setSelectedBranch(branch);
    };
    
    const handleMapClick = (e) => {
        // Close tooltip when clicking elsewhere on the map
        if (e.target === e.currentTarget) {
            setSelectedBranch(null);
        }
    };
    
    return (
        <HomeContainer>
            <StatsGrid>
                <StatCard bgGradient="rgba(123, 42, 138, 0.1)">
                    <StatLabel><BranchIcon /> Branches</StatLabel>
                    <StatValue>{totalBranches}</StatValue>
                </StatCard>
                
                <StatCard bgGradient="rgba(249, 115, 22, 0.1)">
                    <StatLabel><MembersIcon /> Members</StatLabel>
                    <StatValue>{totalMembers.toLocaleString()}</StatValue>
                </StatCard>
                
                <StatCard bgGradient="rgba(59, 130, 246, 0.1)">
                    <StatLabel><BaptisedIcon /> Members Baptised</StatLabel>
                    <StatValue>{totalBaptised.toLocaleString()}</StatValue>
                </StatCard>
            </StatsGrid>
            
            <DashboardGrid>
                <Card>
                    <CardTitle>Branch Locations</CardTitle>
                    <MapContainer>
                        <Map onClick={handleMapClick}>
                            {branches.map(branch => (
                                <MapMarker 
                                    key={branch.id}
                                    style={{
                                        top: `${branch.position.top}%`,
                                        left: `${branch.position.left}%`
                                    }}
                                    onClick={() => handleMarkerClick(branch)}
                                />
                            ))}
                            
                            {selectedBranch && (
                                <MapTooltip 
                                    top={selectedBranch.position.top} 
                                    left={selectedBranch.position.left}
                                >
                                    <TooltipTitle>{selectedBranch.name}</TooltipTitle>
                                    <TooltipLocation>{selectedBranch.location}</TooltipLocation>
                                    <TooltipContact>Contact: {selectedBranch.contact}</TooltipContact>
                                </MapTooltip>
                            )}
                        </Map>
                    </MapContainer>
                </Card>
                
                <Card>
                    <CardTitle>Branch Summary</CardTitle>
                    <TableContainer>
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Branch Name</th>
                                    <th>Location</th>
                                    <th>Members</th>
                                    <th>Members Baptised</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branches.map((branch, index) => (
                                    <tr key={branch.id}>
                                        <td>{String(index + 1).padStart(2, '0')}</td>
                                        <td>{branch.name}</td>
                                        <td>{branch.location}</td>
                                        <td>{branch.members}</td>
                                        <td>{branch.baptised}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableContainer>
                </Card>
            </DashboardGrid>
        </HomeContainer>
    );
}
export default Home; 