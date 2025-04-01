import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FormInput } from '../../components/form-input/form-input.component';
import { Button } from '../../components/button/button.component';
import { signInUser } from '../../utils/firebase/firebase.utils';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as HeadImage } from '../../assets/front-image.svg'
import Spacer from '../../components/spacer/spacer.component';


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

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInUser(email, password);
      navigate('/home');
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email');
          break;
        case 'auth/wrong-password':
          setError('Wrong password');
          break;
        default:
          setError('Error signing in');
      }
    }
  };

  return (

    <LoginContainer>
                   <LoginCover>
                    <LoginInfoContainer>
                    <Logo width={100} height={100} />
                    <Header1>Faith Church Ministries</Header1>
                    <Header2>Login</Header2>
                    <Header4>Welcome back! Please login to your account to continue.</Header4>
                    <Spacer height='2rem' />
                    <FormInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
          <Spacer height='2rem' />
        <FormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
                    <Spacer height='2rem' />
                    <Button onClick={handleSubmit}>Sign In</Button>
                    {error && <ErrorMessage>{error}</ErrorMessage>}

                </LoginInfoContainer>
                </LoginCover>
                    <ImageContainer>
                    <HeadImage width={700} height={700} />  
                </ImageContainer>
            </LoginContainer>


  );
};

export default Login;
