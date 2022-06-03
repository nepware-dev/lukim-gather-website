import React, {useState, useCallback, useEffect} from 'react';
import {gql, useMutation} from '@apollo/client';
import {Link, useNavigate} from 'react-router-dom';

import {dispatchLogin} from '@services/dispatch';
import useToast from '@hooks/useToast';

import Button from '@components/Button';
import InputField from '@components/InputField';
import Navbar from '@components/Navbar';

import classes from './styles';

const LOGIN = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      refreshToken
      user {
        id
        firstName
        lastName
        email
        isStaff
      }
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>();

  const [login, {loading}] = useMutation(LOGIN, {
    onCompleted: ({tokenAuth}) => {
      const {token, refreshToken, user} = tokenAuth;
      dispatchLogin(token, refreshToken, user);
      toast('success', 'You are successfully logged in');
      navigate('/dashboard');
    },
    onError: ({graphQLErrors}) => {
      setError(graphQLErrors[0].message);
      toast('error', graphQLErrors[0]?.message || 'Something went wrong, Please enter valid credentials');
    },
  });

  const handleLogin = useCallback(async () => {
    setError('');
    await login({variables: {username, password}});
  }, [username, password, login]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (!username || !password) return;
        handleLogin();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handleLogin, password, username]);

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    },
    [],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    [],
  );

  return (
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <Navbar hideButton />
        <div className={classes.contentContainer}>
          <div className={classes.contentWrapper}>
            <h2 className={classes.title}>Welcome back</h2>
            <p className={classes.info}>Please enter your details.</p>
            <div className={classes.inputsWrapper}>
              <InputField
                title='Username'
                value={username}
                placeholder='Enter your email address'
                onChange={handleUsernameChange}
              />
              <InputField
                title='Password'
                value={password}
                placeholder='Enter your password'
                password
                onChange={handlePasswordChange}
              />
            </div>
            <Link to='/forgot-password'>
              <p className={classes.text}>Forgot Password?</p>
            </Link>
            <Button
              text='Login'
              onClick={handleLogin}
              loading={!error && loading}
              disabled={!username || !password}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
