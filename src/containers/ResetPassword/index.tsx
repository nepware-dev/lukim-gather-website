import React, {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';

import Navbar from '@components/Navbar';
import InputField from '@components/InputField';
import Button from '@components/Button';

const classes = {
  mainContainer: 'bg-color-bg w-[100%] min-h-[100vh]',
  container: 'max-w-[1440px] mx-auto px-[5vw]',
  contentContainer: 'flex items-center justify-center pt-32',
  contentWrapper: 'max-w-[473px] px-[32px] py-[42px] rounded-3xl bg-[#fff]',
  title: 'font-interSemibold text-[32px] text-[#101828] mb-4',
  info: 'font-inter text-base text-[#585D69] mb-8',
  button: 'mt-[28px] mb-[32px]',
  wrapper: 'flex gap-[8px]',
  goBack: 'font-inter text-base text-[#585D69]',
  logIn: 'font-interSemibold text-base text-[#00518B]',
};

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
