import React, {useCallback, useEffect, useState} from 'react';
import {
  Link, useLocation, useNavigate,
} from 'react-router-dom';
import {gql, useMutation} from '@apollo/client';

import Navbar from '@components/Navbar';
import InputField from '@components/InputField';
import Button from '@components/Button';

import useToast from '@hooks/useToast';

import classes from './styles';

const PASSWORD_RESET_CHANGE = gql`
    mutation PasswordResetChange($data: PasswordResetChangeInput!) {
        passwordResetChange(data: $data) {
            ok
        }
    }
`;

const ResetPassword = () => {
  const location: {state: any} = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!location?.state?.username || !location?.state?.identifier) {
      navigate(-1);
    }
  }, [location?.state?.identifier, location?.state?.username, navigate]);

  const [passwordResetChange, {loading}] = useMutation(PASSWORD_RESET_CHANGE, {
    onCompleted: () => {
      location.state = null;
      navigate('/login');
      toast('success', 'New password saved, You can now login with your credentials');
    },
    onError: (err) => {
      setError(String(err));
      toast('error', String(err) || 'something went wrong.');
    },
  });

  const handleSaveNewPassword = useCallback(async () => {
    await passwordResetChange({
      variables: {
        data: {
          username: location?.state?.username,
          password: newPassword,
          rePassword: newPassword,
          identifier: location?.state?.identifier,
        },
      },
    });
  }, [passwordResetChange, location?.state?.username, location?.state?.identifier, newPassword]);

  const handleNewPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value);
    },
    [],
  );

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
              value={newPassword}
              placeholder='Enter your new password'
              password
              onChange={handleNewPasswordChange}
            />
            <Button
              text='Save new password'
              className={classes.button}
              onClick={handleSaveNewPassword}
              loading={!error && loading}
              disabled={!newPassword}
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
