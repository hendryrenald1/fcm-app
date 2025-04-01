import { Outlet, Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from '../../assets/logo.svg';
import styled from "styled-components";
import Spacer from "../../components/spacer/spacer.component";
import { signOutUser } from '../../utils/firebase/firebase.utils';

const NavContainer = styled.div`
background: linear-gradient(113deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 252, 252, 0.20) 100%);
`;


const NavItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const ProfileContainer = styled.div`
    a {
        text-decoration: none;          
        color: black;
        font-size: 18px;
        padding: 5px 10px;
    }
`;

const MenuItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
`;


const MenuItems = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    ul {
        font-family: "Kumbh Sans", sans-serif;
        list-style: none;
        display: flex;
        gap: 40px;
        padding: 0;
    }

    li {
        position: relative;
    }

    a {
        text-decoration: none;
        color: black;
        font-size: 18px;
        padding: 5px 10px;
    }

    a:hover,
    a.active {
        color: blue;
    }

    a.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: blue;
    }
`;


export const Navigation = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOutUser();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <NavContainer>
            <NavItemContainer>
                <MenuItemContainer>
                    <Logo width={50} height={50} />
                    <Spacer width='40px' />
                    <MenuItems>
                        <ul>
                            <li><Link to="/home">Dashboard</Link></li>
                            <li><Link to="/members">Member</Link></li>
                            <li><Link to="/branches">Branches</Link></li>
                        </ul>
                    </MenuItems>
                </MenuItemContainer>
                <ProfileContainer>
                    <Link to="/profile">Profile</Link>
                    <Link 
                        to="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            handleSignOut();
                        }}
                        style={{ marginLeft: '20px', cursor: 'pointer' }}
                    >
                        Logout
                    </Link>
                </ProfileContainer>
            </NavItemContainer>
            <Outlet />



        </NavContainer>
    );
}
