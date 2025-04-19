import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../utils/firebase/firebase.utils';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import styled from "styled-components";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';

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

const Card = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const CardTitle = styled.h2`
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 20px 0;
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

const StatCard = styled.div.attrs(props => ({
    'data-bg-gradient': props.bgGradient || 'rgba(123, 42, 138, 0.05)'
}))`
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
        background: ${props => props['data-bg-gradient']};
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
    height: 400px;
    border-radius: 8px;
    overflow: hidden;
`;

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 14px;
    
    thead {
        background-color: #f5f5f5;
        
        th {
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 1px solid #e0e0e0;
        }
    }
    
    tbody {
        tr {
            &:hover {
                background-color: #f9f0ff;
            }
        }
        
        td {
            padding: 12px 16px;
            border-bottom: 1px solid #e0e0e0;
        }
    }
`;

const BranchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3V13.5858L7.70711 10.2929C7.31658 9.90237 6.68342 9.90237 6.29289 10.2929C5.90237 10.6834 5.90237 11.3166 6.29289 11.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L17.7071 11.7071C18.0976 11.3166 18.0976 10.6834 17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929L13 13.5858V3Z" fill="#6a26cd"/>
        <path d="M4 15C4 14.4477 3.55228 14 3 14C2.44772 14 2 14.4477 2 15V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V15C22 14.4477 21.5523 14 21 14C20.4477 14 20 14.4477 20 15V20H4V15Z" fill="#6a26cd"/>
    </svg>
);

const MembersIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" fill="#f97316"/>
        <path d="M9 13C5.13401 13 2 16.134 2 20V21H16V20C16 16.134 12.866 13 9 13Z" fill="#f97316"/>
        <path d="M19.9999 8H21.9999V10H19.9999V12H17.9999V10H15.9999V8H17.9999V6H19.9999V8Z" fill="#f97316"/>
    </svg>
);

// Google Maps container styles
const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '8px'
};

// Default center (UK)
const defaultCenter = {
    lat: 54.093409,
    lng: -2.89479
};

// Map options
const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ]
};

const BaptisedIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#3b82f6"/>
    </svg>
);

