import styled from "styled-components";


import { ReactComponent as Logo } from '../../assets/logo.svg';
import { Button } from '../../components/button/button.component';
import Spacer from '../../components/spacer/spacer.component';

const HomeContainer = styled.div`
    background: #ECE7E0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const HomeCover = styled.div`
    padding: 40px;
    display: flex;      
    border-radius: 19.252px;
    border: 2.004px solid #FFF;
    background: linear-gradient(113deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 252, 252, 0.20) 100%);
    backdrop-filter: blur(15.03330135345459px);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const HomeInfoContainer = styled.div`
    display: flex;
    flex-direction: column ;
    align-items:  left;
    justify-content: center;
`;


const Header1 = styled.h1`
    font-family: "Kumbh Sans", sans-serif;
    color: #62186D;
    font-size: 2rem;
`;

const Header2 = styled.h2`
    font-family: "Kumbh Sans", sans-serif;
    font-size: 1.5rem;
`;

const Header4 = styled.h4`
    font-family: "Kumbh Sans", sans-serif;
    font-size: 1rem;
`;




const Home = () => {
    return (
        <HomeContainer>
            <HomeCover>
                <HomeInfoContainer>
                    <Logo width={100} height={100} />
                    <Header1>Faith Church Ministries</Header1>
                    <Header2>Welcome to Faith Church Ministries</Header2>
                    <Header4>Join us in our mission to spread the word of God.</Header4>
                    <Spacer height='2rem' />
                    <Button>Get Started</Button>        
                </HomeInfoContainer>
            </HomeCover>
        </HomeContainer>    
    );
}
export default Home; 