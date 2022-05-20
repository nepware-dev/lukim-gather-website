import React, {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';
import {useMutation} from '@apollo/client';

import Navbar from '@components/Navbar';
import InputField from '@components/InputField';
import Button from '@components/Button';

import {PASSWORD_RESET_CHANGE} from '@services/gql';
import {dispatchLogout} from '@services/dispatch';

import classes from './styles';

const ResetPassword = () => {
  const [password, setPassword] = useState<string>('');

  const handleNewPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    [],
  );
  const [passwordResetChange, {loading}] = useMutation(PASSWORD_RESET_CHANGE, {
    onCompleted: () => {
      dispatchLogout();
    },
    onError: ({graphQLErrors}) => {
      console.log(graphQLErrors[0].message);
    },
  });

  const handleSaveNewPassword = useCallback(async () => {
    await passwordResetChange({
      variables: {
        data: {
          username: '',
          password,
          rePassword: password,
          identifier: '',
        },
      },
    });
  }, [passwordResetChange, password]);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <Navbar />
        <div className={classes.contentContainer}>
          <div className={classes.contentWrapper}>
            <h2 className={classes.title}>
              Reset Password
            </h2>
            <p className={classes.info}>
              Enter the new password for your Lukim Gather account.
            </p>
            <InputField
              title='New password'
              value={password}
              placeholder='Enter your new password'
              password
              onChange={handleNewPasswordChange}
            />
            <Button
              text='Save new password'
              className={classes.button}
              onClick={handleSaveNewPassword}
              disabled={!password || loading}
            />
            <div className={classes.wrapper}>
              <p className={classes.goBack}>
                Go back to
              </p>
              <Link to='/login'>
                <span className={classes.logIn}>
                  Log in
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