const Home = () => {
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [branchLocations, setBranchLocations] = useState([]);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(7); // Default zoom level for UK
    
    // Load Google Maps API
    const { isLoaded: mapsApiLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Use environment variable for production
        language: 'en',
        region: 'GB'
    });
    
    // Fetch all branches
    const { data: branchesData = [], isLoading: branchesLoading } = useQuery({
        queryKey: ['branches'],
        queryFn: async () => {
            const branchesRef = collection(db, 'branches');
            const branchesSnapshot = await getDocs(query(branchesRef, orderBy('name', 'asc')));
            const branches = branchesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    members: 0,
                    baptised: 0,
                    // Keep postcode for geocoding
                    postCode: data.postCode || ''
                };
            });
            return branches;
        }
    });
    
    // Fetch all members to count by branch
    const { data: membersData = [], isLoading: membersLoading } = useQuery({
        queryKey: ['members-count'],
        queryFn: async () => {
            const membersRef = collection(db, 'members');
            const membersSnapshot = await getDocs(membersRef);
            return membersSnapshot.docs.map(doc => ({
                id: doc.id,
                branchId: doc.data().branchId,
                baptised: doc.data().baptised || false
            }));
        },
        enabled: branchesData.length > 0
    });
    
    // Process branches with member counts
    const branches = useMemo(() => {
        if (branchesLoading || membersLoading) return [];
        
        // Create a map of branch counts
        const branchCounts = {};
        
        // Initialize counts for all branches
        branchesData.forEach(branch => {
            branchCounts[branch.id] = { members: 0, baptised: 0 };
        });
        
        // Count members per branch
        membersData.forEach(member => {
            if (member.branchId && branchCounts[member.branchId]) {
                branchCounts[member.branchId].members++;
                if (member.baptised) {
                    branchCounts[member.branchId].baptised++;
                }
            }
        });
        
        // Merge counts with branch data
        return branchesData.map(branch => ({
            ...branch,
            members: branchCounts[branch.id]?.members || 0,
            baptised: branchCounts[branch.id]?.baptised || 0,
            contact: branch.phone || 'No contact info'
        }));
    }, [branchesData, membersData, branchesLoading, membersLoading]);
    
    // Geocode postcodes to get coordinates
    useEffect(() => {
        const geocodeBranches = async () => {
            if (!branches.length) return;
            
            const branchesWithCoordinates = [];
            
            for (const branch of branches) {
                if (!branch.postCode) continue;
                
                try {
                    // Use a geocoding service to convert postcode to coordinates
                    // Note: In a production app, you should use a proper geocoding service with your API key
                    const response = await axios.get(
                        `https://api.postcodes.io/postcodes/${encodeURIComponent(branch.postCode)}`
                    );
                    
                    if (response.data && response.data.result) {
                        const { latitude, longitude } = response.data.result;
                        
                        branchesWithCoordinates.push({
                            ...branch,
                            position: {
                                lat: latitude,
                                lng: longitude
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error geocoding ${branch.name}:`, error);
                    // Add branch without coordinates
                    branchesWithCoordinates.push(branch);
                }
            }
            
            setBranchLocations(branchesWithCoordinates);
            
            // If we have locations, center the map on the first one
            if (branchesWithCoordinates.length > 0 && branchesWithCoordinates[0].position) {
                setMapCenter(branchesWithCoordinates[0].position);
            }
        };
        
        geocodeBranches();
    }, [branches]);
    
    // Calculate totals
    const totalBranches = branches.length;
    const totalMembers = branches.reduce((sum, branch) => sum + branch.members, 0);
    const totalBaptised = branches.reduce((sum, branch) => sum + branch.baptised, 0);
    
    // Handle marker click
    const handleMarkerClick = useCallback((branch) => {
        setSelectedBranch(branch);
        if (branch.position) {
            setMapCenter(branch.position);
            setMapZoom(14); // Zoom in when a branch is selected
        }
    }, []);
    
    // Close info window
    const handleInfoWindowClose = useCallback(() => {
        setSelectedBranch(null);
        setMapZoom(6); // Zoom out when info window is closed
    }, []);
    
    // Map reference
    const [map, setMap] = useState(null);
    const mapRef = useRef(null);
    
    const onMapLoad = useCallback((map) => {
        setMap(map);
    }, []);
    
    const onMapClick = useCallback(() => {
        setSelectedBranch(null);
        setMapZoom(6); // Reset zoom when clicking on the map
    }, []);
    
    // Clean up map instance on unmount
    useEffect(() => {
        return () => {
            if (map) {
                // Clean up map instance
                setMap(null);
            }
        };
    }, [map]);

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
                    <MapContainer ref={mapRef}>
                        {mapsApiLoaded ? (
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={mapCenter}
                                zoom={mapZoom}
                                options={mapOptions}
                                onLoad={onMapLoad}
                                onClick={onMapClick}
                                mapContainerClassName="google-map-container"
                            >
                                {branchLocations.map(branch => {
                                    // Only render markers for branches with coordinates
                                    if (!branch.position || !branch.position.lat) return null;
                                    
                                    return (
                                        <Marker
                                            key={branch.id}
                                            position={branch.position}
                                            onClick={() => handleMarkerClick(branch)}
                                            icon={{
                                                url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png'
                                            }}
                                        />
                                    );
                                })}
                                
                                {selectedBranch && selectedBranch.position && (
                                    <InfoWindow
                                        position={selectedBranch.position}
                                        onCloseClick={handleInfoWindowClose}
                                    >
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{selectedBranch.name}</h3>
                                            <p style={{ margin: '0 0 3px 0', fontSize: '14px' }}>{selectedBranch.city || selectedBranch.location}</p>
                                            <p style={{ margin: '0 0 3px 0', fontSize: '14px' }}>Members: {selectedBranch.members}</p>
                                            <p style={{ margin: '0', fontSize: '14px' }}>Baptised: {selectedBranch.baptised}</p>
                                            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Contact: {selectedBranch.contact}</p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </GoogleMap>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                Loading Google Maps...
                            </div>
                        )}
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