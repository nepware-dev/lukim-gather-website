import React, {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';

import Navbar from '@components/Navbar';
import InputField from '@components/InputField';
import Button from '@components/Button';

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
    <div className='bg-color-bg w-[100%] min-h-[100vh]'>
      <div className='max-w-[1440px] mx-auto px-[5vw]'>
        <Navbar />
        <div className='flex items-center justify-center pt-32'>
          <div className='max-w-[473px] px-[32px] py-[42px] rounded-3xl bg-[#fff]'>
            <h2 className='font-inter font-semibold text-[32px] text-[#101828] mb-4'>
              Reset Password
            </h2>
            <p className='font-inter font-normal text-base text-[#585D69] mb-8'>
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
              className='mt-[28px] mb-[32px]'
              onClick={handleSaveNewPassword}
            />
            <div className='flex gap-[8px]'>
              <p className='font-inter font-normal text-base text-[#585D69]'>
                Go back to
              </p>
              <Link to='/login'>
                <span className='font-inter font-semibold text-base text-[#00518B]'>
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
