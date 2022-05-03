import React, {useState, useCallback, useEffect} from 'react';
import {gql, useMutation} from '@apollo/client';
import {Link, useNavigate} from 'react-router-dom';

import Button from '@components/Button';
import InputField from '@components/InputField';
import Navbar from '@components/Navbar';
import {dispatchLogin} from '@services/dispatch';

const classes = {
  mainContainer: 'bg-color-bg w-[100%] min-h-[100vh]',
  container: 'max-w-[1440px] mx-auto px-[5vw]',
  contentContainer: 'flex items-center justify-center pt-16',
  contentWrapper: 'max-w-[473px] px-[32px] py-[42px] rounded-3xl bg-[#fff]',
  title: 'font-interSemibold text-[32px] text-[#101828] text-center mb-4',
  info: 'font-inter text-base text-[#585D69] text-center mb-8',
  inputsWrapper: 'flex flex-col gap-[24px]',
  text: 'mb-6 mt-1 text-right text-color-blue font-interSemibold text-base',
  error: 'text-color-red font-inter text-base mb-2',
};

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
                placeholder='Enter your Email address'
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
              <p className={classes.text}>Forget Password?</p>
            </Link>
            {error && <p className={classes.error}>{error}</p>}
            <Button
              text='Login'
              onClick={handleLogin}
              loading={loading}
              disabled={!username || !password}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
