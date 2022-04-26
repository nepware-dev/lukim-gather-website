import React, {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {BsArrowLeftShort} from 'react-icons/bs';

import cs from '@utils/cs';

import Navbar from '@components/Navbar';
import InputField from '@components/InputField';
import Button from '@components/Button';

const classes = {
  mainContainer: 'bg-color-bg w-[100%] min-h-[100vh]',
  container: 'max-w-[1440px] mx-auto px-[5vw]',
  contentContainer: 'flex items-center justify-center pt-32',
  contentWrapper: 'max-w-[473px] px-[32px] py-[42px] rounded-3xl bg-[#fff]',
  header: 'flex items-center gap-[21px] mb-4',
  title: 'font-inter font-semibold text-[32px] text-[#101828]',
  info: 'font-inter font-normal text-base text-[#585D69] mb-8',
  button: 'mt-[28px] mb-[32px]',
  email: 'font-semibold text-[#101828]',
  textWrapper: 'flex gap-[8px]',
  text: 'font-inter font-normal text-base text-[#585D69]',
  sendAgain: 'font-inter font-semibold text-base text-[#00518B]',
  cursor: 'cursor-pointer',
};

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
    <div className={classes.mainContainer}>
      <div className={classes.container}>
        <Navbar />
        <div
          className={cs(classes.contentContainer, ['hidden', showMailSentInfo])}
        >
          <div className={classes.contentWrapper}>
            <div className={classes.header}>
              <BsArrowLeftShort
                size={35}
                color='#101828'
                onClick={handleGoBack}
                className={classes.cursor}
              />
              <h2 className={classes.title}>Forgot password?</h2>
            </div>
            <p className={classes.info}>
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
              className={classes.button}
              onClick={handleSendResetMail}
              disabled={!email}
            />
          </div>
        </div>
        <div
          className={cs(classes.contentContainer, [
            'hidden',
            !showMailSentInfo,
          ])}
        >
          <div className={classes.contentWrapper}>
            <div className={classes.header}>
              <BsArrowLeftShort
                size={35}
                color='#101828'
                onClick={handleHideMailSentInfo}
                className={classes.cursor}
              />
              <h2 className={classes.title}>Forgot password?</h2>
            </div>
            <p className={classes.info}>
              We’ve sent an email to
              <span className={classes.email}>{` ${email}`}</span>
              . Please check
              your inbox and follow instructions to reset your password.
            </p>
            <div className={classes.textWrapper}>
              <p className={classes.text}>{'Didn\'t receive email?'}</p>
              <div className={classes.cursor}>
                <p className={classes.sendAgain}>Send it again</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
