import React, {useState, useCallback} from 'react';
import {gql, useMutation} from '@apollo/client';
import {Link, useNavigate} from 'react-router-dom';
import {isValidPhoneNumber, parsePhoneNumber} from 'libphonenumber-js';

import {dispatchLogin} from '@services/dispatch';
import useToast from '@hooks/useToast';

import Button from '@components/Button';
import InputField from '@components/InputField';
import Navbar from '@components/Navbar';
import SurveyTab from '@components/SurveyTab';

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
                organization
                avatar
                isStaff
                phoneNumber
                hasPassword
            }
        }
    }
`;

const PHONE_NUMBER_CONFIRM = gql`
    mutation PhoneNumberConfirm($data: PhoneNumberConfirmInput!) {
        phoneNumberConfirm(data: $data) {
            ok
            errors
        }
    }
`;

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string>();
  const [selectedTab, setSelectedTab] = useState<string>('email');

  const handlePhoneSelect = useCallback(
    () => {
      setSelectedTab('phone');
      setUsername('');
      setPassword('');
    },
    [],
  );

  const handleEmailSelect = useCallback(() => {
    setSelectedTab('email');
    setPhoneNumber('');
  }, [setSelectedTab]);

  const [login, {loading}] = useMutation(LOGIN, {
    onCompleted: ({tokenAuth}) => {
      const {token, refreshToken, user} = tokenAuth;
      dispatchLogin(token, refreshToken, user);
      toast('success', 'You are successfully logged in');
      navigate('/dashboard');
    },
    onError: ({graphQLErrors}) => {
      setError(graphQLErrors[0].message);
      toast(
        'error',
        graphQLErrors[0]?.message
                    || 'Something went wrong, Please enter valid credentials',
      );
    },
  });

  const handleLogin = useCallback(async () => {
    setError('');
    await login({variables: {username, password}});
  }, [username, password, login]);

  const [phoneConfirm, {loading: phoneConfirmLoading}] = useMutation(
    PHONE_NUMBER_CONFIRM,
    {
      onCompleted: () => {
        const ph = parsePhoneNumber(phoneNumber, 'PG');
        const phone = ph?.formatInternational().replace(/\s/g, '');
        toast('success', `OTP sent to your phone number ${phone}`);
        navigate('/verify-phone', {
          state: {
            username: phone,
          },
        });
      },
      onError: ({graphQLErrors}) => {
        setError(graphQLErrors[0].message);
        if (graphQLErrors[0].message.includes('been sent')) {
          const ph = parsePhoneNumber(phoneNumber, 'PG');
          const phone = ph?.formatInternational().replace(/\s/g, '');
          navigate('/verify-phone', {
            state: {
              username: phone,
            },
          });
        }
        toast(
          'error',
          graphQLErrors[0]?.message
                        || 'Something went wrong, Please enter valid credentials',
        );
      },
    },
  );

  const handlePhoneLogin = useCallback(async () => {
    setError('');
    if (isValidPhoneNumber(phoneNumber)) {
      const ph = parsePhoneNumber(phoneNumber, 'PG');
      const phone = ph?.formatInternational().replace(/\s/g, '');
      await phoneConfirm({
        variables: {
          data: {username: phone},
        },
      });
    } else {
      toast('error', 'Invalid Phone number.');
    }
  }, [phoneConfirm, phoneNumber, toast]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!phoneNumber) {
        toast('error', 'Phone number is required');
      } else {
        handlePhoneLogin();
      }
    },
    [phoneNumber, toast, handlePhoneLogin],
  );

  const handleEmailFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!username || !password) {
        toast('error', 'Email and password are required');
      } else {
        handleLogin();
      }
    },
    [handleLogin, username, password, toast],
  );

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

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhoneNumber(e.target.value);
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
            <SurveyTab
              text='Email'
              isActive={selectedTab === 'email'}
              onClick={handleEmailSelect}
              className='w-1/2 rounded-l-lg'
            />
            <SurveyTab
              text='Phone'
              isActive={selectedTab === 'phone'}
              onClick={handlePhoneSelect}
              className='w-1/2 rounded-r-lg'
            />
            {selectedTab === 'email' ? (
              <form onSubmit={handleEmailFormSubmit}>
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
                  <p className={classes.text}>
                    Forgot Password?
                  </p>
                </Link>
                <Button
                  type='submit'
                  text='Login'
                  loading={!error && loading}
                  disabled={!username || !password}
                />
              </form>
            ) : (
              <form
                className={classes.inputsWrapper}
                onSubmit={handleFormSubmit}
              >
                <InputField
                  title='Phone Number'
                  value={phoneNumber}
                  placeholder='Eg. +9779845582638'
                  onChange={handlePhoneChange}
                />
                <Button
                  type='submit'
                  text='Continue'
                  loading={!error && phoneConfirmLoading}
                  disabled={!phoneNumber}
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
