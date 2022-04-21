import React, {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {BsArrowLeftShort} from 'react-icons/bs';

import Navbar from '@components/Navbar';
import InputField from '@components/InputField';
import Button from '@components/Button';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [showMailSentInfo, setShowMailSentInfo] = useState<boolean>(false);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    [],
  );

  const handleSendResetMail = useCallback(() => {
    setShowMailSentInfo(true);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleHideMailSentInfo = useCallback(() => {
    setShowMailSentInfo(false);
  }, []);

  return (
    <div className='bg-color-bg w-[100%] min-h-[100vh]'>
      <div className='max-w-[1440px] mx-auto px-[5vw]'>
        <Navbar />
        <div
          className={`flex items-center justify-center pt-32 ${
            showMailSentInfo && 'hidden'
          }`}
        >
          <div className='max-w-[473px] px-[32px] py-[42px] rounded-3xl bg-[#fff]'>
            <div className='flex items-center gap-[21px] mb-4'>
              <BsArrowLeftShort
                size={35}
                color='#101828'
                onClick={handleGoBack}
                className='cursor-pointer'
              />
              <h2 className='font-inter font-semibold text-[32px] text-[#101828]'>
                Forgot password?
              </h2>
            </div>
            <p className='font-inter font-normal text-base text-[#585D69] mb-8'>
              Enter the email address you used to create your Lukim Gather
              account. We’ll send you a password reset email.
            </p>
            <InputField
              title='Email address'
              value={email}
              placeholder='John@example'
              onChange={handleEmailChange}
            />
            <Button
              text='Send reset mail'
              className='mt-[28px] mb-[32px]'
              onClick={handleSendResetMail}
              disabled={!email}
            />
          </div>
        </div>
        <div
          className={`flex items-center justify-center py-32 ${
            !showMailSentInfo && 'hidden'
          }`}
        >
          <div className='max-w-[473px] px-[32px] py-[42px] rounded-3xl bg-[#fff]'>
            <div className='flex items-center gap-[21px] mb-4'>
              <BsArrowLeftShort
                size={35}
                color='#101828'
                onClick={handleHideMailSentInfo}
                className='cursor-pointer'
              />
              <h2 className='font-inter font-semibold text-[32px] text-[#101828]'>
                Forgot password?
              </h2>
            </div>
            <p className='font-inter font-normal text-base text-[#585D69] mb-8'>
              We’ve sent an email to
              <span className='font-semibold text-[#101828]'>
                {` ${email}`}
              </span>
              . Please check your inbox and follow instructions to reset your
              password.
            </p>
            <div className='flex gap-[8px]'>
              <p className='font-inter font-normal text-base text-[#585D69]'>
                {'Didn\'t receive email?'}
              </p>
              <div className='cursor-pointer'>
                <p className='font-inter font-semibold text-base text-[#00518B]'>
                  Send it again
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
