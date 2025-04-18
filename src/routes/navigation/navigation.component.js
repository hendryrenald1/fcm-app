import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from '../../assets/logo.svg';
import styled from "styled-components";
import { signOutUser } from '../../utils/firebase/firebase.utils';

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f8f8;
`;


const NavItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 70px;
    background-color: #7B2A8A;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    
    a {
        text-decoration: none;          
        color: rgba(255, 255, 255, 0.9);
        font-size: 15px;
        font-weight: 500;
        padding: 8px 16px;
        border-radius: 6px;
        transition: all 0.2s ease;
        
        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }
    
    a:last-child {
        color: rgba(255, 255, 255, 0.9);
        
        &:hover {
            background-color: rgba(255, 255, 255, 0.15);
        }
    }
`;

const MenuItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
`;


const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    padding-right: 24px;
`;

const MenuItems = styled.div`
    display: flex;
    height: 100%;
    
    ul {
        height: 100%;
        font-family: "Kumbh Sans", sans-serif;
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;
    }

    li {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
    }

    a {
        height: 100%;
        display: flex;
        align-items: center;
        text-decoration: none;
        color: rgba(255, 255, 255, 0.8);
        font-size: 15px;
        font-weight: 500;
        padding: 0 20px;
        transition: all 0.2s ease;
        position: relative;
        
        &:hover {
            color: white;
        }
    }

    a.active {
        color: white;
        font-weight: 600;
    }

    a.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: white;
    }
`;


// Icons for the navigation
const DashboardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
        <path d="M3 3H10V10H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 3H21V10H14V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 14H10V21H3V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 14H21V21H14V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const MembersIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BranchesIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
        <path d="M6 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 9C18 11.3869 17.0518 13.6761 15.364 15.364C13.6761 17.0518 11.3869 18 9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const LogoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ProfileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        try {
            await signOutUser();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    
    // Function to check if a link is active
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <NavContainer>
            <NavItemContainer>
                <MenuItemContainer>
                    <LogoContainer>
                        <Logo width={40} height={40} />
                    </LogoContainer>
                    <MenuItems>
                        <ul>
                            <li>
                                <Link to="/home" className={isActive('/home') ? 'active' : ''}>
                                    <DashboardIcon /> Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/members" className={isActive('/members') ? 'active' : ''}>
                                    <MembersIcon /> Members
                                </Link>
                            </li>
                            <li>
                                <Link to="/branches" className={isActive('/branches') ? 'active' : ''}>
                                    <BranchesIcon /> Branches
                                </Link>
                            </li>
                        </ul>
                    </MenuItems>
                </MenuItemContainer>
                <ProfileContainer>
                    <Link to="/profile">
                        <ProfileIcon /> Profile
                    </Link>
                    <Link 
                        to="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            handleSignOut();
                        }}
                    >
                        <LogoutIcon /> Logout
                    </Link>
                </ProfileContainer>
            </NavItemContainer>
            <Outlet />
        </NavContainer>
    );
}
