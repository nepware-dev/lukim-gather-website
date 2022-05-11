import React, {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';

import Navbar from '@components/Navbar';
import InputField from '@components/InputField';
import Button from '@components/Button';

import classes from './styles';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>('');

  const handleNewPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value);
    },
    [],
  );

  const handleSaveNewPassword = useCallback(() => {
    setNewPassword('');
  }, []);

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
