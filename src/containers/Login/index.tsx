import React, {useState, useCallback} from 'react';
import {gql, useMutation} from '@apollo/client';
import {useNavigate} from 'react-router-dom';

import Button from '@components/Button';

import {dispatchLogin} from '../../services/dispatch';

const LOGIN = gql`
    mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            token
            refreshToken
            user {
                firstName
                lastName
                email
            }
        }
    }
`;

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>();

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const [login, {loading}] = useMutation(LOGIN, {
    onCompleted: ({tokenAuth}) => {
      const {token, refreshToken, user} = tokenAuth;
      dispatchLogin(token, refreshToken, user);
      navigate('/dashboard');
    },
    onError: ({graphQLErrors}) => {
      setError(graphQLErrors[0].message);
    },
  });
  const handleLogin = useCallback(async () => {
    setError('');
    await login({variables: {username, password}});
  }, [username, password, login]);

  return (
    <main className='bg-color-bg w-[100%] h-screen grid'>
      <div className='place-self-center bg-color-white px-8 py-10 w-fit rounded-3xl w-96'>
        <h2 className='text-[#101828] text-center font-inter font-semibold text-[32px] mb-4'>Welcome back</h2>
        <p className='text-[#585D69] text-center font-inter font-normal text-base mb-10'>Please enter your details.</p>
        <p className='text-color-text-grey font-inter font-medium text-base mb-2'>Username</p>
        <input
          type='text'
          value={username}
          placeholder='Enter your username'
          onChange={handleUsernameChange}
          className='w-[100%] rounded-lg p-2 border border-color-border font-inter font-regular text-base'
        />
        <p className='text-color-text-grey font-inter font-medium text-base mt-5 mb-2'>Password</p>
        <input
          type='password'
          value={password}
          placeholder='Enter your password'
          onChange={handlePasswordChange}
          className='w-[100%] rounded-lg p-2 border border-color-border font-inter font-regular text-base'
        />
        <p className='mb-6 mt-1 text-right text-color-blue font-inter font-semibold text-base'>Forget Password?</p>
        {error && <p className='text-color-red font-inter font-regular text-base mb-2'>{error}</p>}
        <Button text='Login' onClick={handleLogin} loading={loading} />
      </div>
    </main>
  );
};
export default Login;
