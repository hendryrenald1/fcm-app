import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as HeadImage } from '../../assets/front-image.svg'
import { FormInput } from '../form-input/form-input.component';
import { Button } from '../button/button.component';
import Spacer from '../spacer/spacer.component';



const LoginContainer = styled.div`
    background: #ECE7E0;
    // background: linear-gradient(135deg,#A7266A, #DA4E5F, #FFBD42, #F9F871);
    display: flex;
    flex : 2;    
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const LoginCover = styled.div`
padding: 40px;
display: flex;

border-radius: 19.252px;
border: 2.004px solid #FFF;
background: linear-gradient(113deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 252, 252, 0.20) 100%);
backdrop-filter: blur(15.03330135345459px);
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;


const LoginInfoContainer = styled.div`
  
    display: flex;
    flex-direction: column ;
    align-items:  left;
    justify-content: center;
    
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const Header1 = styled.h1`

    font-family: "Kumbh Sans", sans-serif;
    color: #62186D;
    font-size: 2rem;
`;

const Header2 = styled.h2`  
    font-family: "Kumbh Sans", sans-serif;
    font-size: 1.5rem;
    font-weight: 400;
`;

const Header4 = styled.h4`
    margin : 10px 0;
    font-family: "Kumbh Sans", sans-serif;
    font-size: 1rem;
    font-weight: 400;

`;

export const Login = () => {
    return (

     
            <LoginContainer>
                   <LoginCover>
                    <LoginInfoContainer>
                    <Logo width={100} height={100} />
                    <Header1>Faith Church Ministries</Header1>
                    <Header2>Login</Header2>
                    <Header4>Welcome back! Please login to your account to continue.</Header4>

                    <FormInput label="Email" type='email' placeholder='Email' />
                    <FormInput label="Password" type='password' placeholder='Password' />
                    <Spacer height='2rem' />
                    <Button type='submit'>Login</Button>


                </LoginInfoContainer>
                </LoginCover>
                    <ImageContainer>
                    <HeadImage width={700} height={700} />  
                </ImageContainer>
            </LoginContainer>
        
    )
}